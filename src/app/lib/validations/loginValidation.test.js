import { describe, it, expect } from "vitest";
import { validateLogin } from "./authValidation";

describe("validateLogin", () => {
    it("Deberia fallar si el correo está vacío", () => {
        const result = validateLogin({
            email: "",
            password: "123456"
        })

        expect(result.valid).toBe(false)
        expect(result.message).toBe("Email y contraseña son obligatorios")
    });

    it("Deberia fallar si la contraseña está vacía", () => {
        const result = validateLogin({
            email: "d.romero@sapalomera.cat",
            password: ""
        })

        expect(result.valid).toBe(false)
        expect(result.message).toBe("Email y contraseña son obligatorios")
    });

    it("Deberia fallar si el correo contiene '@'", () => {
        const result = validateLogin({
            email: "d.romero2sapalomera.cat",
            password: "123456"
        })

        expect(result.valid).toBe(false)
        expect(result.message).toBe("El email no es valido")
    });

    it("Deberia pasar si esta todo correcto", () => {
        const result = validateLogin({
            email: "d.romero@sapalomera.cat",
            password: "123456"
        })

        expect(result.valid).toBe(true)
        expect(result.message).toBe(null)
    });
})