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


// ─── Validación en tiempo real (blur por campo) ─────────────────────────
document.querySelector("#nombre").addEventListener("blur",
    validarNombre);
document.querySelector("#email").addEventListener("blur",
    validarEmail);
document.querySelector("#password").addEventListener("blur",
    validarPassword);
document.querySelector("#confirmar").addEventListener("blur",
    validarConfirmar);
document.querySelector("#telefono").addEventListener("blur",
    validarTelefono);
// Limpiar error al comenzar a escribir
document.querySelector("#confirmar").addEventListener("input", () => {
    if (document.querySelector("#confirmar").value)
        limpiarError("confirmar");
});


// ─── Manejo del envío───────────────────────────────────────────────────
const form = document.querySelector("#form-registro");
form.addEventListener("submit", (e) => {
    e.preventDefault(); // Siempre prevenir el envío por defecto
    // Ejecutar todas las validaciones
    const resultados = [
        validarNombre(),
        validarEmail(),
        validarPassword(),
        validarConfirmar(),
        validarTelefono(),
    ];
    const todoValido = resultados.every(r => r === true);
    if (todoValido) {
        // Mostrar mensaje de éxito
        const mensajeExito = document.querySelector("#mensaje-exito");
        mensajeExito.classList.remove("oculto");
        mensajeExito.classList.add("visible");
        // Limpiar formulario después de 2 segundos
        setTimeout(() => {
            form.reset();
            limpiarTodo();
            mensajeExito.classList.remove("visible");
            mensajeExito.classList.add("oculto");
        }, 2000);
    } else {
        // Enfocar el primer campo con error
        const primerInvalido = form.querySelector(".invalido");
        if (primerInvalido) primerInvalido.focus();
    }
});


// ─── Indicador de fortaleza de contraseña───────────────────────────────
function evaluarFortaleza(valor) {
    let puntos = 0;
    if (valor.length >= 8) puntos++;
    if (/[A-Z]/.test(valor)) puntos++;
    if (/[0-9]/.test(valor)) puntos++;
    if (/[^A-Za-z0-9]/.test(valor)) puntos++;
    const niveles = ["", "Débil", "Regular", "Buena", "Fuerte"];
    const colores = ["", "#C62828", "#F57F17", "#1565C0", "#2E7D32"];
    return { nivel: niveles[puntos], color: colores[puntos], puntos };
}
const campoPassword = document.querySelector("#password");
campoPassword.addEventListener("input", () => {
    const { nivel, color, puntos } = evaluarFortaleza(campoPassword.value);
    let indicador = document.querySelector("#fortaleza");
    if (!indicador) {
        indicador = document.createElement("span");
        indicador.id = "fortaleza";
        campoPassword.insertAdjacentElement("afterend", indicador);
    }
    indicador.textContent = puntos > 0 ? `Contraseña: ${nivel}` : "";
    indicador.style.color = color;
});