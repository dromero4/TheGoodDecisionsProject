export function validateShippingAddress(address) {
    const errors = {};

    const phoneRegex = /^[0-9+\s()-]{6,20}$/;
    const postalCodeRegex = /^[0-9]{5}$/;

    if (!address?.fullName?.trim()) {
        errors.fullName = "El nombre completo es obligatorio.";
    }

    if (!address?.phone?.trim()) {
        errors.phone = "El teléfono es obligatorio.";
    } else if (!phoneRegex.test(address.phone.trim())) {
        errors.phone = "Introduce un teléfono válido.";
    }

    if (!address?.street?.trim()) {
        errors.street = "La calle es obligatoria.";
    }

    if (!address?.number?.trim()) {
        errors.number = "El número es obligatorio.";
    }

    if (!address?.postalCode?.trim()) {
        errors.postalCode = "El código postal es obligatorio.";
    } else if (!postalCodeRegex.test(address.postalCode.trim())) {
        errors.postalCode = "El código postal debe tener 5 dígitos.";
    }

    if (!address?.city?.trim()) {
        errors.city = "La ciudad es obligatoria.";
    }

    if (!address?.province?.trim()) {
        errors.province = "La provincia es obligatoria.";
    }

    if (!address?.country?.trim()) {
        errors.country = "El país es obligatorio.";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
}