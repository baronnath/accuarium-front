const es = {
    general: {
        email: 'Correo electrónico',
        password: 'Contraseña',
        name: 'Nombre',
        signUp: 'Crear cuenta',
        login: 'Iniciar sesión',
        register: 'Registrarse',
    },
    validation: {
        email: {
            empty: 'El correo electrónico no puede estar vacío',
            notValid: '¡Uy! El correo electrónico no es válido',
        },
        password: {
            passwordEmpty: 'La contraseña no puede estar vacía',
        },
        name:{
            empty: 'El nombre no puede estar vacío',
        },
    },
    login: {
        forgotPassword: '¿Olvidaste tu contraseña?',
        noAccount: '¿No tienes cuenta?',
    },
    register: {
        haveAccount: '¿Ya tienes una cuenta?',
    }
}

export default es;