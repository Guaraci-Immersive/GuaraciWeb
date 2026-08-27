import { initializePatient } from "./patient.js";
import { initializeSession } from "./session.js";
import { initializeRealtime } from "./realtime.js";
import { initializeProfile } from "./profile.js";

document.addEventListener("DOMContentLoaded", () => {
    initializePatient();
    initializeSession();
    initializeRealtime();
    initializeProfile();
});