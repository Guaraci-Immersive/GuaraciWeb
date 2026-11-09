import {
    connectLive,
    disconnectLiveSession
} from "./live.js";

const sessionForm = document.querySelector("#session-form");
const patientIdInput = document.querySelector("#patient-id");
const sessionStatus = document.querySelector("#session-status");

const ERROR_TIMEOUT_MS = 5000;
let statusTimer = null;

function updateSessionStatus(message, isError = false) {
    if (!sessionStatus) {
        return;
    }

    clearTimeout(statusTimer);

    sessionStatus.textContent = message;
    sessionStatus.classList.toggle("session-form__status--error", isError);

    // Erros somem sozinhos para não ficar poluindo o header
    if (isError) {
        statusTimer = setTimeout(() => {
            sessionStatus.textContent = "";
            sessionStatus.classList.remove("session-form__status--error");
        }, ERROR_TIMEOUT_MS);
    }
}

export function initializeSession() {
    if (!sessionForm || !patientIdInput) {
        return;
    }

    // Ao digitar de novo, a mensagem anterior deixa de fazer sentido
    patientIdInput.addEventListener("input", () => {
        updateSessionStatus("");
    });

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
            const transmission = await connectLive(patientId);

            if (!transmission) {
                throw new Error("A transmissão não foi iniciada.");
            }

            updateSessionStatus("Sessão iniciada. Aguardando conexão do dispositivo.");
            console.log(
                "Tópico de sinalização:",
                transmission.topicoSignaling
            );
        } catch (error) {
            disconnectLiveSession();
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