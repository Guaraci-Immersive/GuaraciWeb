import { enterTransmission } from "./api.js";

const sessionForm = document.querySelector("#session-form");
const patientIdInput = document.querySelector("#patient-id");
const liveScreen = document.querySelector("#live-screen");
const sessionStatus = document.querySelector("#session-status");

function updateSessionStatus(message, isError = false) {
    if (!sessionStatus) {
        return;
    }

    sessionStatus.textContent = message;
    sessionStatus.classList.toggle("session-form__status--error", isError);
}

function updateLiveStatus(isOnline) {
    if (!liveScreen) {
        return;
    }

    if (isOnline) {
        liveScreen.classList.add("live-card__screen--connected");

        liveScreen.innerHTML = `
            <div class="live-card__offline">
                <div
                    class="live-card__offline-icon"
                    aria-hidden="true"
                >
                    ●
                </div>

                <h3 class="live-card__offline-title">
                    Sessão pronta
                </h3>

                <p class="live-card__offline-description">
                    A sessão foi identificada e está pronta para futura conexão.
                </p>
            </div>
        `;

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

export function initializeSession() {
    if (!sessionForm || !patientIdInput) {
        return;
    }

    sessionForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const patientId = patientIdInput.value.trim();

        if (!patientId) {
            updateSessionStatus("Informe o ID do paciente.", true);
            patientIdInput.focus();
            return;
        }

        const submitButton = sessionForm.querySelector("button[type=submit]");

        if (submitButton) {
            submitButton.disabled = true;
        }

        updateSessionStatus("Iniciando transmissão...");

        try {
            const transmission = await enterTransmission(patientId);

            updateLiveStatus(true);
            updateSessionStatus("Sessão iniciada. Aguardando conexão do dispositivo.");
            console.log(
                "Tópico de sinalização:",
                transmission.topicoSignaling
            );
        } catch (error) {
            updateLiveStatus(false);
            updateSessionStatus(
                "Não foi possível iniciar a sessão. Verifique o ID e a API.",
                true
            );
            console.error("Não foi possível iniciar a transmissão:", error);
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
            }
        }
    });
}