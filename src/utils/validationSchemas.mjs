export const createUserValidationSchema = {
    username: {
        isLength: {
            options: {
                min: 5,
                max: 32,
            },
            errorMessage: 
            "Username must be at least 5 characters and max 32 characters"
        },
        notEmpty: {
            errorMessage: "Username can not be empty",
        },
        isString: {
            errorMessage: "Username must be a string",
        },
    },
    displayName: {
        notEmpty: true,
    }
}