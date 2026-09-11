import { getPatientsByPhysio } from "./api.js";

const patientData = {
    id: "123456",
    name: "João da Silva",
    age: 35,
    gender: "Masculino",
    birthDate: "01/01/1989",
    phone: "(11) 98765-4321",
    email: "joaodasilva@email.com",
    location: "São Paulo - SP",
    insurance: "Saúde Vida",
    plan: "Premium",
    cardNumber: "123456789"
};

export async function initializePatient(emailDoFisio) {
    const patientName = document.querySelector("#current-patient-name");
    const patientIdInput = document.querySelector("#patient-id");

    if (!patientName || !patientIdInput) {
        return;
    }

    patientIdInput.addEventListener("input", (event) => {
        event.target.value = event.target.value.replace(/\D/g, "");
    });

    if (!emailDoFisio) {
        patientName.textContent = patientData.name;
        return;
    }

    try {
        const patients = await getPatientsByPhysio(emailDoFisio);
        const firstPatient = Array.isArray(patients) ? patients[0] : null;

        if (!firstPatient) {
            patientName.textContent = "Nenhum paciente encontrado";
            return;
        }

        patientName.textContent =
            firstPatient.name || firstPatient.nome || patientData.name;

        if (firstPatient.id || firstPatient.pacienteId) {
            patientIdInput.value = firstPatient.id || firstPatient.pacienteId;
        }
    } catch (error) {
        patientName.textContent = "Não foi possível carregar o paciente";
        console.error("Não foi possível carregar os pacientes:", error);
    }
}

export function getPatientData() {
    return patientData;
}