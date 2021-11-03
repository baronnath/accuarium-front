const es = {
    general: {
        email: 'Correo electrónico',
        password: 'Contraseña',
        name: 'Nombre',
        signUp: 'Crear cuenta',
        login: 'Iniciar sesión',
        logout: 'Cerrar sesión',
        register: 'Registrarse',
        verify: 'Verificar',
        code: 'Código',
        search: 'Buscar',
        language: 'Idioma',
        save: 'Guardar',
        cancel: 'Cancelar',
        waterChemistry: 'Química del agua',
        temperature: 'Temperatura',
        ph: 'pH',
        hardness: 'Dureza',
        size: 'Tamaño',
        minTank: 'Tamaño tanque mín.',
        swinArea: 'Área de nado',
        dimensions: 'Dimensiones',
        behaviour: 'Comportamiento',
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
        code: {
            empty: 'El código de verificación no puede estar vacío',
        },
        locale: {
            empty: 'El idioma no puede estar vacío'
        },
    },
    login: {
        forgotPassword: '¿Olvidaste tu contraseña?',
        noAccount: '¿No tienes cuenta?',
    },
    register: {
        haveAccount: '¿Ya tienes una cuenta?',
    },
    verify: {
        title: 'Verifica tu correo electrónico',
        description: 'Revisa tu correo electrónico en busca del código de verificación',
        resend: 'Reenviar código de verificación',
    },
    speciesSearch: {
        title: 'Especies',
        noMore: 'No hay más especies',
    },
    profile: {
        selectLanguage: 'Seleciona un idioma',
    },
    species: {
        otherNames: 'Otros nombres',
    },
    speciesCard: {
        modal1Title: '¿A qué tanque',
        modal1Paragraph: 'quieres añadir esta especie?',
        modal2Title: '¿Cuántos',
        modal2Paragraph: 'quieres añadir?',
        addSpecies: 'Añadir especie',
    },
}

export default es;