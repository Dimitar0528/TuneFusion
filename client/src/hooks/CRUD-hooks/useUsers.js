import { useEffect, useState } from "react";

import authAPI from "../../api/auth-api";
import showToast from "../../utils/showToast";
import extractUUIDPrefix from "../../utils/extractUUIDPrefix";

export const validateEditAccount = (values) => {
    const errors = {};

    if (!values.name) {
        errors.name = "Username is required";
    } else if (values.name.length < 3) {
        errors.name = "Username must be at least 3 characters long";
    }

    if (!values.first_name) {
        errors.first_name = "First name is required";
    } else if (values.first_name.length < 2) {
        errors.first_name = "First name must be at least 2 characters long";
    }

    if (!values.last_name) {
        errors.last_name = "Last name is required";
    } else if (values.last_name.length < 2) {
        errors.last_name = "Last name must be at least 2 characters long";
    }

    if (!values.email_address) {
        errors.email_address = "Email address is required";
    } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email_address)
    ) {
        errors.email_address = "Invalid email address";
    }

    if (!values.phone_number) {
        errors.phone_number = "Phone number is required";
    } else if (!/^\d{10}$/.test(values.phone_number)) {
        errors.phone_number = "Phone number must be 10 digits";
    }

    return errors;
};
