const en = {
    general: {
        tank: {
            one: 'Tank',
            other: 'Tanks', 
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
        next: 'Next',
        edit: 'Edit',
        delete: 'Delete',
        waterChemistry: 'Water chemistry',
        temperature: 'Temperature',
        ph: 'pH',
        hardness: 'Hardness',
        size: 'Size',
        minTank: 'Min. tank size',
        swinArea: 'Swimming area',
        dimensions: 'Dimensions',
        measures: 'Measures',
        behaviour: 'Behaviour',
        height: 'Height',
        width: 'Width',
        length: 'Length',
        liters: 'Liters',
        bottom: 'Bottom',
        middle: 'Middle',
        surface: 'Surface',
        freeSpace: 'Free space',
        cleanupCrew: 'Cleanup crew',
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
        noMore: 'No more species',
    },
    profile: {
        selectLanguage: 'Select a language',
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
        hardnessBetween: 'This species hardness should be %{min} - %{max}',
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
        noTanks: 'No tanks yet. What you waiting for?',
        createTank: 'Create tank',
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
        slide5: {
            title: 'You are all set!',
        },
        notValid: 'Tank data is not correct',
        addSpecies: 'Now add some fishes to your tank',

    },
    server: {
        connectionError: 'Server connection error',
    },
}

export default en;