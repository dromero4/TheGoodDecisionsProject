import { expect, it, describe } from "vitest";
import { validateRegister } from "./authValidation";

describe("validateRegister", () => {
    it("Debería fallar si el correo está vacío", () => {
        const result = validateRegister({
            email: "",
            name: "david romero",
            password: "1234567"
        });

        expect(result.valid).toBe(false)
        expect(result.message).toBe("Todos los campos son obligatorios")
    });

    it("Debería fallar si el nombre está vacío", () => {
        const result = validateRegister({
            email: "d.romero@sapalomera.cat",
            name: "",
            password: "1234567"
        });

        expect(result.valid).toBe(false)
        expect(result.message).toBe("Todos los campos son obligatorios")
    });

    it("Debería fallar si la contraseña está vacía", () => {
        const result = validateRegister({
            email: "d.romero@sapalomera.cat",
            name: "david romero",
            password: ""
        });

        expect(result.valid).toBe(false)
        expect(result.message).toBe("Todos los campos son obligatorios")
    });

    it("Debería fallar si el correo no contiene '@'", () => {
        const result = validateRegister({
            email: "d.romero2sapalomera.cat",
            name: "david romero",
            password: "1234567"
        });

        expect(result.valid).toBe(false)
        expect(result.message).toBe("El email no es valido")
    });

    it("Debería fallar si la contraseña tiene menos de 6 carácteres", () => {
        const result = validateRegister({
            email: "d.romero@sapalomera.cat",
            name: "david romero",
            password: "123"
        });

        expect(result.valid).toBe(false)
        expect(result.message).toBe("La contraseña tiene que tener 6 carácteres o más")
    });

    it("Debería pasar si esta todo correcto", () => {
        const result = validateRegister({
            email: "d.romero@sapalomera.cat",
            name: "david romero",
            password: "1234567"
        });

        expect(result.valid).toBe(true)
        expect(result.message).toBe(null)
    });
});