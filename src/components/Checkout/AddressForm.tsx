import { useReducer, type FormEvent } from "react";
import {
    addressReducer,
    initialAddressForm,
    type AddressForm as AddressFormState,
} from "../../reducers/addressReducer";
import type { Address } from "../../types/Address";

type AddressFormProps = {
    address?: Address;
    onSaved: (address: Address) => void;
    onCancel?: () => void;
};

function AddressForm({
        address,
        onSaved,
        onCancel,
    }: AddressFormProps) {
        const initialForm: AddressFormState = address
            ? {
                firstName: address.firstName,
                lastName: address.lastName,
                phone: String(address.phone),
                addressLine1: address.addressLine1,
                addressLine2: address.addressLine2 || "",
                city: address.city,
                state: address.state,
                postalCode: address.postalCode,
                isDefaultShipping: address.isDefaultShipping,
            }
            : initialAddressForm;

        const [form, dispatch] = useReducer(
            addressReducer,
            initialForm
        );

        const handleSubmit = async (
            event: FormEvent<HTMLFormElement>
        ) => {
            event.preventDefault();

            const token = localStorage.getItem("token");

            if (!token) {
                alert("Please login first");
                return;
            }

            const isEditing = Boolean(address);

            const url = isEditing
                ? `http://localhost:3000/api/addresses/${address?._id}`
                : "http://localhost:3000/api/addresses";

            try {
                const response = await fetch(url, {
                    method: isEditing ? "PUT" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        ...form,
                        country: "India",
                    }),
                });

                const data = await response.json();

                if (!response.ok) {
                    alert(data.message);
                    return;
                }

                onSaved(data);

                dispatch({
                    type: "RESET",
                });
            } catch (error) {
                console.error(
                    isEditing
                        ? "Update address error:"
                        : "Save address error:",
                    error
                );
            }
        };

    return (
        <form className="address-form" onSubmit={handleSubmit}>
            <div className="address-form-grid">
                <div className="address-field">
                    <label>First Name</label>
                    <input
                        type="text"
                        placeholder="First Name"
                        value={form.firstName}
                        onChange={(e) =>
                            dispatch({
                                type: "SET_FIELD",
                                field: "firstName",
                                value: e.target.value,
                            })
                        }
                    />
                </div>

                <div className="address-field">
                    <label>Last Name</label>
                    <input
                        type="text"
                        placeholder="Last Name"
                        value={form.lastName}
                        onChange={(e) =>
                            dispatch({
                                type: "SET_FIELD",
                                field: "lastName",
                                value: e.target.value,
                            })
                        }
                    />
                </div>

                <div className="address-field full-width">
                    <label>Phone</label>
                    <input
                        type="tel"
                        placeholder="Phone"
                        value={form.phone}
                        onChange={(e) =>
                            dispatch({
                                type: "SET_FIELD",
                                field: "phone",
                                value: e.target.value,
                            })
                        }
                    />
                </div>

                <div className="address-field full-width">
                    <label>Address Line 1</label>
                    <input
                        type="text"
                        placeholder="Address 1"
                        value={form.addressLine1}
                        onChange={(e) =>
                            dispatch({
                                type: "SET_FIELD",
                                field: "addressLine1",
                                value: e.target.value,
                            })
                        }
                    />
                </div>

                <div className="address-field full-width">
                    <label>Address Line 2</label>
                    <input
                        type="text"
                        placeholder="Address 2"
                        value={form.addressLine2}
                        onChange={(e) =>
                            dispatch({
                                type: "SET_FIELD",
                                field: "addressLine2",
                                value: e.target.value,
                            })
                        }
                    />
                </div>

                <div className="address-field">
                    <label>City</label>
                    <input
                        type="text"
                        placeholder="City"
                        value={form.city}
                        onChange={(e) =>
                            dispatch({
                                type: "SET_FIELD",
                                field: "city",
                                value: e.target.value,
                            })
                        }
                    />
                </div>

                <div className="address-field">
                    <label>State</label>
                    <select
                        value={form.state}
                        onChange={(e) =>
                            dispatch({
                                type: "SET_FIELD",
                                field: "state",
                                value: e.target.value,
                            })
                        }
                    >
                        <option>Delhi</option>
                        <option>Gujarat</option>
                        <option>Uttar Pradesh</option>
                    </select>
                </div>

                <div className="address-field">
                    <label>Postal Code</label>
                    <input
                        type="text"
                        placeholder="Postal Code"
                        value={form.postalCode}
                        onChange={(e) =>
                            dispatch({
                                type: "SET_FIELD",
                                field: "postalCode",
                                value: e.target.value,
                            })
                        }
                    />
                </div>
            </div>

            <div className="address-form-actions">
                <button type="submit" className="btn btn-success">
                    {address ? "Update Address" : "Save Address"}
                </button>

                {address && onCancel && (
                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}

export default AddressForm;
