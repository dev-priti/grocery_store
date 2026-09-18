export type AddressForm = {
    firstName: string;
    lastName: string;
    phone: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    isDefaultShipping: number;
};

export type AddressAction =
    | {
        type: "SET_FIELD";
        field: keyof AddressForm;
        value: string | boolean;
    }
    | {
        type: "RESET";
    };

export const initialAddressForm: AddressForm = {
    firstName: "",
    lastName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "Delhi",
    postalCode: "",
    isDefaultShipping: 0,
};

export function addressReducer(
    state: AddressForm,
    action: AddressAction
): AddressForm {
    switch (action.type) {
        case "SET_FIELD":
            return {
                ...state,
                [action.field]: action.value,
            };

        case "RESET":
            return initialAddressForm;

        default:
            return state;
    }
}
