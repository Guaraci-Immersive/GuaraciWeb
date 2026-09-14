const API_URL = "http://localhost:8080/api/metaquest";

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

let patients = [];

export function initializePatient() {
    const patientName = document.querySelector("#current-patient-name");
    const patientIdInput = document.querySelector("#patient-id");

    if (!patientName || !patientIdInput) {
        return;
    }

    patientIdInput.addEventListener("input", (event) => {
        event.target.value = event.target.value.replace(/\D/g, "");
    });

    patientName.textContent = patientData.name;
}

export async function buscarMeusPacientes(emailDoFisio) {
    try {
        const response = await fetch(
            `${API_URL}/${encodeURIComponent(emailDoFisio)}/meus-pacientes`
        );

        if (!response.ok) {
            throw new Error(
                `Erro ao buscar pacientes: ${response.status}`
            );
        }

        const pacientes = await response.json();

        patients = Array.isArray(pacientes) ? pacientes : [];

        console.log("Pacientes recebidos da API:", patients);

        return patients;
    } catch (error) {
        console.error("Erro ao buscar pacientes:", error);

        patients = [];

        return [];
    }
}

export async function entrarNaTransmissao(pacienteId) {
    if (!pacienteId) {
        return null;
    }

    try {
        const response = await fetch(
            `${API_URL}/live/${pacienteId}/entrar`,
            {
                method: "POST"
            }
        );

        if (!response.ok) {
            const mensagem = await response.text();

            throw new Error(
                mensagem || `Erro ao entrar na transmissão: ${response.status}`
            );
        }

        const resultado = await response.json();

        console.log("Transmissão iniciada:", resultado);

        return resultado;
    } catch (error) {
        console.error("Erro ao entrar na transmissão:", error);

        return null;
    }
}

export function getPatientData() {
    return patientData;
}

export function getPatients() {
    return patients;
}