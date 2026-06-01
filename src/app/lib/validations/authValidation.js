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

  if (!email.includes("@")) {
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
  if (!email || !password || !name) {
    return {
      valid: false,
      message: "Todos los campos son obligatorios"
    }
  }

  if (!email.includes("@")) {
    return {
      valid: false,
      message: "El email no es valido"
    }
  }

  if (password.length <= 6) {
    return {
      valid: false,
      message: "La contraseña tiene que tener 6 carácteres o más"
    }
  }

  return {
    valid: true,
    message: null
  }
}

// --- REESTABLECER CONTRASEÑA
/*
 * Verifica que los campos no estén vacíos
 * Verifica que las contraseñas coincidan
 * Verifica que la contraseña tenga más de 6 carácteres
*/
export function validatePasswordRecovery( password, confirmedPassword ){
  if (!password || !confirmedPassword) {
    return {
      valid: false,
      message: "Los campos son obligatorios"
    }
  }
  if (password !== confirmedPassword) {
    return {
      valid: false,
      message: "Las contraseñas no coinciden, vuelve a intentarlo"
    }
  }

  if (password.length < 5 || confirmedPassword.length < 5) {
    return {
      valid: false,
      message: "La contraseña tiene que tener 6 carácteres o más"
    }
  }

  return {
    valid: true,
    message: null
  }
}

// --- REESTABLECER CONTRASEÑA (correo)
/*
 * Verifica que el campo no esté vacío
 * Verifica que el correo sea válido
*/
export function validateEmailPasswordRecovery({ email }){
  if (!email) {
    return {
      valid: false,
      message: "Introduce un correo"
    }
  }
  if (!email.includes("@")){
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
