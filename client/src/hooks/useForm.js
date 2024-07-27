import { useState } from "react";

export const useForm = (initialValues, onSubmit, validate) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const setValuesWrapper = (values) => {
        setValues(values);
    }
    const changeHandler = (e) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value,
        });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        const validationErrors = validate(values);
        if (Object.keys(validationErrors).length === 0) {
            await onSubmit(values);
        } else {
            setErrors(validationErrors);
        }
    };

    return {
        values,
        errors,
        changeHandler,
        submitHandler,
        setValuesWrapper
    };
};
