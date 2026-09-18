const express = require("express");
const Address = require("../models/Address");
const authMiddleWare = require("../middleware/authMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleWare, async (req, resp) => {
    try {
        const {
            firstName,
            lastName,
            phone,
            addressLine1,
            addressLine2,
            city,
            state,
            postalCode,
            country,            
        } = req.body;

        if (
            !firstName ||
            !lastName ||
            !phone ||
            !addressLine1 ||
            !city ||
            !state ||
            !postalCode
        ) {
            return resp.status(400).json({
                message: "Please provide all required address fields",
            });
        }

        const address = await Address.create({
            userId: req.userId,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            phone: phone.trim(),
            addressLine1: addressLine1.trim(),
            addressLine2: addressLine2?.trim() || "",
            city: city.trim(),
            state: state.trim(),
            postalCode: postalCode.trim(),
            country: country?.trim() || "India",
        });

        resp.status(201).json(address);
    } catch(error) {
        console.error("Create address error:", error);

        resp.status(500).json({
            message: "Failed to create address",
        });
    }
});

router.get("/", authMiddleware, async (req, resp ) => {
    try {
        const addresses = await Address.find({
            userId: req.userId,
        });

        resp.json(addresses);
    } catch(error) {
        console.error("Get addresses error:", error);

        resp.status(500).json({
            message: "Failed to fetch addresses",
        });
    }
});

router.get("/:addressId", authMiddleware, async (req, resp ) => {
    try {
        const address = await Address.findOne({
            _id: req.params.addressId,
        });

        resp.json(address);
    } catch(error) {
        console.error("Get address error:", error);

        resp.status(500).json({
            message: "Failed to fetch address",
        });
    }
});

router.put("/:addressId", authMiddleware, async (req, resp) => {
    try {
        const {
            firstName,
            lastName,
            phone,
            addressLine1,
            addressLine2,
            city,
            state,
            postalCode,
            country,
        } = req.body;

        if (
            !firstName ||
            !lastName ||
            !phone ||
            !addressLine1 ||
            !city ||
            !state ||
            !postalCode
        ) {
            return resp.status(400).json({
                message: "Please provide all required address fields",
            });
        }

        const updatedAddress = await Address.findOneAndUpdate(
            {
                _id: req.params.addressId,
                userId: req.userId,
            },
            {
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                phone: phone.trim(),
                addressLine1: addressLine1.trim(),
                addressLine2: addressLine2?.trim() || "",
                city: city.trim(),
                state: state.trim(),
                postalCode: postalCode.trim(),
                country: country?.trim() || "India",
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!updatedAddress) {
            return resp.status(404).json({
                message: "Address not found",
            });
        }

        resp.json(updatedAddress);
    } catch (error) {
        console.error("Update address error:", error);

        resp.status(500).json({
            message: "Failed to update address",
        });
    }
});

router.delete("/:addressId", authMiddleware, async (req, resp) => {
    try {
        const deletedAddress = await Address.findOneAndDelete({
            _id: req.params.addressId,
            userId: req.userId,
        });

        if (!deletedAddress) {
            return resp.status(404).json({
                message: "Address not found",
            });
        }

        resp.json({
            message: "Address deleted successfully",
        });
    } catch (error) {
        console.error("Delete address error:", error);

        resp.status(500).json({
            message: "Failed to delete address",
        });
    }
});

router.patch(
    "/:addressId/default",
    authMiddleware,
    async (req, resp) => {
        try {
            const address = await Address.findOne({
                _id: req.params.addressId,
                userId: req.userId,
            });

            if (!address) {
                return resp.status(404).json({
                    message: "Address not found",
                });
            }

            await Address.updateMany(
                {
                    userId: req.userId,
                    _id: { $ne: address._id },
                },
                {
                    $set: {
                        isDefault: false,
                    },
                }
            );

            address.isDefault = true;
            await address.save();

            resp.json(address);
        } catch (error) {
            console.error("Set default address error:", error);

            resp.status(500).json({
                message: "Failed to set default address",
            });
        }
    }
);

module.exports = router;
