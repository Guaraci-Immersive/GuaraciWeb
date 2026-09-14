import { initializePatient } from "./patient.js";

import { initializeSession } from "./session.js";

import { initializeRealtime } from "./realtime.js";

import { initializeProfile } from "./profile.js";

import { initializeLive } from "./live.js";

document.addEventListener("DOMContentLoaded", () => {

    initializePatient();

    initializeSession();

    initializeRealtime();

    initializeProfile();

    initializeLive();

});