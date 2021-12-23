const en = {
    general: {
        tank: {
            one: 'Tank',
            other: 'Tanks', 
        },
        species: {
            one: 'Species',
            other: 'Species', 
        },
        mainSpecies: {
            one: 'Main species',
            other: 'Main species', 
        },
        email: 'Email',
        password: 'Password',
        name: 'Name',
        signUp: 'Sign up',
        login: 'Login',
        logout: 'Logout',
        register: 'Create account',
        verify: 'Verify',
        code: 'Code',
        search: 'Search',
        language: 'Language',
        save: 'Save',
        cancel: 'Cancel',
        close: 'Close',
        next: 'Next',
        edit: 'Edit',
        delete: 'Delete',
        apply: 'Apply',
        clear: 'Clear',
        ok: 'OK',
        moreDetails: 'More details',
        property: {
          one: 'Property',
          other: 'Properties',
        },
        parameter: {
          one: 'Parameter',
          other: 'Parameters', 
        },
        waterChemistry: 'Water chemistry',
        temperature: 'Temperature',
        minTemp: 'Min. temperature',
        maxTemp: 'Max. temperature',
        ph: 'pH',
        minPh: 'Min. pH',
        maxPh: 'Max. pH',
        gh: 'General hardness',
        minGh: 'Min. gen. hardness',
        maxGh: 'Max. gen. hardness',
        kh: 'Temporal hardness',
        minKh: 'Min. temp. hardness',
        maxKh: 'Max. temp. hardness',
        minLength: 'Min. length',
        maxLength: 'Max. length',
        hardness: 'Hardness',
        size: 'Size',
        minTank: 'Min. tank volume',
        minMinTank: 'Min. mín. tank volume',
        maxMinTank: 'Max. mín. tank volume',
        swimArea: 'Swimming area',
        depth: {
          one: 'Swimming area',
          other: 'Swimming area',
        },
        feed: {
          one: 'Feeding',
          other: 'Feeding',
        },
        dimensions: 'Dimensions',
        measures: 'Measures',
        behavior: 'Behavior',
        behavior: {
          one: 'Behavior',
          other: 'Behaviors',
        },
        color: {
          one: 'Color',
          other: 'Colors',
        },
        height: 'Height',
        width: 'Width',
        length: 'Length',
        liters: 'Liters',
        volume: 'Volume',
        bottom: 'Bottom',
        middle: 'Middle',
        surface: 'Surface',
        freeSpace: 'Free space',
        cleanupCrew: 'Cleanup crew',
        cleaning: 'Cleaning',
        measureUnits: 'Measure units',
        maximum: 'Maximum',
        minimum: 'Minimum',
        classification: 'Classification',
        type: {
          one: 'Type',
          other: 'Types',
        },
        group: {
          one: 'Group',
          other: 'Groups'
        },
        family: {
          one: 'Family',
          other: 'Families'
        },
        salt: 'Saltwater',
        wild: 'Wild',
    },
    measures: {
        ppm: 'Parts per million',
        ppmAbbr: 'ppm',
        mg: 'Milligrams',
        mgAbbr: 'mg',
        µS: 'Microsiemens ',
        µSAbbr: 'µS',
        gH: 'Degrees',
        gHAbbr: 'dGH',
        kH: 'Degrees',
        kHAbbr: 'dKH',
        liter: 'Liters',
        literAbbr: 'L',
        m3: 'Square meters',
        m3Abbr: 'm³',
        gallon: 'Gallon',
        gallonAbbr: 'gal',
        ounce: 'Ounces',
        ounceAbbr: 'oz',
        cm: 'Centimeters',
        cmAbbr: 'cm',
        m: 'Meters',
        mAbbr: 'm',
        mm: 'Millimeters',
        mmAbbr: 'mm',
        in: 'Inches',
        inAbbr: 'in',
        ft: 'Feet',
        ftAbbr: 'ft',
        celsius: 'Celsius degrees',
        celsiusAbbr: 'ºC',
        fahrenheit: 'Fahrenheit degrees',
        fahrenheitAbbr: 'ºF',
        kelvin: 'Kelvin degrees',
        kelvinAbbr: 'ºK',
        measureNotFound: 'The measure was not found',
        unitNotFound: 'The unit was not found',
    },
    validation: {
        email: {
            empty: 'Email cannot be empty',
            notValid: 'Ooops! The email address is not correct',
        },
        password: {
            empty: 'Password cannot be empty',
        },
        name:{
            empty: 'Name cannot be empty',
        },
        code: {
            empty: 'Verification code cannot be empty',
        },
        locale: {
            empty: 'Language cannot be empty'
        },
    },
    login: {
        forgotPassword: 'Forgot your password?',
        noAccount: 'Don\'t have an account?',
        sessionExpired: 'Your session has expired. Please log in',
        greeting: "Hi %{name}",
    },
    register: {
        haveAccount: 'Already have an account?',
    },
    verify: {
        title: 'Verify your email',
        description: 'Check your email inbox for the email verification code',
        resend: 'Resend verification code',
    },
    speciesSearch: {
        title: 'Species',
        tankSubtitle: 'to be added to %{tankName}',
        noMore: 'No more species',
    },
    profile: {
        selectLanguage: 'Select a language',
        selectMeasureUnit: 'Select measure unit',
    },
    species: {
        otherNames: 'Other names',
    },
    speciesCard: {
        modal1Title: 'Which tank',
        modal1Paragraph: 'do you want to add this species to?',
        modal2Title: 'How many',
        modal2Paragraph: 'do you want to add?',
        addSpecies: 'Add species',
    },
    speciesSearchFilter: {
      title: 'Species filter',
      chooseCompTank: 'or filter by a tank compatibility',
      chooseParams: 'or select parameters',
      tankModalTitle: 'Select tank',
      tankModalParagraph: 'Filter by the ideal selected tank parameters',
      familyModalTitle: 'Select a family',
      familyModalParagraph: 'Filter by scientific family',
      groupModalTitle: 'Select group',
      groupModalParagraph: 'Filter by informal group',
      depthModalTitle: 'Select swimming area',
      depthModalParagraph: 'The most common tank area where the species hang out',
      feedModalTitle: 'Select feeding',
      feedModalParagraph: 'Filter by feeding habits',
      behaviorModalTitle: 'Select behavior',
      behaviorModalParagraph: 'Filter by one or more behaviors',
      colorModalTitle: 'Select color',
      colorModalParagraph: 'Filter by one or more colors',
    },
    tank: {
        litersSuccess: 'Your tank is %{liters} liters',
        alias: 'Tank alias',
        clickFormula: 'Click on the formula to calculate your tank volume',
        warning: {
            title: 'Select a main species',
            subtitle: 'Click on the species image',
        },
        notCompatibleParameters: 'Parameters not compatible',
        notCompatibleSpecies: 'Species not compatible',
        temperatureBetween: 'This species temperature should be between %{min} - %{max}',
        phBetween: 'This species pH should be between %{min} - %{max}',
        ghBetween: 'This species gH should be between %{min} - %{max}',
        khBetween: 'This species kH should be between %{min} - %{max}',
        modalParameters: 'The optimal parameters are based on the tank main species. Make sure the rest of living species parameters are as close as possible to these numbers.',
        modalFreeSpace: 'Each fish requires some liters for itself. An overcrowded aquarium can cause many issues.',
        cleanupCrew: 'This percent is a vague guide based in the tank volume. The cleanup crew should be at least the 15% of the livestock in your tank.',
        warning: {
            title: 'Warning',
            subtitle: 'Please select the main species',
        },
        deleteModal: {
            title: 'Are you sure?',
            description: 'You won\'t be able to revert this',
        },
        newTank: 'New tank',
        editTank: 'Edit tank',
        noTank: 'No tanks yet. What you waiting for?',
        createTank: 'Create tank',
        emptyValues: 'Please fill your tank dimensions',
        noNumbers: 'Dimensions values must be numbers',
    },
    addTank: {
        slide1: {
            title: 'Choose a name for your new project',
            label: 'Tank alias',
        },
        slide2: {
            title: 'Pick an image as your tank avatar',
            button: 'Pick an image',
        },
        slide3: {
            title: 'Your tank measures',
        },
        slide4: {
            title: 'Click on the formula to calculate your tank volume',
        },
        warning: {
            title: 'Unit of measure is set to %{unit} (%{unitAbbr})',
            subtitle: 'Click here to change your unit preference',
        },
        notValid: 'Tank data is not correct',
        addSpecies: 'Now add some fishes to your tank',

    },
    server: {
        connectionError: 'Server connection error',
    },
}

export default en;