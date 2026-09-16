import {
    connectLive,
    disconnectLiveSession
} from "./live.js";

const sessionForm = document.querySelector("#session-form");
const patientIdInput = document.querySelector("#patient-id");
const sessionStatus = document.querySelector("#session-status");

function updateSessionStatus(message, isError = false) {
    if (!sessionStatus) {
        return;
    }

    sessionStatus.textContent = message;
    sessionStatus.classList.toggle("session-form__status--error", isError);
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