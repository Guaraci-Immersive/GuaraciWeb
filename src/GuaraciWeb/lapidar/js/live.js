const API_URL = "http://localhost:8080/api/metaquest";
const WEBSOCKET_URL = "http://localhost:8080/ws-live";

let stompClient = null;
let peerConnection = null;
let currentPatientId = null;
let pendingIceCandidates = [];
let hasRemoteDescription = false;

const rtcConfig = {
    iceServers: [
        {
            urls: "stun:stun.l.google.com:19302"
        }
    ]
};

function getLiveScreen() {
    return document.querySelector("#live-screen");
}

function showLiveVideo() {
    const liveScreen = getLiveScreen();

    if (!liveScreen) {
        return null;
    }

    liveScreen.classList.add("live-card__screen--connected");

    liveScreen.innerHTML = `
        <video
            id="videoFisio"
            class="live-card__video"
            autoplay
            playsinline
        ></video>
    `;

    return document.querySelector("#videoFisio");
}

function showLiveOffline() {
    const liveScreen = getLiveScreen();

    if (!liveScreen) {
        return;
    }

    liveScreen.classList.remove("live-card__screen--connected");

    liveScreen.innerHTML = `
        <div class="live-card__offline">
            <div
                class="live-card__offline-icon"
                aria-hidden="true"
            >
                ◉
            </div>

            <h3 class="live-card__offline-title">
                Sessão offline
            </h3>

            <p class="live-card__offline-description">
                Insira o ID do paciente e entre na sessão
                para iniciar o atendimento.
            </p>
        </div>
    `;
}

function createPeerConnection(pacienteId) {
    const video = showLiveVideo();

    if (!video) {
        return null;
    }

    const pc = new RTCPeerConnection(rtcConfig);

    pc.ontrack = (event) => {
        if (event.streams && event.streams[0]) {
            video.srcObject = event.streams[0];
            video.play().catch((error) => {
                console.warn("Não foi possível iniciar o vídeo automaticamente:", error);
            });
        }
    };

    pc.onicecandidate = (event) => {
        if (!event.candidate || !stompClient) {
            return;
        }

        const signal = {
            type: "ICE_CANDIDATE",
            candidate: event.candidate.candidate,
            sdpMid: event.candidate.sdpMid,
            sdpMLineIndex: event.candidate.sdpMLineIndex
        };

        stompClient.send(
            `/app/signal/${pacienteId}`,
            {},
            JSON.stringify(signal)
        );
    };

    pc.onconnectionstatechange = () => {
        console.log(
            "Estado da conexão WebRTC:",
            pc.connectionState
        );

        if (pc.connectionState === "connected") {
            console.log("WebRTC conectado.");
        }

        if (
            pc.connectionState === "failed" ||
            pc.connectionState === "disconnected" ||
            pc.connectionState === "closed"
        ) {
            showLiveOffline();
        }
    };

    return pc;
}

async function handleSignal(message, pacienteId) {
    if (!peerConnection) {
        return;
    }

    const signal = JSON.parse(message.body);

    console.log("Sinal recebido:", signal);

    if (signal.type === "OFFER") {
        await peerConnection.setRemoteDescription({
            type: "offer",
            sdp: signal.sdp
        });

        hasRemoteDescription = true;

        for (const candidate of pendingIceCandidates) {
            await peerConnection.addIceCandidate(candidate);
        }

        pendingIceCandidates = [];

        const answer = await peerConnection.createAnswer();

        await peerConnection.setLocalDescription(answer);

        stompClient.send(
            `/app/signal/${pacienteId}`,
            {},
            JSON.stringify({
                type: "ANSWER",
                sdp: answer.sdp
            })
        );

        console.log("ANSWER enviada.");

        return;
    }

    if (signal.type === "ICE_CANDIDATE") {
        const candidate = {
            candidate: signal.candidate,
            sdpMid: signal.sdpMid,
            sdpMLineIndex: signal.sdpMLineIndex
        };

        if (!hasRemoteDescription) {
            pendingIceCandidates.push(candidate);
            return;
        }

        await peerConnection.addIceCandidate(candidate);

        console.log("ICE candidate recebido.");
    }
}

async function connectWebSocket(pacienteId) {
    return new Promise((resolve, reject) => {
        if (typeof SockJS === "undefined") {
            reject(
                new Error("SockJS não foi carregado.")
            );

            return;
        }

        if (typeof Stomp === "undefined") {
            reject(
                new Error("STOMP não foi carregado.")
            );

            return;
        }

        const socket = new SockJS(WEBSOCKET_URL);

        stompClient = Stomp.over(socket);

        stompClient.debug = null;

        stompClient.connect(
            {},
            () => {
                console.log(
                    "WebSocket conectado para o paciente:",
                    pacienteId
                );

                stompClient.subscribe(
                    `/topic/signal/${pacienteId}`,
                    async (message) => {
                        try {
                            await handleSignal(
                                message,
                                pacienteId
                            );
                        } catch (error) {
                            console.error(
                                "Erro ao processar sinal:",
                                error
                            );
                        }
                    }
                );

                console.log(
                    "Inscrito no tópico:",
                    `/topic/signal/${pacienteId}`
                );

                resolve();
            },
            (error) => {
                console.error(
                    "Erro na conexão WebSocket:",
                    error
                );

                reject(error);
            }
        );
    });
}

async function startLiveSession(pacienteId) {
    if (!pacienteId) {
        return null;
    }

    currentPatientId = pacienteId;
    pendingIceCandidates = [];
    hasRemoteDescription = false;

    try {
        peerConnection = createPeerConnection(pacienteId);

        if (!peerConnection) {
            throw new Error(
                "Não foi possível criar a conexão WebRTC."
            );
        }

        await connectWebSocket(pacienteId);

        const response = await fetch(
            `${API_URL}/live/${pacienteId}/entrar`,
            {
                method: "POST"
            }
        );

        if (!response.ok) {
            const message = await response.text();

            throw new Error(
                message ||
                `Erro ao iniciar transmissão: ${response.status}`
            );
        }

        const contentType = response.headers.get("content-type") || "";
        const result = contentType.includes("application/json")
            ? await response.json()
            : await response.text();

        console.log(
            "Transmissão iniciada:",
            result
        );

        return result;
    } catch (error) {
        console.error(
            "Erro ao iniciar transmissão:",
            error
        );

        disconnectLive();

        return null;
    }
}

function disconnectLive() {
    if (stompClient) {
        stompClient.disconnect(() => {
            console.log("WebSocket desconectado.");
        });

        stompClient = null;
    }

    if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
    }

    currentPatientId = null;
    pendingIceCandidates = [];
    hasRemoteDescription = false;

    showLiveOffline();
}

export function initializeLive() {
    showLiveOffline();
}

export async function connectLive(pacienteId) {
    return await startLiveSession(pacienteId);
}

export function disconnectLiveSession() {
    disconnectLive();
}