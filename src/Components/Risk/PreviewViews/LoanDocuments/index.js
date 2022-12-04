import { useState } from "react";
import { useForm } from "react-hook-form";
import apiClient from "../../../services/apiClient";
// import { CustomDropDown } from "../../../Atomics/CustomDropDown";
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export const LoanDocaments = ({
	id,
	disableAction,
	loanDocs,
	customerInfo,
}) => {
	const { data: session } = useSession();
	const router = useRouter();
	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm();

	const watchReasons = watch("statue");
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

	//
	const [refuseReason, setRefuseReason] = useState("العبء الإئتماني لا يسمح");
	const Add = reasons.map((Add) => Add);
	// form
	// setTimeout(() => {
	// 	router.push("/risk/customers/queue");
	// }, 2000);
	const onSubmit = (data) => {
		if (watchReasons === "accept") {
			const loading = toast.loading("جاري قبول العميل..");
			apiClient
				.post("/api/Loan/ApproveLoan", {
					id: id,
					comment: "string",
					user: session.user.id,
				})
				.then((res) => {
					toast.dismiss(loading);
					console.log(res.data, "res");
					if (res.data.isSuccess) {
						toast.success("تم إكمال التمويل بنجاح.");
					}
				})
				.catch(() => {
					toast.dismiss(loading);
					toast.error("لقد حدث خطأ.");
				});
		}
		if (watchReasons === "refuse") {
			const loading = toast.loading("جاري رفض التمويل..");
			apiClient
				.post("/api/Loan/RejectLoan", {
					id: id,
					comment: data.notes,
					user: session.user.id,
					rejectionReason: refuseReason.id,
				})
				.then((res) => {
					toast.dismiss(loading);
					if (res.data.isSuccess) {
						toast.success("تم رفض التمويل..");
						setTimeout(() => {
							router.push("/risk/customers/queue");
						}, 1000);
					}
				})
				.catch(() => {
					toast.dismiss(loading);
					toast.error("لقد حدث خطأ.");
				});
		}
		if (watchReasons === "requestForEdit") {
			console.log(customerInfo.id);
			const loader = toast.loading("جاري إرسال طلب التعديل...");
			apiClient
				.post("/api/Loan/RequestForEdit", {
					id: id,
					comment: data.notes,
					user: session.user.id,
				})
				.then((res) => {
					if (res.data.isSuccess) {
						toast.dismiss(loader);
						toast.success("لقد تم إرسال طلب تعديلك بنجاح..");
						// setTimeout(() => {
						// 	router.push("/risk/customers/queue");
						// }, 2000);
					}
				})
				.catch(() => {
					toast.dismiss(loader);
					toast.error();
				});
		}
	};
	if (!loanDocs) {
		return (
			<div className=" flex justify-center items-center py-24">
				<svg
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
			<Toaster position="bottom-center" />
			{loanDocs && (
				<>
					<h2 className=" font-bold text-2xl mb-">المستندات</h2>
					<div className=" grid grid-cols-3 gap-6">
						{loanDocs.map((doc, index) => {
							return (
								<div key={index++} className="ml-6">
									<p className="mt-3 mb-6">{doc.typeName}</p>
									<a
										href={doc.url}
										download={doc.typeName}
										target="_blank"
										rel="noopener noreferrer"
									>
										<button className=" relative py-5 px-8 text-[#9099A9] font-semibold   rounded-xl border border-dashed border-[#999999] flex items-center">
											{FolderNameIcon}
											<span className="mr-4">{doc.typeName}</span>
											<div className=" absolute -top-4 -right-4 bg-white p-2 border border-[#9099A9] rounded-full">
												{ViewEye}
											</div>
										</button>
									</a>
								</div>
							);
						})}
					</div>
				</>
			)}

			{disableAction ? null : (
				<div className="mt-12">
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-10/12">
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
					</form>
				</div>
			)}
		</div>
	);
};

const ViewEye = (
	<svg
		width="23"
		height="23"
		viewBox="0 0 23 23"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M1.82618 12.3483C1.41451 11.6371 1.41451 10.7629 1.82617 10.0516C3.9922 6.30937 7.45678 3.88562 11.3612 3.88562C15.2656 3.88562 18.7301 6.30933 20.8962 10.0515C21.3078 10.7628 21.3078 11.637 20.8962 12.3482C18.7301 16.0905 15.2656 18.5142 11.3612 18.5142C7.45677 18.5142 3.99221 16.0905 1.82618 12.3483Z"
			stroke="#999999"
			strokeWidth="2"
		/>
		<ellipse
			cx="11.3611"
			cy="11.1999"
			rx="2.76516"
			ry="2.74286"
			stroke="#999999"
			strokeWidth="2"
		/>
	</svg>
);
const FolderNameIcon = (
	<svg
		width="23"
		height="18"
		viewBox="0 0 23 18"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M1.49399 3.99988C1.49399 2.34303 2.83713 0.999878 4.49399 0.999878H8.22564C8.93765 0.999878 9.62645 1.25312 10.1689 1.71432L11.7143 3.02829C12.2568 3.4895 12.9456 3.74273 13.6576 3.74273H18.7718C20.4287 3.74273 21.7718 5.08588 21.7718 6.74273V13.5427C21.7718 15.1996 20.4287 16.5427 18.7718 16.5427H4.49399C2.83713 16.5427 1.49399 15.1996 1.49399 13.5427V3.99988Z"
			stroke="#9099A9"
			strokeWidth="2"
		/>
	</svg>
);
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
const NoDataIcon = (
	<svg
		width="213"
		height="213"
		viewBox="0 0 213 213"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			opacity="0.35"
			d="M195.25 145.372V71C195.25 56.2941 183.331 44.375 168.625 44.375H97.625L53.25 35.5L17.75 44.375V150.875C17.75 165.581 29.6691 177.5 44.375 177.5H134.376C138.335 192.783 152.1 204.125 168.625 204.125C188.23 204.125 204.125 188.23 204.125 168.625C204.125 159.679 200.708 151.612 195.25 145.372Z"
			fill="#FFC662"
		/>
		<path
			d="M97.625 44.375H17.75V35.5C17.75 25.6931 25.6931 17.75 35.5 17.75H75.9522C83.5936 17.75 90.3741 22.6401 92.7881 29.891L97.625 44.375Z"
			fill="#FFC662"
		/>
		<path
			d="M200.007 137.243C182.683 119.919 154.576 119.919 137.252 137.243C119.928 154.567 119.928 182.674 137.252 199.998C154.576 217.322 182.683 217.322 200.007 199.998C217.331 182.674 217.322 154.567 200.007 137.243ZM178.041 190.591L168.625 181.174L159.209 190.591C155.756 194.043 150.112 194.043 146.659 190.591C143.207 187.138 143.207 181.494 146.659 178.041L156.076 168.625L146.659 159.209C143.207 155.756 143.207 150.112 146.659 146.659C150.112 143.207 155.756 143.207 159.209 146.659L168.625 156.076L178.041 146.659C181.494 143.207 187.138 143.207 190.591 146.659C194.043 150.112 194.043 155.756 190.591 159.209L181.174 168.625L190.591 178.041C194.043 181.494 194.043 187.138 190.591 190.591C187.138 194.043 181.494 194.043 178.041 190.591Z"
			fill="#FFC662"
		/>
	</svg>
);
