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
        text: "Arquivo compartilhado: exame_lab.pdf"
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

            <span
                class="timeline-item__marker timeline-item__marker--${event.type}"
                aria-hidden="true"
            ></span>

            <div class="timeline-item__content">
                <span>${event.text}</span>
            </div>
        `;

        realtimeTimeline.appendChild(timelineItem);
    });
}

export function initializeRealtime() {
    renderRealtimeEvents();
}