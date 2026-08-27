const sessionForm = document.querySelector("#session-form");
const patientIdInput = document.querySelector("#patient-id");
const liveScreen = document.querySelector("#live-screen");

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

    sessionForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const patientId = patientIdInput.value.trim();

        if (!patientId) {
            patientIdInput.focus();
            return;
        }

        updateLiveStatus(true);
    });
}