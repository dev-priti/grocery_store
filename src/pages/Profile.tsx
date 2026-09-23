import type { ProfileUser } from "../types/User";
import { useNavigate } from "react-router-dom";
import { useEffect , useReducer} from "react";
import DatePicker from "react-datepicker";
import "../../node_modules/react-datepicker/dist/react-datepicker.css";
import { getAuthToken } from "../util/auth";
import {
    profileReducer,
    initialState,
} from "../reducers/userReducer";

type ProfileProps = {
    user: ProfileUser | null;
};

function Profile({ user }: ProfileProps) {
    const navigate = useNavigate();

    const [state, dispatch] = useReducer(
        profileReducer,
        initialState
    );

    // Set constraints so users can't select a birth date in the future
    const maxSelectableDate = new Date();

    // Limit DOB to the last 100 years
    const minSelectableDate = new Date();
    minSelectableDate.setFullYear(
        maxSelectableDate.getFullYear() - 100
    );

    /*
     * Fetch the latest profile data from the backend
     * and use it to prepopulate the form.
     */
    useEffect(() => {
        const fetchUserData = async () => {
            const token = getAuthToken();

            if (!token) {
                dispatch({
                    type: "UPDATE_ERROR",
                    message: "Please login first.",
                });

                dispatch({
                    type: "FINISH_LOADING",
                });
                return;
            }

            try {
                const response = await fetch(
                    "http://localhost:3000/api/auth/profile",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const userData = await response.json();
                console.log("Profile API response:", userData);
                if (!response.ok) {
                    dispatch({
                        type: "UPDATE_ERROR",
                        message:
                            userData.message ||
                            "Unable to retrieve profile.",
                    });

                    dispatch({
                        type: "FINISH_LOADING",
                    });
                    return;
                }

                /*
                 * If your API returns:
                 *
                 * {
                 *   success: true,
                 *   user: {...}
                 * }
                 *
                 * then use userData.user.
                 */
                const profile = userData.user || userData;

                if (!profile) {
                    dispatch({
                        type: "UPDATE_ERROR",
                        message:
                            "Profile data was not found.",
                    });

                    dispatch({
                        type: "FINISH_LOADING",
                    });
                    return;
                }

                dispatch({
                    type: "LOAD_PROFILE",
                    payload: {
                        name: profile.name || "",
                        firstName:
                            profile.firstName || "",

                        lastName:
                            profile.lastName || "",

                        phone:
                            profile.phone || "",

                        dob: profile.dob
                            ? new Date(profile.dob)
                            : null,

                        password: "",
                        confirmPassword: "",

                        emailOptin:
                            profile.emailOptin === 1 ||
                            profile.emailOptin === true
                                ? 1
                                : 0,
                    },
                });
            } catch (error) {
                console.error(
                    "User data cannot be retrieved:",
                    error
                );

                dispatch({
                    type: "UPDATE_ERROR",
                    message:
                        "Unable to retrieve profile.",
                });

                dispatch({
                    type: "FINISH_LOADING",
                });
            }
        };

        fetchUserData();
    }, []);

    const handleProfileUpdate = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (state.updating) {
            return;
        }

        dispatch({
            type: "CLEAR_MESSAGES",
        });

        // First name validation
        if (!state.formData.firstName.trim()) {
            dispatch({
                type: "UPDATE_ERROR",
                message:
                    "First name is required.",
            });

            dispatch({
                type: "FINISH_LOADING",
            });
            return;
        }

        // Last name validation
        if (!state.formData.lastName.trim()) {
            dispatch({
                type: "UPDATE_ERROR",
                message:
                    "Last name is required.",
            });

            dispatch({
                type: "FINISH_LOADING",
            });
            return;
        }

        // Phone validation
        if (
            state.formData.phone &&
            !/^\d{10}$/.test(state.formData.phone)
        ) {

            dispatch({
                type: "UPDATE_ERROR",
                message:
                    "Please enter a valid 10-digit mobile number.",
            });

            dispatch({
                type: "FINISH_LOADING",
            });

            return;
        }

        // Password validation
        if (
            state.formData.password &&
            state.formData.password.length < 8
        ) {

            dispatch({
                type: "UPDATE_ERROR",
                message:
                    "Password must be at least 8 characters..",
            });

            dispatch({
                type: "FINISH_LOADING",
            });
            return;
        }

        // Confirm password validation
        if (
            state.formData.password &&
            state.formData.password !==
                state.formData.confirmPassword
        ) {
            dispatch({
                type: "UPDATE_ERROR",
                message:
                    "Password and confirm password do not match.",
            });

            return;
        }

        const token = getAuthToken();

        if (!token) {
            dispatch({
                type: "UPDATE_ERROR",
                message:
                    "Please login first.",
            });

            dispatch({
                type: "FINISH_LOADING",
            });
            return;
        }

        dispatch({
            type: "START_UPDATE",
        });

        try {
            const response = await fetch(
                "http://localhost:3000/api/auth/profile",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        firstName:
                            state.formData.firstName.trim(),

                        lastName:
                            state.formData.lastName.trim(),

                        phone:
                            state.formData.phone.trim(),

                        dob: state.formData.dob
                            ? state.formData.dob
                                  .toISOString()
                                  .split("T")[0]
                            : null,

                        emailOptin:
                            state.formData.emailOptin,

                        /*
                         * Only send password if the user
                         * actually entered one.
                         */
                        ...(state.formData.password
                            ? {
                                password:
                                    state.formData.password,
                                confirmPassword:
                                    state.formData.confirmPassword,
                              }
                            : {}),
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                dispatch({
                    type: "UPDATE_ERROR",
                    message:
                        data.message ||
                        "Failed to update profile."
                });

                dispatch({
                    type: "FINISH_LOADING",
                });
                return;
            }

            dispatch({
                type: "UPDATE_SUCCESS",
                message:
                    data.message ||
                    "Your profile has been updated successfully.",
            });
        } catch (error) {
            console.error(
                "Profile update error:",
                error
            );

            dispatch({
                type: "UPDATE_ERROR",
                message:
                    "Something went wrong while updating your profile"
            });

            dispatch({
                type: "FINISH_LOADING",
            });
        }
    };

    return (
        <div className="profile-page">
            <div className="profile-page-header">
                <div>
                    <p className="section-kicker">Account settings</p>
                    <h1>Profile</h1>
                </div>
                <button
                    className="btn btn-outline-success"
                    onClick={() => navigate("/orders")}
                >
                    ← Order History
                </button>
            </div>

            <div className="profile-shell">
                <div className="profile-card">
                    <div className="profile-card-header">
                        <div>
                            <p className="profile-greeting">Welcome back</p>
                            <h2>{user?.name || "User"}</h2>
                        </div>
                    </div>

                    {state.successMessage && (
                        <p className="profile-success-message">
                            {state.successMessage}
                        </p>
                    )}

                    {state.errorMessage && (
                        <p className="profile-error-message">
                            {state.errorMessage}
                        </p>
                    )}

                    <form name="profile" className="profile-form" onSubmit={handleProfileUpdate}>
                        <div className="profile-form-row">
                            <div className="field-group">
                                <label htmlFor="email">Email</label>
                                <input id="email" type="email" value={user?.email || ""} disabled />
                            </div>
                        </div>

                        <div className="profile-form-row two-column">
                            <div className="field-group">
                                <label htmlFor="firstName">First Name</label>
                                <input
                                    id="firstName"
                                    type="text"
                                    value={state.formData.firstName}
                                    onChange={(e) =>
                                        dispatch({
                                            type: "SET_FORM_FIELD",
                                            field: "firstName",
                                            value: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="field-group">
                                <label htmlFor="lastName">Last Name</label>
                                <input
                                    id="lastName"
                                    type="text"
                                    value={state.formData.lastName}
                                    onChange={(e) =>
                                        dispatch({
                                            type: "SET_FORM_FIELD",
                                            field: "lastName",
                                            value: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>

                        <div className="profile-form-row two-column">
                            <div className="field-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    value={state.formData.password}
                                    onChange={(e) =>
                                        dispatch({
                                            type: "SET_FORM_FIELD",
                                            field: "password",
                                            value: e.target.value,
                                        })
                                    }
                                    autoComplete="new-password"
                                />
                            </div>

                            <div className="field-group">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    value={state.formData.confirmPassword}
                                    onChange={(e) =>
                                        dispatch({
                                            type: "SET_FORM_FIELD",
                                            field: "confirmPassword",
                                            value: e.target.value,
                                        })
                                    }
                                    autoComplete="new-password"
                                />
                            </div>
                        </div>

                        <div className="profile-form-row">
                            <div className="field-group">
                                <label htmlFor="phone">Mobile Number</label>
                                <input
                                    id="phone"
                                    type="tel"
                                    value={state.formData.phone}
                                    maxLength={10}
                                    pattern="[0-9]{10}"
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, "");
                                        dispatch({
                                            type: "SET_FORM_FIELD",
                                            field: "phone",
                                            value: value,
                                        });
                                    }}
                                />
                            </div>
                        </div>

                        <div className="profile-form-row dob-block">
                            <label htmlFor="dob">Date of Birth</label>
                            <DatePicker
                                id="dob"
                                selected={state.formData.dob}
                                onChange={(date: Date | null) =>
                                    dispatch({
                                        type: "SET_FORM_FIELD",
                                        field: "dob",
                                        value: date,
                                    })
                                }
                                dateFormat="yyyy-MM-dd"
                                placeholderText="Select your birth date"
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                minDate={minSelectableDate}
                                maxDate={maxSelectableDate}
                                className="dob-input-field"
                            />

                            {state.formData.dob && (
                                <p className="dob-preview">
                                    Selected DOB: <strong>{state.formData.dob.toLocaleDateString()}</strong>
                                </p>
                            )}
                        </div>

                        <div className="email-optin">
                            <input
                                type="checkbox"
                                id="emailOptin"
                                checked={Boolean(state.formData.emailOptin)}
                                onChange={(e) =>
                                    dispatch({
                                        type: "SET_FORM_FIELD",
                                        field: "emailOptin",
                                        value: e.target.checked ? 1 : 0,
                                    })
                                }
                            />

                            <label htmlFor="emailOptin">
                                Send me grocery offers and new product updates.
                            </label>
                        </div>

                        <button type="submit" className="btn btn-success w-100 profile-update-button" disabled={state.updating}>
                            {state.updating ? "Updating Profile..." : "Update Profile"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Profile;
