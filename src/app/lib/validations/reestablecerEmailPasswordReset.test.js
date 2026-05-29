import { describe, it, expect } from "vitest";
import { validateEmailPasswordRecovery } from "./authValidation";

describe("validateEmailPasswordRecovery", () => {
    it("Deberia fallar si el correo está vacío", () => {
        const result = validateEmailPasswordRecovery({
            email: "",
        })

        expect(result.valid).toBe(false)
        expect(result.message).toBe("Introduce un correo")
    });

    it("Deberia fallar si el correo no tiene '@'", () => {
        const result = validateEmailPasswordRecovery({
            email: "d.romero2sapalomera.cat",
        })

        expect(result.valid).toBe(false)
        expect(result.message).toBe("El email no es valido")
    });

    it("Deberia pasar si esta todo correcto", () => {
        const result = validateEmailPasswordRecovery({
            email: "d.romero@sapalomera.cat",
        })

        expect(result.valid).toBe(true)
        expect(result.message).toBe(null)
    });
});