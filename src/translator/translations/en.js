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
            info: 'The main species is the most important species in your tank. It sets the parameters to figure out the compatibility with the other species in the tank.\n\nIf your tank has no main species you\'ll miis a lot of information about your tank.',
        },
        email: 'Email',
        password: 'Password',
        newPassword: 'New password',
        name: 'Name',
        signUp: 'Sign up',
        login: 'Login',
        logout: 'Logout',
        register: 'Create account',
        verify: 'Verify',
        resetPassword: 'Reset password',
        reset: 'Reset',
        code: 'Code',
        search: 'Search',
        searchByName: 'Search by name',
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
        share: 'Share',
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
        speciesSize: 'Species size',
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
        filter: {
          one: 'Filter',
          other: 'Filters',
        },
        listView: 'List view',
        gridView: 'Grid view',
        graphicTank: 'Tank schema',
        male: 'Male',
        female: 'Female',
        alein: 'Alevin',
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
        gallon: 'Gallons',
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
    coexistence: {
      one: 'Coexistence',
      other: 'Coexistences',
      indiv: 'Individual',
      couple: 'Couple',
      onlyMasc: 'Only males',
      onlyFem: 'Only females',
      harem: 'Harem',
      inverseHarem: 'Inverse harem',
      mixedGroup: 'Mixed group',
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
        addMainSpecies: 'Add the main species to your tank %{tankName}',
    },
    profile: {
        selectLanguage: 'Select a language',
        selectMeasureUnit: 'Select measure unit',
    },
    species: {
        otherNames: 'Other names',
        scientificNameSynonyms: 'Scientific name synonyms',
        shareButton: {
          title: 'accuarium',
          message: '%{name} species in accuarium',
        },
        fullCompatibility: 'Full compatibility',
        notFullCompatibility: 'Partial compatibility',
        noCompatibility: 'Not compatible',
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
      byTankCompatibility: 'by tank compat.',
      byParams: 'by params',
    },
    tank: {
        litersSuccess: 'Your tank volume is %{liters}',
        alias: 'Tank alias',
        clickFormula: 'Click on the formula to calculate your tank volume',
        warning: {
            title: 'Select a main species',
            subtitle: 'Click on the species image',
        },
        notCompatibleParameters: 'Parameters not compatible',
        notCompatibleSpecies: 'Species not compatible',
        notCompatibleCoexistence: 'Coexistence not recommended',
        coexistence: {
          one: 'Kepping one specimen is not recommended. Check coexistence section',
          other: 'Kepping %{quantity} specimens is not recommended. Check coexistence section',
        },
        temperatureBetween: 'This species temperature should be between %{min} - %{max}',
        phBetween: 'This species pH should be between %{min} - %{max}',
        ghBetween: 'This species gH should be between %{min} - %{max}',
        khBetween: 'This species kH should be between %{min} - %{max}',
        modalParameters: 'The optimal parameters are based on the tank main species. Make sure the rest of living species parameters are as close as possible to these numbers.',
        modalFreeSpace: 'Each fish requires some liters for itself. An overcrowded aquarium can cause many issues.',
        modalCleanupCrew: 'This percent is a vague guide based in the tank volume. The cleanup crew should be at least the 15% of the livestock in your tank.',
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
        shareButton: {
          title: 'Check out this tank',
          message: 'Please take a look to the tank in this link',
        },
        validation: {
          name:{
            notEmpty: 'Name cannot be empty',
          },
          width: {
            numberDecimals: 'Width only accepts numbers (up to 2 decimals)',
            notValid: 'Width value is not valid',
          },
          length: {
            numberDecimals: 'Length only accepts numbers (up to 2 decimals)',
            notValid: 'Length value is not valid',
          },
          height: {
            numberDecimals: 'Height only accepts numbers (up to 2 decimals)',
            notValid: 'Height value is not valid',
          },
          liters: {
            numberDecimals: 'Volume only accepts numbers (up to 2 decimals)',
            notValid: 'Volume value is not valid',
          },
          image: {
            size: 'Image size must be smaller than 15MB',
            unknown: 'Can\'t select this file as the size is unknown',
            format: 'Image format must be jpg or jpeg',
          },
        },
        notOwner: 'You can\'t edit this tank',
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
    behavior: {
      cleaning: {
          description: 'Reduce the growth of algae, remove the uneaten food decaying and plant matter in the tank.',
      },
      wild: {
          description: 'Rarely or impossible to breed in captivity.',
      },
      schooling: {
          description: 'Swim together in the same direction, speed and time with other same species fish. Fish come together for a specific purpose, for example to feed, spawn or defense.',
      },
      territorial: {
          description: 'Defend an area as a single individual or breeding couple.',
      },
      aggressive: {
          description: 'Attack its own species.',
      },
      jumper: {
          description: 'Capable of jumping out of the water.',
      },
      algaeEater: {
          description: 'Feed on the algae growing in the tank.',
      },
      predator: {
          description: 'Feed on other species, usually smaller.',
      },
      quiet: {
          description: 'Little activity or excitement.',
      },
      sandDigger: {
          description: 'Use to dig or move sand to feed or find shelter.',
      },
      snailEater: {
          description: 'Feed on snails.',
      },
      clumsy: {
          description: 'Not a skilled swimmer. This is usually due to the artificail selection enforcing a specific appearance.',
      },
      lively: {
          description: 'Full of live and energy. An active swimmer.',
      },
      nocturnal: {
          description: 'Active mostly at night.',
      },
      peaceful: {
          description: 'Come along with the rest of species easely. Not aggressive.',
      },
      shy: {
          description: 'Timid and skittish. Try to hide and scare often.',
      },
      gregarious: {
          description: 'Live in flocks or loosely organized communitites.',
      },
      lover: {
          description: 'Only one mate at a time.',
      },
      plantEater: {
          description: 'Feed on plants.',
      },
    },
}

export default en;