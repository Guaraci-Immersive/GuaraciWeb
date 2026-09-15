import { initializePatient } from "./patient.js";

import { initializeSession } from "./session.js";

import { initializeRealtime } from "./realtime.js";

import { initializeProfile } from "./profile.js";

import { initializeLive } from "./live.js";

document.addEventListener("DOMContentLoaded", () => {
    const queryEmail = new URLSearchParams(window.location.search).get("email");

    if (queryEmail) {
        localStorage.setItem("fisioEmail", queryEmail);
    }

    initializePatient(localStorage.getItem("fisioEmail"));
    initializeSession();

    initializeRealtime();

    initializeProfile();

    initializeLive();

});