import axios from "axios";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";

// 👇 Here are the validation errors you will use with Yup.
const validationErrors = {
	fullNameTooShort: "full name must be at least 3 characters",
	fullNameTooLong: "full name must be at most 20 characters",
	sizeIncorrect: "size must be S or M or L",
};

// 👇 Here you will create your schema.
const schema = Yup.object().shape({
	fullName: Yup.string()
		.min(3, validationErrors.fullNameTooShort)
		.max(20, validationErrors.fullNameTooLong),
	size: Yup.string()
		.required("Size is required")
		.oneOf(["S", "M", "L"], validationErrors.sizeIncorrect),
	toppings: Yup.array(),
});

// 👇 This array could help you construct your checkboxes using .map in the JSX.
const toppings = [
	{ topping_id: "1", text: "Pepperoni" },
	{ topping_id: "2", text: "Green Peppers" },
	{ topping_id: "3", text: "Pineapple" },
	{ topping_id: "4", text: "Mushrooms" },
	{ topping_id: "5", text: "Ham" },
];

const initialFormValues = {
	fullName: "",
	size: "",
	toppings: [],
};

const initialErrors = {
	fullName: "",
	size: "",
};

export default function Form() {
	const [formValues, setFormValues] = useState(initialFormValues);
	const [errors, setErrors] = useState(initialErrors);
	const [formDisabled, setFormDisabled] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

	useEffect(() => {
		schema.isValid(formValues).then((valid) => {
			setFormDisabled(!valid);
		});
	}, [formValues]);

	const changeHandler = (e) => {
		const { name, value, checked, type } = e.target;
		if (type === "checkbox") {
			if (checked) {
				setFormValues({
					...formValues,
					toppings: [...formValues.toppings, value],
				});
			} else {
				setFormValues({
					...formValues,
					toppings: formValues.toppings.filter((t) => t !== value),
				});
			}
		} else {
			setFormValues({
				...formValues,
				[name]: value,
			});
		}

		if (name === "fullName" || name === "size") {
			Yup.reach(schema, name)
				.validate(value.trim())
				.then(() => {
					setErrors({ ...errors, [name]: "" });
				})
				.catch((err) => {
					setErrors({ ...errors, [name]: err.errors[0] });
				});
		}
	};

	const submitHandler = (e) => {
		e.preventDefault();
		axios.post("http://localhost:9009/api/order", formValues).then((res) => {
			setErrorMessage('');
      setSuccessMessage(res.data.message);
      setFormValues(initialFormValues);
		}).catch((err) => {
      setSuccessMessage('');
      console.log(err);
      setErrorMessage(err.response.data.message);
    });
	};

	return (
		<form onSubmit={submitHandler}>
			<h2>Order Your Pizza</h2>
			{successMessage && <div className="success">{successMessage}</div>}
			{errorMessage && <div className="failure">{errorMessage}</div>}

			<div className="input-group">
				<div>
					<label htmlFor="fullName">Full Name</label>
					<br />
					<input
						onChange={changeHandler}
						name="fullName"
						value={formValues.fullName}
						placeholder="Type full name"
						id="fullName"
						type="text"
					/>
				</div>
				{errors.fullName && <div className="error">{errors.fullName}</div>}
			</div>

			<div className="input-group">
				<div>
					<label htmlFor="size">Size</label>
					<br />
					<select
						onChange={changeHandler}
						value={formValues.size}
						name="size"
						id="size"
					>
						<option value="">----Choose Size----</option>
						<option value="S">Small</option>
						<option value="M">Medium</option>
						<option value="L">Large</option>
					</select>
				</div>
				{errors.size && <div className="error">{errors.size}</div>}
			</div>

			<div className="input-group">
				{toppings.map((topping) => (
					<label key={topping.topping_id}>
						<input
							onChange={changeHandler}
							checked={formValues.toppings.includes(topping.topping_id)}
							value={topping.topping_id}
							name={topping.text}
							type="checkbox"
						/>
						{topping.text}
						<br />
					</label>
				))}
			</div>
			{/* 👇 Make sure the submit stays disabled until the form validates! */}
			<input disabled={formDisabled} type="submit" />
		</form>
	);
}


























