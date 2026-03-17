"use strict";
// ─── Funciones de retroalimentación ────────────────────────────────────
function mostrarError(campoId, mensaje) {
    const campo = document.querySelector(`#${campoId}`);
    const span = document.querySelector(`#error-${campoId}`);
    campo.classList.add("invalido");
    campo.classList.remove("valido");
    span.textContent = mensaje;
    span.classList.add("visible");
}
function limpiarError(campoId) {
    const campo = document.querySelector(`#${campoId}`);
    const span = document.querySelector(`#error-${campoId}`);
    campo.classList.remove("invalido");
    campo.classList.add("valido");
    span.textContent = "";
    span.classList.remove("visible");
}
function limpiarTodo() {
    ["nombre", "email", "password", "confirmar", "telefono"]
        .forEach(id => limpiarError(id));
}
// ─── Validadores por campo──────────────────────────────────────────────
function validarNombre() {
    const campo = document.querySelector("#nombre");
    if (campo.validity.valueMissing) {
        mostrarError("nombre", "El nombre es obligatorio.");
        return false;
    }
    if (campo.validity.tooShort) {
        mostrarError("nombre", `El nombre debe tener al menos
${campo.minLength} caracteres.`);
        return false;
    }
    limpiarError("nombre");
    return true;
}
function validarEmail() {
    const campo = document.querySelector("#email");
    if (campo.validity.valueMissing) {
        mostrarError("email", "El correo es obligatorio.");
        return false;
    }
    if (campo.validity.typeMismatch) {
        mostrarError("email", "El formato del correo no es válido.");
        return false;
    }
    limpiarError("email");
    return true;
}
function validarPassword() {
    const campo = document.querySelector("#password");
    if (campo.validity.valueMissing) {
        mostrarError("password", "La contraseña es obligatoria.");
        return false;
    }
    if (campo.validity.tooShort) {
        mostrarError("password", "La contraseña debe tener al menos 8 caracteres.");
        return false;
    }
    // Validación manual: al menos una mayúscula y un número
    const regex = /^(?=.*[A-Z])(?=.*\d).+$/;
    if (!regex.test(campo.value)) {
        mostrarError("password", "Debe incluir al menos una mayúscula y un número.");
        return false;
    }
    limpiarError("password");
    return true;
}
function validarConfirmar() {
    const password = document.querySelector("#password").value;
    const confirmar = document.querySelector("#confirmar").value;
    if (!confirmar) {
        mostrarError("confirmar", "La confirmación es obligatoria.");
        return false;
    }
    if (password !== confirmar) {
        mostrarError("confirmar", "Las contraseñas no coinciden.");
        return false;
    }
    limpiarError("confirmar");
    return true;
}
function validarTelefono() {
    const campo = document.querySelector("#telefono");
    // Campo opcional: si está vacío es válido
    if (!campo.value.trim()) { limpiarError("telefono"); return true; }
    if (campo.validity.patternMismatch) {
        mostrarError("telefono", "Solo dígitos, entre 7 y 15 caracteres.");
        return false;
    }
    limpiarError("telefono");
    return true;
}