import classNames from "classnames";

export const FormInput = ({
	fieldName,
	register,
	errors,
	placeHolder,
	isRequired,
	maximLength,
	minimLength,
	className,
}) => {
	const styles = `p-6 placeholder-[#9099A9] rounded-full  bg-[#DADADA36] bg-opacity-20   focus:outline-2 focus:outline-[#EDAA00] block w-full border-0 ring-0 focus:ring-0 `;

	return (
		//Input field
		<div className="">
			<input
				placeholder={placeHolder}
				{...register(fieldName, {
					required: {
						value: isRequired,
						message: "This is required",
					},
					maxLength: {
						value: maximLength,
						message: `Value must be maximum ${maximLength}`,
					},
					minLength: {
						value: minimLength,
						message: `Value must be minimum ${minimLength}`,
					},
				})}
				className={classNames(styles, className)}
			/>

			<p>
				{
					//Shows if error exist
					errors[fieldName] && errors[fieldName].message
				}
			</p>
		</div>
	);
};
