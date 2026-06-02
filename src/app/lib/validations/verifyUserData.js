export default function verifyUserData({ form }) {
    const errors = {};

    const phoneRegex = /^[0-9+\s()-]{6,20}$/;
    const postalCodeRegex = /^[0-9]{5}$/;

    if (!form?.name || !form.name.trim()) {
        errors.name = "El nombre es obligatorio.";
    }

    if (!form?.phone || !form.phone.trim()) {
        errors.phone = "El teléfono es obligatorio.";
    } else if (!phoneRegex.test(form.phone.trim())) {
        errors.phone = "Introduce un teléfono válido.";
    }

    const address = form?.address || {};
    const addressErrors = {};

    if (!address.fullName || !address.fullName.trim()) {
        addressErrors.fullName = "El nombre completo es obligatorio.";
    }

    if (!address.phone || !address.phone.trim()) {
        addressErrors.phone = "El teléfono de entrega es obligatorio.";
    } else if (!phoneRegex.test(address.phone.trim())) {
        addressErrors.phone = "Introduce un teléfono de entrega válido.";
    }

    if (!address.street || !address.street.trim()) {
        addressErrors.street = "La calle es obligatoria.";
    }

    if (!address.number || !address.number.trim()) {
        addressErrors.number = "El número es obligatorio.";
    }

    if (!address.postalCode || !address.postalCode.trim()) {
        addressErrors.postalCode = "El código postal es obligatorio.";
    } else if (!postalCodeRegex.test(address.postalCode.trim())) {
        addressErrors.postalCode = "El código postal debe tener 5 dígitos.";
    }

    if (!address.city || !address.city.trim()) {
        addressErrors.city = "La ciudad es obligatoria.";
    }

    if (!address.province || !address.province.trim()) {
        addressErrors.province = "La provincia es obligatoria.";
    }

    if (!address.country || !address.country.trim()) {
        addressErrors.country = "El país es obligatorio.";
    }

    if (Object.keys(addressErrors).length > 0) {
        errors.address = addressErrors;
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
}