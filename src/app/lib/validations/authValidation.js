// Validaciones frontend

// --- LOGIN
/*
  * Verifica que los campos no estén vacíos
  * Verifica que el correo contenga '@'
*/
export function validateLogin({ email, password }) {
  if (!email || !password) {
    return {
      valid: false,
      message: "Email y contraseña son obligatorios"
    }
  }

  if (!email.contains("@")) {
    return {
      valid: false,
      message: "El email no es valido"
    }
  }

  return {
    valid: true,
    message: null
  }
}


// --- REGISTER
/*
 * Verifica que los campos no estén vacíos
 * Verifica que el correo sea válido (@)
 * Verifica que la contraseña tenga más de 6 carácteres
*/
export function validateRegister({ email, name, password }) {
  if (!email || !password || !name ) {
    return {
      valid: false,
      message: "Email, nombre y contraseña son obligatorios"
    }
  }

  if (password.length <= 6) {
    return {
      valid: false,
      message: "La contraseña tiene que tener 6 carácteres o más"
    }
  }

  if (!email.contains("@")) {
    return {
      valid: false,
      message: "El email no es valido"
    }
  }

  return {
    valid: true,
    message: null
  }
}

// export function validatePasswordRecovery({ password, confirmedPassword }){

// }

