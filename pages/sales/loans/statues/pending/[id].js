import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Image from "next/image";
import classNames from "classnames";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";

import DashboardLayout from "../../../../components/Dashboard/Layout";
import apiClient from "../../../../services/apiClient";
import { ProductsDropDown } from "../../../../components/Atomics/Sales/ProductDropDown";

const PendingLoan = () => {
	const router = useRouter();
	const { id } = router.query;
	const loanId = id;
	const { data: session } = useSession();
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm({ mode: "onBlur" });

	const [selectedCategoryProduct, setSelectedCategoryProduct] = useState({
		categoryName: "يرجي الإختيار",
		categoryId: -1,
		product: [],
	});
	const [selectedProduct, setSelectedProduct] = useState({
		name: "يرجي الإختيار",
		id: -1,
	});

	const [customerInfo, setcustomerInfo] = useState(null);
	const [comment, setComment] = useState("");

	useEffect(() => {
		if (loanId) {
			GetLoanData();
		}
	}, [loanId]);
	const GetLoanData = () => {
		const loading = toast.loading("جاري تحميل البيانات..");
		apiClient
			.post("/api/Loan/GetRequestedLoanDetails", { loanId: loanId })
			.then(({ data }) => {
				toast.dismiss(loading);
				if (data.isSuccess) {
					toast.success("تم تحميل البيانات بنجاح...");
					setcustomerInfo(data.customer);
					setValue("LoanAmount", data.loan.amount);
					setValue("LoanDuration", data.loan.period);
					setValue("DownPayment", data.loan.downPayment);
					setComment(data.loan.comment);
					setSelectedCategoryProduct({
						...selectedCategoryProduct,
						categoryId: data.loan.productCategoryId,
						categoryName: data.loan.productCategory,
					});
					setSelectedProduct({
						...selectedProduct,
						name: data.loan.product,
						id: data.loan.productId,
					});
					console.log(data.loan);
				}
			})
			.catch((err) => {
				console.error(err);
			});
	};

	const onSubmit = (data) => {
		const loading = toast.loading("جاري تعديل بيانات التمويل..");
		apiClient
			.post("/api/Loan/UpdateLoan", {
				id: loanId,
				customerId: customerInfo.customer.id,
				sales: session.user.id,
				product: selectedProduct.id,
				amount: data.LoanAmount,
				period: data.LoanDuration,
				downPayment: data.DownPayment,
			})
			.then((res) => {
				toast.dismiss(loading);
				if (res.data.isSuccess) {
					toast.success("تم تعديل البيانات..");
					setTimeout(() => {
						router.push("/loans/queue");
					}, 1000);
				}
				if (!res.data.isSuccess) {
					toast.error("لقد حدث خطأ..");
				}
			})
			.catch(() => {
				toast.dismiss(loading);
				toast.error("لقد حدث خطأ..");
			});
	};

	const buttonClass = `p-6 placeholder-[#9099A9] rounded-full  bg-[#DADADA36] bg-opacity-20   focus:outline-2 focus:outline-[#EDAA00] block w-full  border-0 focus:ring-0 focus:outline-none`;

	return (
		<DashboardLayout>
			<Toaster position="bottom-center" />
			{customerInfo && (
				<section className="w-10/12 mx-auto shadow-md pb-8 rounded-3xl bg-white">
					<div className="flex items-center justify-start p-12  bg-[#606166]  rounded-3xl mb-10">
						<Image
							src="/customer/pending.png"
							alt="Almasria Logo"
							width={231}
							height={231}
						/>
						<div className="mr-4 leading-normal">
							<h2 className="text-7xl mb-4  lg:leading-normal">معذرة!</h2>
							<p className="text-4xl text-white">
								يرجي مراجعة بيانات التمويل..
							</p>
						</div>
					</div>
					{comment && (
						<div className="px-12 mb-6">
							<h5 className="my-3 font-bold text-2xl">الملاحظة</h5>
							<p className=" rounded-full px-10 pt-5 p-5  bg-[#DADADA36]">
								{comment}
							</p>
						</div>
					)}
					<div className={classNames("px-8  border-gray-100 rounded-2xl ")}>
						<div className="flex items-center mb-4 font-semibold">
							<span className="ml-4">{Person}</span>
							{customerInfo && (
								<div>
									<p className="font-bold">{`${customerInfo.customer.firstName} ${customerInfo.customer.secondName} ${customerInfo.customer.thirdName} ${customerInfo.customer.fourthName}`}</p>
									{customerInfo && (
										<p className="text-gray-400">{`${customerInfo.customer.idno}`}</p>
									)}
								</div>
							)}
						</div>
						{customerInfo && customerInfo.customerScoring && (
							<div>
								<h2 className="mt-12 mb-6 font-3xl font-bold ">تقييم العميل</h2>
								{customerInfo && customerInfo.customerScoring && (
									<div className="grid grid-cols-2 gap-x-8 gap-y-6">
										<div>
											<h5 className="my-3 font-medium"> شريحة العميل</h5>
											<p className=" rounded-full px-10 p-5 bg-[#DADADA36]">
												{customerInfo.customerScoring.segmentation}
											</p>
										</div>
										<div>
											<h5 className="my-3 font-medium">سعر الفائدة</h5>
											<p className=" rounded-full px-10 p-5 bg-[#DADADA36]">
												{customerInfo.customerScoring.pricing}
											</p>
										</div>
										<div>
											<h5 className="my-3 font-medium">حد التمويل</h5>
											<p className=" rounded-full px-10 p-5 bg-[#DADADA36]    ">
												{customerInfo.customerScoring.exposureLimit}
											</p>
										</div>
										<div>
											<h5 className="my-3 font-medium">
												سعر فائدة السلعة المعمرة
											</h5>
											<p className=" rounded-full px-10 p-5 bg-[#DADADA36]">
												{customerInfo.customerScoring.cgfRate}
											</p>
										</div>
									</div>
								)}
							</div>
						)}
						<div>
							<h2 className="mt-12 mb-6 font-3xl font-bold ">بيانات التمويل</h2>
							<form
								onSubmit={handleSubmit(onSubmit)}
								className=" space-y-6 w-full "
								autoComplete="off"
							>
								<div>
									<ProductsDropDown
										selectedCategoryProduct={selectedCategoryProduct}
										setSelectedCategoryProduct={setSelectedCategoryProduct}
										setSelectedProduct={setSelectedProduct}
										selectedProduct={selectedProduct}
										disableProductCategory
										className="col-span-2"
									/>
								</div>
								<div className="grid grid-cols-2 gap-6">
									<div className=" w-full space-y-4">
										<label htmlFor="LoanAmount" className="font-semibold">
											قيمة التمويل
										</label>
										<input
											type="string"
											placeholder="0"
											{...register("LoanAmount", { required: true })}
											className={buttonClass}
										/>
									</div>
									<div className=" w-full space-y-4">
										<label htmlFor="LoanDuration" className="font-semibold">
											مدة التمويل
										</label>
										<input
											type="string"
											placeholder="0"
											{...register("LoanDuration", { required: true })}
											className={buttonClass}
										/>
									</div>
								</div>
								<div className="grid  gap-6">
									<div className=" w-full space-y-4">
										<label htmlFor="DownPayment" className="font-semibold">
											الدفعة المقدمة
										</label>
										<input
											type="string"
											placeholder="0"
											{...register("DownPayment", { required: true })}
											className={buttonClass}
										/>
									</div>
								</div>
								<div className="flex items-center  justify-end">
									<button
										type="submit"
										className=" font-semibold rounded-full bg-[#343434]   text-white flex rtl:flex-row-reverse justify-center items-center  py-5   px-20  group hover:bg-[#EDAA00]  transition-all duration-200"
									>
										<span className="group-hover:text-primary">
											تحديث البيانات
										</span>
									</button>
								</div>
							</form>
						</div>
					</div>
				</section>
			)}
		</DashboardLayout>
	);
};

