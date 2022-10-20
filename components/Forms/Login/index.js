import { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";
// import axios from "axios";

export const LoginForm = () => {
	const router = useRouter();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();
	const [loading, setLoading] = useState(false);
	const onSubmit = async ({ username, password }) => {
		const loading = toast.loading("جاري تسجيل الدخول");
		setLoading(true);
		const res = await signIn("credentials", {
			username,
			password,
			redirect: false,
		});
		if (!res.ok) {
			setLoading(false);
			toast.dismiss(loading);
			toast.error("خطأ في اسم المستخدم او كلمة المرور");
		}
		if (res.ok) {
			toast.dismiss(loading);
		}
		return res;
	};
	const buttonClass = `py-5 px-8 focus:ring-[#EDAA00] focus:border-transparent focus:ring-2  placeholder-[#B8BCCA]  rounded-full mt-3  bg-[#F8FAFC]  focus:outline-2 focus:outline-none block w-full  `;
	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="w-full space-y-6   rounded-2xl "
			autoComplete="off"
		>
			<div className="w-full group">
				<label htmlFor="email">اسم المستخدم</label>
				<input
					type="text"
					placeholder="اسم المستخدم"
					{...register("username", {
						required: true,
					})}
					className={buttonClass}
				/>
				{errors.email && <span>This field is required</span>}
			</div>
			<div className="w-full">
				<label htmlFor="password">الرقم السري</label>
				<input
					type="password"
					placeholder="الرقم السري"
					{...register("password", { required: true })}
					className={buttonClass}
				/>
				{errors.name && <span>This field is required</span>}
			</div>
			<div className="flex items-center justify-center">
				<button
					type="submit"
					className=" font-bold rounded-full bg-[#343434]   text-white  py-5  w-full px-20  group hover:bg-[#EDAA00]  transition-all duration-200"
					disabled={loading}
				>
					<span className="group-hover:text-black">تسجيل الدخول</span>
				</button>
			</div>
			<div>
				<Toaster position="top-center" />
			</div>
		</form>
	);
};
