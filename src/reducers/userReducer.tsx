export type ProfileFormData = {
    name: string;
    firstName: string;
    lastName: string;
    phone: string;
    dob: Date | null;
    password: string;
    emailOptin: number;
    confirmPassword: string;
};

export type ProfileState = {
    formData: ProfileFormData;
    loading: boolean;
    updating: boolean;
    successMessage: string;
    errorMessage: string;
};

export const initialState: ProfileState = {
    formData: {
        name: "",
        firstName: "",
        lastName: "",
        phone: "",
        dob: null,
        password: "",
        confirmPassword: "",
        emailOptin: 0,
    },
    loading: true,
    updating: false,
    successMessage: "",
    errorMessage: "",
};

export type ProfileAction =
    | {
        type: "SET_FORM_FIELD";
        field: keyof ProfileFormData;
        value: ProfileFormData[keyof ProfileFormData];
    }
    | {
        type: "LOAD_PROFILE";
        payload: ProfileFormData;
    }
    | {
        type: "START_LOADING";
    }
    | {
        type: "FINISH_LOADING";
    }
    | {
        type: "START_UPDATE";
    }
    | {
        type: "UPDATE_SUCCESS";
        message: string;
    }
    | {
        type: "UPDATE_ERROR";
        message: string;
    }
    | {
        type: "CLEAR_MESSAGES";
    };

export function profileReducer(
    state: ProfileState,
    action: ProfileAction
): ProfileState {
    switch (action.type) {
        case "SET_FORM_FIELD":
            return {
                ...state,
                formData: {
                    ...state.formData,
                    [action.field]: action.value,
                },
            };

        case "LOAD_PROFILE":
            return {
                ...state,
                formData: action.payload,
                loading: false,
                errorMessage: "",
            };

        case "START_LOADING":
            return {
                ...state,
                loading: true,
            };

        case "FINISH_LOADING":
            return {
                ...state,
                loading: false,
            };

        case "START_UPDATE":
            return {
                ...state,
                updating: true,
                successMessage: "",
                errorMessage: "",
            };

        case "UPDATE_SUCCESS":
            return {
                ...state,
                updating: false,
                successMessage: action.message,
                errorMessage: "",
                formData: {
                    ...state.formData,
                    password: "",
                    confirmPassword: "",
                },
            };

        case "UPDATE_ERROR":
            return {
                ...state,
                updating: false,
                errorMessage: action.message,
                successMessage: "",
            };

        case "CLEAR_MESSAGES":
            return {
                ...state,
                successMessage: "",
                errorMessage: "",
            };

        default:
            return state;
    }
}

