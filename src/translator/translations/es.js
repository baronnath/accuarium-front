const es = {
    general: {
        tank: {
            one: 'Tanque',
            other: 'Tanques', 
        },
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
        next: 'Siguiente',
        edit: 'Editar',
        delete: 'Eliminar',
        waterChemistry: 'Química del agua',
        temperature: 'Temperatura',
        ph: 'pH',
        hardness: 'Dureza',
        size: 'Tamaño',
        minTank: 'Tamaño tanque mín.',
        swinArea: 'Área de nado',
        dimensions: 'Dimensiones',
        measures: 'Medidas',
        behaviour: 'Comportamiento',
        height: 'Alto',
        width: 'Ancho',
        length: 'Largo',
        liters: 'Litros',
        bottom: 'Fondo',
        middle: 'Medio',
        surface: 'Superficie',
        freeSpace: 'Espacio libre',
        cleanupCrew: 'Equipo de limpieza',
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
        sessionExpired: 'La sesión ha caducado. Inicia sesión de nuevo',
        greeting: "Hola, %{name}",
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
    tank: {
        litersSuccess: 'El tanque es de %{liters} litros',
        alias: 'Alias del tanque',
        clickFormula: 'Haz clic en la fórmula para calcular el volumen del tanque',
        warning: {
            title: 'Selecciona una especie principal',
            subtitle: 'Haz clic en la imagen de la especie',
        },
        notCompatibleParameters: 'Los parámetros no son compatibles',
        notCompatibleSpecies: 'Las especies no son compatibles',
        temperatureBetween: 'La temperatura para esta especie debe ser de %{min} - %{max}',
        phBetween: 'El pH para este especie debería ser de %{min} - %{max}',
        hardnessBetween: 'La dureza para esta esta especie debería ser de %{min} - %{max}',
        modalParameters: 'Los parámetros están basados en la especie principal de este tanque. Asegúrate de que los parámtros del resto de especies son lo más similares posible a estos números.',
        modalFreeSpace: 'Cada pez necesita ciertos litros. Un acuario súper poblado puede provocar muchos problemas.',
        modalCleanupCrew: 'Este porcentaje es una vaga guía basada en el volumen del tanque. El equipo de limpieza debería ser al menos del 15% de los especímenes del tanque.',
        warning: {
            title: 'Atención',
            subtitle: 'Selecciona la especie principal',
        },
        deleteModal: {
            title: '¿Estás seguro?',
            description: 'No podrás revertir esto',
        },
        newTank: 'Nuevo tanque',
        editTank: 'Editar tanque',
        noTanks: 'No hay ningún tanque. ¿A qué esperas?',
        createTank: 'Crear tanque',
    },
    addTank: {
        slide1: {
            title: 'Elige un nombre para tu nuevo proyecto',
            label: 'Alias del tanque',
        },
        slide2: {
            title: 'Escoge una foto como avatar para el tanque',
            button: 'Escoge una imagen',
        },
        slide3: {
            title: 'Las medidas del tanque',
        },
        slide4: {
            title: 'Haz clic en la fórmula para calcular el volumen del tanque',
        },
        slide5: {
            title: '¡Ya está todo listo!',
        },
        notValid: 'Los datos del tanque no son correctos',
        addSpecies: 'Ahora añade algún pez al tanque',

    },
    server: {
        connectionError: 'Error de conexión con el servidor',
    },
}

export default es;