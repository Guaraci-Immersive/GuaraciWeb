const API_BASE_URL = "http://localhost:8080/api/metaquest";

async function request(path, options = {}) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        headers: {
            "Content-Type": "application/json",
            ...options.headers
        },
        ...options
    });

    if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
    }

    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
        return response.json();
    }

    return response.text();
}

export function loginFisio(email, senha) {
    return request("/login", {
        method: "POST",
        body: JSON.stringify({
            email,
            senha
        })
    });
}

export function getPatientsByPhysio(emailDoFisio) {
    return request(
        `/${encodeURIComponent(emailDoFisio)}/meus-pacientes`
    );
}

export function enterTransmission(patientId) {
    return request(`/live/${patientId}/entrar`, {
        method: "POST"
    });
}

export function registerPatient(patientData) {
    return request("/cadastrar", {
        method: "POST",
        body: JSON.stringify(patientData)
    });
}