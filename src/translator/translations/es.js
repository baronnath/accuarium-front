const es = {
    general: {
        tank: {
            one: 'Tanque',
            other: 'Tanques', 
        },
        species: {
            one: 'Especie',
            other: 'Especies', 
        },
        mainSpecies: {
            one: 'Especie principal',
            other: 'Especies principales', 
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
        close: 'Cerrar',
        next: 'Siguiente',
        edit: 'Editar',
        delete: 'Eliminar',
        apply: 'Aplicar',
        clear: 'Limpiar',
        ok: 'Vale',
        parameter: {
          one: 'Parámetro',
          other: 'Parámetros', 
        },
        property: {
          one: 'Propiedad',
          other: 'Propiedades',
        },
        moreDetails: 'Más detalles',
        waterChemistry: 'Química del agua',
        temperature: 'Temperatura',
        minTemp: 'Temperature mín.',
        maxTemp: 'Temperature máx.',
        ph: 'pH',
        minPh: 'pH mínimo',
        maxPh: 'pH mínimo',
        gh: 'Dureza general',
        minGh: 'Dureza gen. mín.',
        maxGh: 'Dureza gen. máx.',
        kh: 'Dureza temporal',
        minKh: 'Dureza temp. mín.',
        maxKh: 'Dureza temp. máx.',
        minLength: 'Tamaño mín.',
        maxLength: 'Tamaño máx',
        hardness: 'Dureza',
        size: 'Tamaño',
        minTank: 'Volumen mín. de tanque',
        minMinTank: 'Volumen mín. de tanque mín.',
        maxMinTank: 'Volumen mín. de tanque máx.',
        swimArea: 'Área de nado',
        depth: {
          one: 'Área de nado',
          other: 'Áreas de nado',
        },
        feed: {
          one: 'Alimentación',
          other: 'Alimentaciones',
        },
        dimensions: 'Dimensiones',
        measures: 'Medidas',
        behavior: {
          one: 'Comportamiento',
          other: 'Comportamientos',
        },
        color: {
          one: 'Color',
          other: 'Colores',
        },
        height: 'Alto',
        width: 'Ancho',
        length: 'Largo',
        liters: 'Litros',
        volume: 'Volumen',
        bottom: 'Fondo',
        middle: 'Medio',
        surface: 'Superficie',
        freeSpace: 'Espacio libre',
        cleanupCrew: 'Equipo de limpieza',
        cleaning: 'Limpieza',
        measureUnits: 'Unidades de medida',
        maximum: 'Máximo',
        minimum: 'Mínimo',
        classification: 'Clasificación',
        type: {
          one: 'Tipo',
          other: 'Tipos',
        },
        group: {
          one: 'Grupo',
          other: 'Grupos'
        },
        family: {
          one: 'Familia',
          other: 'Familias'
        },
        salt: 'Agua salada',
        wild: 'Salvaje',
    },
    measures: {
        ppm: 'Partes por millón',
        ppmAbbr: 'ppm',
        mg: 'Miligramos',
        mgAbbr: 'mg',
        µS: 'Microsiemens ',
        µSAbbr: 'µS',
        gH: 'Grados',
        gHAbbr: 'dGH',
        kH: 'Grados',
        kHAbbr: 'dKH',
        liter: 'Litros',
        literAbbr: 'L',
        m3: 'Metros cuadrados',
        m3Abbr: 'm³',
        gallon: 'Galón',
        gallonAbbr: 'gal',
        ounce: 'Onzas',
        ounceAbbr: 'oz',
        cm: 'Centímetros',
        cmAbbr: 'cm',
        m: 'Metros',
        mAbbr: 'm',
        mm: 'Milímetros',
        mmAbbr: 'mm',
        in: 'Pulgadas',
        inAbbr: '"',
        ft: 'Pies',
        ftAbbr: '\'',
        celsius: 'Grados celsius',
        celsiusAbbr: 'ºC',
        fahrenheit: 'Grados fahrenheit',
        fahrenheitAbbr: 'ºF',
        kelvin: 'Grados kelvin',
        kelvinAbbr: 'ºK',
        measureNotFound: 'La medida no ha sido encontrada',
        unitNotFound: 'La unidad no ha sido encontrada',
    },
    coexistence: {
      one: 'Coexistencia',
      other: 'Coexistencias',
      indiv: 'Individual',
      couple: 'Pareja',
      onlyMasc: 'Solo machos',
      onlyFem: 'Solo hembras',
      harem: 'Harén',
      inverseHarem: 'Harén invertido',
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
        tankSubtitle: 'para añadirlas a %{tankName}',
        noMore: 'No hay más especies',
    },
    profile: {
        selectLanguage: 'Selecciona un idioma',
        selectMeasureUnit: 'Selecciona una unidad de medida',
    },
    species: {
        otherNames: 'Otros nombres',
        scientificNameSynonyms: 'Nombres científicos sinónimos',
    },
    speciesCard: {
        modal1Title: '¿A qué tanque',
        modal1Paragraph: 'quieres añadir esta especie?',
        modal2Title: '¿Cuántos',
        modal2Paragraph: 'quieres añadir?',
        addSpecies: 'Añadir especie',
    },
    speciesSearchFilter: {
      title: 'Filtro de especies',
      chooseCompTank: 'o filtra por compatibilidad con un tanque',
      chooseParams: 'o selecciona los parámetros',
      tankModalTitle: 'Selecciona un tanque',
      tankModalParagraph: 'Filtra por los parámetros ideales del tanque',
      familyModalTitle: 'Selecciona una familia',
      familyModalParagraph: 'Filtra por la familia científico',
      groupModalTitle: 'Selecciona un grupo',
      groupModalParagraph: 'Filtra por el grupo informal',
      depthModalTitle: 'Selecciona un área de nado',
      depthModalParagraph: 'La zona del tanque más frecuentada por la especie',
      feedModalTitle: 'Selecciona una alimentación',
      feedModalParagraph: 'Filtra por los hábitos de alimentación',
      behaviorModalTitle: 'Selecciona un comportamiento',
      behaviorModalParagraph: 'Filtra por uno o más comportamientos',
      colorModalTitle: 'Elige color',
      colorModalParagraph: 'Filtra por uno o más colores',
    },
    tank: {
        litersSuccess: 'El tanque es de %{liters} litros',
        alias: 'Nombre del tanque',
        clickFormula: 'Haz clic en la fórmula para calcular el volumen del tanque',
        warning: {
            title: 'Selecciona una especie principal',
            subtitle: 'Haz clic en la imagen de la especie',
        },
        notCompatibleParameters: 'Los parámetros no son compatibles',
        notCompatibleSpecies: 'Las especies no son compatibles',
        temperatureBetween: 'La temperatura para esta especie debe ser de %{min} - %{max}',
        phBetween: 'El pH para este especie debería ser de %{min} - %{max}',
        ghBetween: 'La dureza general para esta esta especie debería ser de  %{min} - %{max}',
        khBetween: 'El dureza temporal para esta esta especie debería ser de  %{min} - %{max}',
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
        emptyValues: 'Completa las dimensiones del tanque',
        noNumbers: 'Las dimensiones tienen que ser números',
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
        warning: {
            title: 'La unidad de medida configurada es %{unit} (%{unitAbbr})',
            subtitle: 'Pulsa aquí para cambiar las unidades',
        },
        notValid: 'Los datos del tanque no son correctos',
        addSpecies: 'Ahora añade algún pez al tanque',

    },
    server: {
        connectionError: 'Error de conexión con el servidor',
    },
}

export default es;