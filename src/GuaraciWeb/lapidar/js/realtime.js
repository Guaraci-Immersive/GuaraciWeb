const realtimeTimeline = document.querySelector(".realtime-timeline");

const realtimeEvents = [
    {
        time: "14:30",
        type: "success",
        text: "Paciente entrou na sala"
    },
    {
        time: "14:31",
        type: "primary",
        text: "Início da consulta"
    },
    {
        time: "14:35",
        type: "file",
        text: "Arquivo compartilhado:",
        file: "exame_lab.pdf"
    },
    {
        time: "14:40",
        type: "prescription",
        text: "Prescrição enviada"
    },
    {
        time: "14:45",
        type: "finished",
        text: "Consulta finalizada"
    }
];

// Tipos que aparecem como bolinha na timeline
const MARKER_TYPES = ["success", "primary"];

// Tipos que aparecem como ícone
const EVENT_ICONS = {
    file: "↗",
    prescription: "◇",
    finished: "⚑"
};

function escapeHtml(value) {
    const element = document.createElement("div");

    element.textContent = value;

    return element.innerHTML;
}

function renderIndicator(event) {
    if (MARKER_TYPES.includes(event.type)) {
        return `
            <span
                class="timeline-item__marker timeline-item__marker--${event.type}"
                aria-hidden="true"
            ></span>
        `;
    }

    return `
        <span
            class="timeline-item__icon"
            aria-hidden="true"
        >
            ${EVENT_ICONS[event.type] || "◇"}
        </span>
    `;
}

function renderContent(event) {
    const text = escapeHtml(event.text);

    if (event.type !== "file" || !event.file) {
        return `
            <div class="timeline-item__content">
                <span>${text}</span>
            </div>
        `;
    }

    const fileName = escapeHtml(event.file);

    return `
        <div class="timeline-item__content">
            <span>
                ${text}
                <strong>${fileName}</strong>
            </span>

            <button
                type="button"
                class="timeline-item__download"
                aria-label="Baixar ${fileName}"
            >
                <img
                    src="assets/icons/download-cinza.png"
                    alt=""
                >
            </button>
        </div>
    `;
}

function renderRealtimeEvents() {
    if (!realtimeTimeline) {
        return;
    }

    realtimeTimeline.innerHTML = "";

    realtimeEvents.forEach((event) => {
        const timelineItem = document.createElement("div");

        timelineItem.classList.add("timeline-item");

        timelineItem.innerHTML = `
            <time
                class="timeline-item__time"
                datetime="${event.time}"
            >
                ${event.time}
            </time>

            ${renderIndicator(event)}

            ${renderContent(event)}
        `;

        realtimeTimeline.appendChild(timelineItem);
    });
}

export function initializeRealtime() {
    renderRealtimeEvents();
}
