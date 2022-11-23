import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { calcLoans } from "../../../helpers/calcaluteLoans";
import apiClient from "../../../services/apiClient";

export const LoanDetails = ({ loanDetails, disableActions, comment }) => {
	const router = useRouter();
	const { data: session } = useSession();
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
	} = useForm({ mode: "onChange" });

	const [reasons, setReasons] = useState([
		"العبء الإئتماني لا يسمح",
		"الاستعلام الإئتماني غير مرضي",
		"المنطقة محظورة	",
		"الوظيفة محظورة	",
		"تزوير في الأوراق	",
		"قوائم سلبية	",
		"الاستعلام الميداني غير مطابق	",
		"أخرى",
	]);
	const [loanPayment, setLoanPayment] = useState(0);
	const [refuseReason, setRefuseReason] = useState("العبء الإئتماني لا يسمح");
	const Add = reasons.map((Add) => Add);
	// form

	const AcceptLoan = (data) => {
		const loading = toast.loading("جاري قبول التمويل..");
		apiClient
			.post("/api/Loan/PreapproveLoan", {
				id: loanDetails.id,
				comment: data.notes,
				user: session.user.id,
				interest: data.interest,
			})
			.then((res) => {
				toast.dismiss(loading);
				if (res.data.isSuccess) {
					toast.success("تم قبول التمويل بنجاح.");
				} else {
					toast.error("حدث خطأ ما.");
				}
			})
			.catch(() => {
				toast.dismiss(loading);
				toast.error("لقد حدث خطأ في الأنترنت.");
			})
			.finally(() => {
				setTimeout(() => {
					router.push("/risk/customers/queue");
				}, 1000);
			});
	};
	const RejectLoan = (data) => {
		const loading = toast.loading("جاري رفض التمويل..");
		apiClient
			.post("/api/Loan/RejectLoan", {
				id: loanDetails.id,
				comment: data.notes,
				user: session.user.id,
				rejectionReason: 309,
			})
			.then((res) => {
				toast.dismiss(loading);
				if (res.data.isSuccess) {
					toast.success("تم رفض التمويل بنجاح.");
				} else {
					toast.error("حدث خطأ ما.");
				}
			})
			.catch(() => {
				toast.dismiss(loading);
				toast.error("لقد حدث خطأ في الأنترنت.");
			})
			.finally(() => {
				setTimeout(() => {
					router.push("/risk/customers/queue");
				}, 1000);
			});
	};
	const RequestEditLoan = (data) => {
		const loader = toast.loading("جاري إرسال طلب التعديل...");
		apiClient
			.post("/api/Loan/SetLoanAsPending", {
				id: loanDetails.id,
				comment: data.notes,
				user: session.user.id,
			})
			.then((res) => {
				if (res.data.isSuccess) {
					toast.dismiss(loader);
					toast.success("لقد تم إرسال طلب تعديلك بنجاح..");
				} else {
					toast.error("حدث خطأ ما.");
				}
			})
			.catch(() => {
				toast.dismiss(loader);
				toast.error("لقد حدث خطأ في الأنترنت.");
			})
			.finally(() => {
				setTimeout(() => {
					router.push("/risk/customers/queue");
				}, 1000);
			});
	};

	const onSubmit = (data) => {
		if (watchReasons === "accept") {
			AcceptLoan(data);
		}
		if (watchReasons === "refuse") {
			RejectLoan(data);
		}
		if (watchReasons === "requestForEdit") {
			RequestEditLoan(data);
		}
	};

	useEffect(() => {
		if (loanDetails) {
			setValue("interest", loanDetails.interestRate);
			setValue("loanAmount", loanDetails.amount);
			setValue("loanDuration", loanDetails.period);
			setValue("downPayment", loanDetails.downPayment);
			setValue("product", loanDetails.product);
			setValue("productCategory", loanDetails.productCategory);
		}
	}, [loanDetails]);

	const watchReasons = watch("statue");
	const watchInterest = watch("interest");
	const requestDate = new Date();
	useEffect(() => {
		if (loanDetails || watchInterest) {
			const LoanInstallment = calcLoans(
				Number(loanDetails.amount),
				Number(loanDetails.period),
				Number(watchInterest),
				requestDate
			);
			setLoanPayment(LoanInstallment);
		}
	}, [loanDetails, watchInterest, loanPayment, setLoanPayment]);
	const buttonClass = `p-6 placeholder-[#9099A9] rounded-full  bg-[#DADADA36] border-0 focus:ring-0 bg-opacity-20   focus:outline-2 focus:outline-[#EDAA00] block w-full `;

	if (!loanDetails) {
		return (
			<div className=" flex justify-center items-center ">
				<svg
					role="status"
					className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
					viewBox="0 0 100 101"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
						fill="currentColor"
					/>
					<path
						d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
						fill="currentFill"
					/>
				</svg>
			</div>
		);
	}
	return (
		<div className="px-12 pb-8">
			<h4 className="font-bold text-2xl mb-6">بيانات التمويل</h4>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-10/12">
				<div className="grid grid-cols-2 gap-6">
					<div className=" w-full space-y-4">
						<label htmlFor="product" className="font-semibold">
							نوع المنتج
						</label>
						<input
							type="string"
							placeholder="نوع المنتج"
							{...register("productCategory")}
							className={buttonClass}
							disabled={true}
						/>
					</div>
					<div className=" w-full space-y-4">
						<label htmlFor="product" className="font-semibold">
							المنتج
						</label>
						<input
							type="string"
							placeholder=" المنتج"
							{...register("product")}
							className={buttonClass}
							disabled={true}
						/>
					</div>
				</div>
				<div className="grid grid-cols-3 gap-6">
					<div className=" w-full space-y-4">
						<label htmlFor="loanAmount" className="font-semibold">
							قيمة التمويل
						</label>
						<input
							type="number"
							placeholder="0"
							{...register("loanAmount")}
							className={buttonClass}
							disabled={true}
						/>
					</div>
					<div className=" w-full space-y-4">
						<label htmlFor="loanDuration" className="font-semibold">
							مدة التمويل
						</label>
						<input
							type="number"
							placeholder="0"
							{...register("loanDuration")}
							className={buttonClass}
							disabled={true}
						/>
					</div>

					<div className=" w-full space-y-4">
						<label htmlFor="downPayment" className="font-semibold">
							الدفعة المقدمة
						</label>
						<input
							type="number"
							placeholder="0"
							{...register("downPayment")}
							className={buttonClass}
							disabled={true}
						/>
					</div>

					<div className=" w-full space-y-5 col-span-3">
						<div className="h-4 w-full border-t  mb-4"></div>
						<label htmlFor="interest" className="font-semibold">
							نسبة الفائدة
						</label>
						<input
							type="number"
							{...register("interest", {
								required: watchReasons === "accept" ? true : false,
							})}
							className={buttonClass}
							disabled={disableActions}
							step="0.01"
						/>
					</div>
					<div className=" w-full space-y-5 col-span-3">
						<label htmlFor="installmentAmount" className="font-semibold">
							قيمة القسط
						</label>
						<div className={buttonClass}>{loanPayment}</div>
					</div>
					{comment && (
						<div className=" w-full space-y-5 col-span-3">
							<label htmlFor="comment" className="font-bold text-xl ">
								الملاحظة
							</label>
							<div className={buttonClass}>{comment}</div>
						</div>
					)}
				</div>
				{disableActions ? null : (
					<>
						<div>
							<h5 className="my-3 font-semibold text-2xl ">ملاحظة</h5>
							<div className="h-32">
								<textarea
									{...register("notes", {
										required: watchReasons === "requestForEdit" ? true : false,
									})}
									className="resize-none p-6   w-full rounded-3xl h-full bg-[#9797971A] border-0 focus:outline-none"
								/>
							</div>
						</div>

						<div className="mt-8">
							<ul className="flex items-center px-6 py-6 bg-[#DADADA36] rounded-full">
								<li className="relative ">
									<input
										className="sr-only peer"
										type="radio"
										value="accept"
										{...register("statue", { required: true })}
										id="accept"
									/>
									<label
										className="flex py-4 px-16 bg-[#A0A3BD] text-white border-0 rounded-full cursor-pointer focus:outline-none hover:bg-[#EDAA00] peer-checked:ring-red-500 peer-checked:ring-0 peer-checked:border-transparent peer-checked:bg-[#EDAA00]"
										htmlFor="accept"
									>
										قبول
									</label>
								</li>
								<li className="relative mx-4">
									<input
										className="sr-only peer"
										type="radio"
										value="requestForEdit"
										{...register("statue", { required: true })}
										id="edit"
									/>
									<label
										className="flex py-4 px-16 bg-[#A0A3BD] text-white border-0 rounded-full cursor-pointer focus:outline-none hover:bg-[#EDAA00] peer-checked:ring-red-500 peer-checked:ring-0 peer-checked:border-transparent peer-checked:bg-[#EDAA00]"
										htmlFor="edit"
									>
										طلب تعديل
									</label>
								</li>

								<li className="relative">
									<input
										className="sr-only peer"
										type="radio"
										value="refuse"
										{...register("statue", { required: true })}
										id="refuse"
									/>
									<label
										className="flex py-4 px-16 bg-[#A0A3BD] text-white border-0 rounded-full cursor-pointer focus:outline-none hover:bg-[#EDAA00] peer-checked:ring-red-500 peer-checked:ring-0 peer-checked:border-transparent peer-checked:bg-[#EDAA00]"
										htmlFor="refuse"
									>
										رفض
									</label>
								</li>
							</ul>
							<p>{errors.statue?.type === "required" && "يرجي الإختيار.."}</p>
						</div>
						{watchReasons === "refuse" && (
							<div className="mt-8">
								<div className="relative">
									<select
										className="bg-[#DADADA36] border-0 text-gray-900 text-lg rounded-2xl focus:ring-[#EDAA00] focus:border-0 block w-full py-6 px-8 "
										{...register("refuseReasons", {
											required: watchReasons === "refuse" ? true : false,
										})}
									>
										{Add &&
											Add.map((address, index) => (
												<option key={index++} value={address}>
													{address}
												</option>
											))}
									</select>
									<div className=" absolute top-6 left-6"> {ArrowIcon}</div>
								</div>
							</div>
						)}
						<div className="mt-10 flex justify-end w-full">
							<button
								type="submit"
								className=" font-semibold rounded-full  bg-[#343434]   text-white flex rtl:flex-row-reverse justify-center items-center  py-5  px-24  group hover:bg-[#EDAA00]  transition-all duration-200"
							>
								<span className="group-hover:text-primary">إرسال</span>
							</button>
						</div>
					</>
				)}
			</form>
		</div>
	);
};

const ArrowIcon = (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M12 -5.24537e-07C18.6274 -2.34843e-07 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 -8.1423e-07 18.6274 -5.24537e-07 12C-2.34843e-07 5.37258 5.37258 -8.1423e-07 12 -5.24537e-07Z"
			fill="#A0A3BD"
		/>
		<path
			d="M15 10.7144L12.0158 13.6986L9.03157 10.7144"
			stroke="#FCFCFC"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);
