import { describe, it, expect } from "vitest";
import { validateLoginInput } from "./loginValidation";

describe("validateLoginInput", () => {
    it("Debería fallar si falta el email", () => {
        const result = validateLoginInput({
            email: "",
            password: "123456"
        })

        expect(result.valid).toBe(false);
        expect(result.message).toBe("Faltan datos obligatorios")
    });

    it("Debería fallar si falta la contraseña", () =>{
        const result = validateLoginInput({
            email: "test@test.es",
            password: ""
        });

        expect(result.valid).toBe(false)
        expect(result.message).toBe("Faltan datos obligatorios")
    });

    it("Debería fallar si el email no tiene '@'", () =>{
        const result = validateLoginInput({
            email: "test2test.es",
            password: ""
        });

        expect(result.valid).toBe(false)
        expect(result.message).toBe("El email no es valido")
    });   
    
    it("Debería pasar si email y password son correctos", () =>{
        const result = validateLoginInput({
            email: "test@test.es",
            password: "davidD1234%"
        });

        expect(result.valid).toBe(true)
        expect(result.message).toBe(null)
    });

    // it("Deberia fallar si el email y password son incorrectos", () => {
        
    // })
})