import { describe, it, expect } from "vitest"
import { validatePasswordRecovery } from "./authValidation"

describe("validatePasswordRecovery", () => {
    it("Debería fallar si los campos están vacíos", () => {
        const result = validatePasswordRecovery({
            password: "",
            confirmedPassword: ""
        });

        expect(result.valid).toBe(false)
        expect(result.message).toBe("Los campos son obligatorios")
    });

    it("Debería fallar uno de los campos está vacío (1)", () => {
        const result = validatePasswordRecovery({
            password: "12345678",
            confirmedPassword: ""
        });

        expect(result.valid).toBe(false)
        expect(result.message).toBe("Los campos son obligatorios")
    });

    it("Debería fallar si uno de los campos está vacío (2)", () => {
        const result = validatePasswordRecovery({
            password: "",
            confirmedPassword: "12345678"
        });

        expect(result.valid).toBe(false)
        expect(result.message).toBe("Los campos son obligatorios")
    });

    it("Debería fallar si las contraseñas no coinciden", () => {
        const result = validatePasswordRecovery({
            password: "12345678",
            confirmedPassword: "123456789"
        });

        expect(result.valid).toBe(false)
        expect(result.message).toBe("Las contraseñas no coinciden, vuelve a intentarlo")
    });

    it("Debería fallar si la contraseña tiene menos de 6 carácteres", () => {
        const result = validatePasswordRecovery({
            password: "12",
            confirmedPassword: "12"
        });

        expect(result.valid).toBe(false)
        expect(result.message).toBe("La contraseña tiene que tener 6 carácteres o más")
    });

    it("Debería pasar si está todo correcto", () => {
        const result = validatePasswordRecovery({
            password: "1234567890",
            confirmedPassword: "1234567890"
        });

        expect(result.valid).toBe(true)
        expect(result.message).toBe(null)
    });
})