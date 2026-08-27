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

export function getPatientData() {
    return patientData;
}