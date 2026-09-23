import { useEffect, useState } from "react";
import type { Address } from "../../types/Address";
import AddressForm from "./AddressForm";
import { getAuthToken } from "../../util/auth";

type AddressSelectorProps = {
    title: string;
    name: string;
    selectedAddressId: string;
    onAddressChange: (addressId: string) => void;
};

function AddressSelector({
    title,
    name,
    selectedAddressId,
    onAddressChange,
}: AddressSelectorProps) {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [showNewAddressForm, setShowNewAddressForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);

    useEffect(() => {
        const fetchAddresses = async () => {
            const token = getAuthToken();

            if (!token) {
                return;
            }

            try {
                const response = await fetch(
                    "http://localhost:3000/api/addresses",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    console.error(data.message);
                    return;
                }

                setAddresses(data);

                if (!selectedAddressId && data.length > 0) {
                    const defaultAddress = data.find(
                        (address: Address) => address.isDefaultShipping
                    );

                    onAddressChange(
                        defaultAddress?._id || data[0]._id
                    );
                }
            } catch (error) {
                console.error("Fetch addresses error:", error);
            }
        };

        fetchAddresses();
    }, []);

    const handleAddressSaved = (address: Address) => {
        setAddresses(prev =>
            prev.some(item => item._id === address._id)
                ? prev.map(item =>
                    item._id === address._id
                        ? address
                        : item
                )
                : [...prev, address]
        );

        onAddressChange(address._id);

        setShowNewAddressForm(false);
        setEditingAddress(null);
    };

    const handleAddNewAddress = () => {
        setEditingAddress(null);
        setShowNewAddressForm(true);
    };

    const handleDeleteAddress = async (addressId: string) => {
        const token = getAuthToken();

        if (!token) {
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:3000/api/addresses/${addressId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            const remainingAddresses = addresses.filter(
                address => address._id !== addressId
            );

            setAddresses(remainingAddresses);

            if (selectedAddressId === addressId) {
                onAddressChange(
                    remainingAddresses.length > 0
                        ? remainingAddresses[0]._id
                        : ""
                );
            }

            if (editingAddress?._id === addressId) {
                setEditingAddress(null);
            }
        } catch (error) {
            console.error("Delete address error:", error);
        }
    };

    const handleEditAddress = (address: Address) => {
        setEditingAddress(address);
        setShowNewAddressForm(false);
    };

    const handleSetDefaultAddress = async (addressId: string) => {
        const token = getAuthToken();

        if (!token) {
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:3000/api/addresses/${addressId}/default`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            setAddresses(prev =>
                prev.map(address => ({
                    ...address,
                    isDefault: address._id === data._id,
                }))
            );

            onAddressChange(data._id);
        } catch (error) {
            console.error("Set default address error:", error);
        }
    };

    return (
        <section className="address-selector-shell">
            <h2>{title}</h2>

            {addresses.length > 0 && (
                <div className="saved-addresses">
                    {addresses.map(address => (
                        <div key={address._id} className="address-option-card">
                            <label className="address-radio-row">
                                <input
                                    type="radio"
                                    name={name}
                                    value={address._id}
                                    checked={selectedAddressId === address._id}
                                    onChange={() =>
                                        onAddressChange(address._id)
                                    }
                                />

                                <span className="address-summary">
                                    <strong>
                                        {address.firstName} {address.lastName}
                                    </strong>
                                    <span>
                                        {address.addressLine1}, {address.city}, {address.state} - {address.postalCode}
                                    </span>
                                </span>
                            </label>

                            <div className="address-action-row">
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-secondary"
                                    onClick={() => handleEditAddress(address)}
                                >
                                    Edit
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => handleDeleteAddress(address._id)}
                                >
                                    Delete
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-success"
                                    onClick={() => handleSetDefaultAddress(address._id)}
                                    disabled={Boolean(address.isDefaultShipping)}
                                >
                                    {address.isDefaultShipping ? "Default" : "Set as Default"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <button
                type="button"
                className="btn btn-primary add-address-button"
                onClick={handleAddNewAddress}
            >
                + Add New Address
            </button>

            {(showNewAddressForm || editingAddress) && (
                <div className="address-form-panel">
                    <AddressForm
                        key={editingAddress?._id || "new"}
                        address={editingAddress || undefined}
                        onSaved={handleAddressSaved}
                        onCancel={() => {
                            setEditingAddress(null);
                            setShowNewAddressForm(false);
                        }}
                    />
                </div>
            )}
        </section>
    );
}

export default AddressSelector;
