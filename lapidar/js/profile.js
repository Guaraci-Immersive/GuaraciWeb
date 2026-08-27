const profileEditButton = document.querySelector(
    ".doctor-profile__edit"
);

const doctorProfile = {
    name: "Dr. Nome do Doutor",
    crm: "CRM 12345/SP",
    status: "Online"
};

export function initializeProfile() {
    if (!profileEditButton) {
        return;
    }

    profileEditButton.addEventListener("click", () => {
        console.log("Perfil selecionado para edição:", doctorProfile);
    });
}

export function getProfileData() {
    return doctorProfile;
}