export default PendingLoan;

const Person = (
	<svg
		width="80"
		height="80"
		viewBox="0 0 80 80"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<g filter="url(#filter0_d_1225_17558)">
			<circle cx="40" cy="34" r="30" fill="white" />
		</g>
		<path
			d="M53.0625 39.3125H45.7969L44.5375 38.8281H47.4496C48.0008 38.8281 48.5162 38.4789 48.659 37.9461C48.8751 37.1406 48.2653 36.4062 47.4922 36.4062C47.0911 36.4062 46.7656 36.0807 46.7656 35.6797C46.7656 35.2786 47.0911 34.9531 47.4922 34.9531H48.9027C49.4544 34.9531 49.9693 34.6039 50.1122 34.0711C50.3282 33.2656 49.7184 32.0469 48.9453 32.0469H48.7031C48.1679 32.0469 47.7344 31.6134 47.7344 31.0781C47.7344 30.5429 48.1679 30.1094 48.7031 30.1094H53.2621C53.8138 30.1094 54.3287 29.7601 54.4715 29.2273C54.6876 28.4218 54.0778 27.6875 53.3047 27.6875H52.5781C52.0429 27.6875 51.6094 27.254 51.6094 26.7188C51.6094 26.1835 52.0429 25.75 52.5781 25.75H53.5469C54.442 25.75 55.1545 24.93 54.9709 24.0038C54.8339 23.3146 54.1863 22.8438 53.4834 22.8438H48.4609C48.0599 22.8438 47.7344 22.5182 47.7344 22.1172C47.7344 21.7161 48.0599 21.3906 48.4609 21.3906H51.3246C51.8763 21.3906 52.3912 21.0414 52.534 20.5086C52.7501 19.7031 52.1403 18.9688 51.3672 18.9688H29.1286C28.5769 18.9688 28.062 19.318 27.9191 19.8508C27.703 20.6563 28.3129 21.3906 29.0859 21.3906C29.7549 21.3906 30.2969 21.9326 30.2969 22.6016C30.2969 23.2705 29.7549 23.8125 29.0859 23.8125H28.6442H27.3906C26.5914 23.8125 25.9375 24.4664 25.9375 25.2656C25.9375 26.0648 26.5914 26.7188 27.3906 26.7188H36.5938C36.7643 26.7188 36.9255 26.6834 37.0781 26.6291V32.0469H33.4879C32.9362 32.0469 32.4213 32.8805 32.2785 33.4133C32.1724 33.809 32.2668 34.1859 32.4809 34.4688H25.2109C24.542 34.4688 24 35.0108 24 35.6797C24 36.3486 24.542 36.8906 25.2109 36.8906H25.6953C26.3642 36.8906 26.9063 37.4326 26.9063 38.1016C26.9063 38.7705 26.3642 39.3125 25.6953 39.3125H25.4531C24.6505 39.3125 24 39.963 24 40.7656C24 41.5682 24.6505 42.2188 25.4531 42.2188H28.6016C29.2705 42.2188 29.8125 42.7608 29.8125 43.4297C29.8125 44.0986 29.2705 44.6406 28.6016 44.6406H27.875C27.0724 44.6406 26.4219 45.2911 26.4219 46.0938C26.4219 46.8964 27.0724 47.5469 27.875 47.5469H51.125C51.9276 47.5469 52.5781 46.8964 52.5781 46.0938C52.5781 45.2911 51.9276 44.6406 51.125 44.6406H50.8828C50.2139 44.6406 49.6719 44.0986 49.6719 43.4297C49.6719 42.7608 50.2139 42.2188 50.8828 42.2188H53.0625C53.8651 42.2188 54.5156 41.5682 54.5156 40.7656C54.5156 39.963 53.8651 39.3125 53.0625 39.3125ZM37.0781 35.9592L34.4625 34.9531H37.0781V35.9592Z"
			fill="url(#paint0_radial_1225_17558)"
		/>
		<path
			d="M40.2266 22.8438C37.3361 22.8438 34.5641 23.992 32.5202 26.0358C30.4763 28.0797 29.3281 30.8517 29.3281 33.7422C29.3281 36.6326 30.4763 39.4047 32.5202 41.4485C34.5641 43.4924 37.3361 44.6406 40.2266 44.6406C43.117 44.6406 45.8891 43.4924 47.9329 41.4485C49.9768 39.4047 51.125 36.6326 51.125 33.7422C51.125 30.8517 49.9768 28.0797 47.9329 26.0358C45.8891 23.992 43.117 22.8438 40.2266 22.8438Z"
			fill="url(#paint1_linear_1225_17558)"
		/>
		<path
			d="M50.1562 21.3906H35.625C31.0772 21.3906 27.3906 25.0772 27.3906 29.625V37.1328C27.3906 38.8717 28.8002 40.2812 30.5391 40.2812C32.278 40.2812 33.6875 38.8717 33.6875 37.1328V34.4688C33.6875 31.5262 36.073 29.1406 39.0156 29.1406H46.2812C49.4912 29.1406 52.0938 26.5381 52.0938 23.3281C52.0938 22.2581 51.2262 21.3906 50.1562 21.3906Z"
			fill="url(#paint2_linear_1225_17558)"
		/>
		<path
			d="M50.1562 33.9844C50.1562 35.0553 49.2897 35.9219 48.2188 35.9219C47.1478 35.9219 46.2812 35.0553 46.2812 33.9844C46.2812 32.9134 47.1478 32.0469 48.2188 32.0469C49.2897 32.0469 50.1562 32.9134 50.1562 33.9844Z"
			fill="#717171"
		/>
		<path
			d="M49.1875 33.9844C49.1875 34.5191 48.7535 34.9531 48.2188 34.9531C47.684 34.9531 47.25 34.5191 47.25 33.9844C47.25 33.4496 47.684 33.0156 48.2188 33.0156C48.7535 33.0156 49.1875 33.4496 49.1875 33.9844Z"
			fill="#595859"
		/>
		<path
			d="M48.2188 33.2578C48.2188 33.6589 47.8932 33.9844 47.4922 33.9844C47.0911 33.9844 46.7656 33.6589 46.7656 33.2578C46.7656 32.8567 47.0911 32.5312 47.4922 32.5312C47.8932 32.5312 48.2188 32.8567 48.2188 33.2578Z"
			fill="#9E9E9E"
		/>
		<path
			d="M47.2539 33.9413C47.329 33.9675 47.4079 33.9844 47.4917 33.9844C47.8928 33.9844 48.2183 33.6589 48.2183 33.2578C48.2183 33.1741 48.2013 33.0951 48.1752 33.02C47.6753 33.0423 47.2762 33.4414 47.2539 33.9413Z"
			fill="#8F8E8F"
		/>
		<path
			d="M43.375 33.9844C43.375 35.0553 42.5085 35.9219 41.4375 35.9219C40.3665 35.9219 39.5 35.0553 39.5 33.9844C39.5 32.9134 40.3665 32.0469 41.4375 32.0469C42.5085 32.0469 43.375 32.9134 43.375 33.9844Z"
			fill="#717171"
		/>
		<path
			d="M42.4062 33.9844C42.4062 34.5191 41.9722 34.9531 41.4375 34.9531C40.9028 34.9531 40.4688 34.5191 40.4688 33.9844C40.4688 33.4496 40.9028 33.0156 41.4375 33.0156C41.9722 33.0156 42.4062 33.4496 42.4062 33.9844Z"
			fill="#595859"
		/>
		<path
			d="M41.4375 33.2578C41.4375 33.6589 41.112 33.9844 40.7109 33.9844C40.3099 33.9844 39.9844 33.6589 39.9844 33.2578C39.9844 32.8567 40.3099 32.5312 40.7109 32.5312C41.112 32.5312 41.4375 32.8567 41.4375 33.2578Z"
			fill="#9E9E9E"
		/>
		<path
			d="M40.4727 33.9413C40.5477 33.9675 40.6267 33.9844 40.7105 33.9844C41.1115 33.9844 41.437 33.6589 41.437 33.2578C41.437 33.1741 41.4201 33.0951 41.3939 33.02C40.8941 33.0423 40.4949 33.4414 40.4727 33.9413Z"
			fill="#8F8E8F"
		/>
		<path
			d="M45.7969 37.8594H43.8594C43.593 37.8594 43.375 38.0773 43.375 38.3438C43.375 39.1464 44.0255 39.7969 44.8281 39.7969C45.6307 39.7969 46.2812 39.1464 46.2812 38.3438C46.2812 38.0773 46.0633 37.8594 45.7969 37.8594Z"
			fill="#717171"
		/>
		<defs>
			<filter
				id="filter0_d_1225_17558"
				x="0"
				y="0"
				width="80"
				height="80"
				filterUnits="userSpaceOnUse"
				colorInterpolationFilters="sRGB"
			>
				<feFlood floodOpacity="0" result="BackgroundImageFix" />
				<feColorMatrix
					in="SourceAlpha"
					type="matrix"
					values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
					result="hardAlpha"
				/>
				<feOffset dy="6" />
				<feGaussianBlur stdDeviation="5" />
				<feColorMatrix
					type="matrix"
					values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0"
				/>
				<feBlend
					mode="normal"
					in2="BackgroundImageFix"
					result="effect1_dropShadow_1225_17558"
				/>
				<feBlend
					mode="normal"
					in="SourceGraphic"
					in2="effect1_dropShadow_1225_17558"
					result="shape"
				/>
			</filter>
			<radialGradient
				id="paint0_radial_1225_17558"
				cx="0"
				cy="0"
				r="1"
				gradientUnits="userSpaceOnUse"
				gradientTransform="translate(39.4385 35.2287) scale(24.3452)"
			>
				<stop stopColor="#AFEEFF" />
				<stop offset="0.193" stopColor="#BBF1FF" />
				<stop offset="0.703" stopColor="#D7F8FF" />
				<stop offset="1" stopColor="#E1FAFF" />
			</radialGradient>
			<linearGradient
				id="paint1_linear_1225_17558"
				x1="40.2266"
				y1="44.6406"
				x2="40.2266"
				y2="22.8438"
				gradientUnits="userSpaceOnUse"
			>
				<stop stopColor="#FFC662" />
				<stop offset="0.004" stopColor="#FFC662" />
				<stop offset="0.609" stopColor="#FFC582" />
				<stop offset="1" stopColor="#FFC491" />
			</linearGradient>
			<linearGradient
				id="paint2_linear_1225_17558"
				x1="39.7422"
				y1="21.3906"
				x2="39.7422"
				y2="40.2812"
				gradientUnits="userSpaceOnUse"
			>
				<stop stopColor="#FF8B67" />
				<stop offset="0.847" stopColor="#FFA76A" />
				<stop offset="1" stopColor="#FFAD6B" />
			</linearGradient>
		</defs>
	</svg>
);
