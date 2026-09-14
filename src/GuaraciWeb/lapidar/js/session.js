import { connectLive } from "./live.js";

const sessionForm = document.querySelector("#session-form");
const patientIdInput = document.querySelector("#patient-id");

export function initializeSession() {
    if (!sessionForm || !patientIdInput) {
        return;
    }

    sessionForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const patientId = patientIdInput.value.trim();

        if (!patientId) {
            patientIdInput.focus();
            return;
        }

        if (!/^\d+$/.test(patientId)) {
            patientIdInput.focus();
            return;
        }

        await connectLive(patientId);
    });
}