import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import classNames from "classnames";
import { useSession } from "next-auth/react";

import DashboardLayout from "../../../../components/Dashboard/Layout";
import apiClient from "../../../../services/apiClient";
import { FileReplacer } from "../../../../components/Atomics/Files/FileReplacer";
import { ProductsDropDown } from "../../../../components/Atomics/Sales/ProductDropDown";
import moment from "moment";

const PendingCustomer = () => {
	const { data: session } = useSession();
	const router = useRouter();
	const { id } = router.query;
	const customerId = id;
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm({ mode: "onBlur" });
	// product
	const [selectedCategoryProduct, setSelectedCategoryProduct] = useState({
		categoryName: "يرجي الإختيار",
		categoryId: -1,
		product: [],
	});
	const [selectedProduct, setSelectedProduct] = useState({
		name: "يرجي الإختيار",
		id: -1,
	});
	const [succes, setSuccess] = useState(false);
	const [customerDocs, setCustomerDocs] = useState(null);
	const [customerInfo, setCustomerInfo] = useState(null);
	const [comment, setComment] = useState("");

	useEffect(() => {
		if (id) {
			GetCustomerDocs();
			GetCustomerData();
		}
	}, [id]);
	const GetCustomerDocs = () => {
		apiClient
			.post("/api/Customer/GetRequestedCustomerDocuments", {
				customerId: customerId,
			})
			.then((res) => {
				setCustomerDocs(res.data.customerUploadDocuments);
			})
			.catch(() => {
				toast.error("لقد حدث خطأ في تحميل المستندات..");
			});
	};
	const GetCustomerData = () => {
		const loading = toast.loading("جاري تحميل بيانات العميل ..");
		apiClient
			.post("/api/Customer/GetCustomerDetails", { customerId: customerId })
			.then((res) => {
				toast.dismiss(loading);
				if (res && res.data && res.data.isSuccess) {
					toast.success("تم تحميل بيانات العميل.");
					setCustomerInfo(res.data.customer);
					setComment(res.data.customer.customerStatusDetails.comment);
					const customer = res.data.customer;
					{
						customer.customer.idno && setValue("Idno", customer.customer.idno);
					}
					{
						customer.customer.firstName &&
							setValue("FirstName", customer.customer.firstName);
					}
					{
						customer.customer.secondName &&
							setValue("SecondName", customer.customer.secondName);
					}
					{
						customer.customer.thirdName &&
							setValue("ThirdName", customer.customer.thirdName);
					}

					{
						customer.customer.fourthName &&
							setValue("LastName", customer.customer.fourthName);
					}
					{
						customer.customerAdditionalData.homeAddress &&
							setValue("Address", customer.customerAdditionalData.homeAddress);
					}
					{
						customer.customerAdditionalData.inquireAddress &&
							setValue(
								"InvestigationAddress",
								customer.customerAdditionalData.inquireAddress
							);
					}
					{
						customer.customerAdditionalData.emailAddress &&
							setValue("Email", customer.customerAdditionalData.emailAddress);
					}
					{
						customer.customerAdditionalData.mobileNumber &&
							setValue(
								"PhoneNumber",
								customer.customerAdditionalData.mobileNumber
							);
					}
					{
						customer.customerAdditionalData.mobileNumber2 &&
							setValue(
								"SecPhoneNumber",
								customer.customerAdditionalData.mobileNumber2
							);
					}
					{
						customer.customerAdditionalData.buesinessDescription &&
							setValue(
								"JobTitle",
								customer.customerAdditionalData.buesinessDescription
							);
					}
					{
						customer.customerAdditionalData.yearsInBusiness &&
							setValue(
								"yearsInBusiness",
								customer.customerAdditionalData.yearsInBusiness
							);
					}
					setValue("Income", customer.customerAdditionalData.monthlyIncome);
					// customer interseted product
					setSelectedCategoryProduct({
						...selectedCategoryProduct,
						categoryName: customer.customerInterestedProduct.productTypeName,
						categoryId: customer.customerInterestedProduct.productTypeId,
					});
					{
						customer.customerInterestedProduct.productTypeId &&
							setSelectedProduct({
								name: customer.customerInterestedProduct.productName,
								id: customer.customerInterestedProduct.productId,
							});
					}

					{
						customer.customerInterestedProduct.amount &&
							setValue("LoanAmount", customer.customerInterestedProduct.amount);
					}
					setValue(
						"DownPayment",
						customer.customerInterestedProduct.downPayment
					);
				}
			})
			.catch(() => {
				// toast.dismiss(loading);
				// toast.error("لقد حدث خطأ.");
			});
	};
	const handleUpdateCustomer = (data) => {
		const loading = toast.loading("جاري حفظ العميل..");
		apiClient
			.post("/api/Customer/UpdateCustomer", {
				customer: {
					id: customerId,
					firstName: data.FirstName,
					secondName: data.SecondName,
					thirdName: data.ThirdName,
					fourthName: data.LastName,
					idno: customerInfo.customer.idno,
					officeJoiningDate: new Date(), //today date
					officeId: session.user.officeId.toString(),
					updatedBy: session.user.id.toString(),
					sales: session.user.id,
				},
				extraData: {
					homeAddress: data.Address,
					mobileNumber: data.PhoneNumber,
					emailAddress: data.Email,
					buesinessDescription: data.JobTitle,
					yearsInBusiness: data.yearsInBusiness,
					monthlyIncome: data.Income,
				},
				interestedProduct: {
					productTypeId: Number(selectedCategoryProduct.categoryId),
					productTypeName: "",
					productId: Number(selectedProduct.id),
					productName: "",
					amount: Number(data.LoanAmount),
					downPayment: Number(data.DownPayment),
					insertedOnDate: new Date(),
					insertedOnUser: Number(session.user.id),
				},
			})
			.then(({ data }) => {
				toast.dismiss(loading);
				if (data.isSuccess) {
					toast.success("تم تحديث بيانات العميل..");
					setSuccess(true);
					setTimeout(() => {
						router.push("/customers/queue");
					}, 2000);
				}
			})
			.catch(() => {
				toast.dismiss(loading);
				toast.error("لقد حدث خطأ.");
			});
	};
	const buttonClass = `p-6 placeholder-[#9099A9] rounded-full  bg-[#DADADA36] bg-opacity-20   focus:outline-2 focus:outline-[#EDAA00] block w-full border-0  focus:ring-0 `;
	moment.locale("en");
	const formatedBirthDate =
		customerInfo &&
		moment(customerInfo.customerAdditionalData.dateOfBirth).format(
			"YYYY-MM-DD"
		);
	return (
		<DashboardLayout>
			<Toaster position="bottom-center" />

			{customerInfo && (
				<div className="w-10/12 mx-auto   shadow-sm rounded-[32px] bg-white">
					<div className="flex items-center justify-start p-12  bg-[#606166]  rounded-3xl mb-10">
						<Image
							src="/customer/pending.png"
							alt="Almasria Logo"
							width={231}
							height={231}
						/>
						<div className="mr-4 leading-normal">
							<h2 className="text-7xl mb-4  lg:leading-normal">معذرة!</h2>
							<p className="text-4xl text-white">يرجي مراجعة بيانات العميل..</p>
						</div>
					</div>
					{comment && (
						<div className="px-12">
							<h5 className="my-3 font-bold text-2xl">الملاحظة</h5>
							<p className=" rounded-full px-10 pt-5 p-5  bg-[#DADADA36]">
								{comment}
							</p>
						</div>
					)}

					{/* product */}

					<form
						onSubmit={handleSubmit(handleUpdateCustomer)}
						className="space-y-6 py-8"
						autoComplete="off"
					>
						<div className="  px-12 py-8 rounded-[32px] bg-white shadow-sm">
							<h2 className=" font-bold text-[#EDAA00] mb-5 text-xl">
								بيانات المنتج المطلوب
							</h2>
							{/* product category */}
							<div className="grid grid-cols-2  gap-6">
								<ProductsDropDown
									selectedCategoryProduct={selectedCategoryProduct}
									setSelectedCategoryProduct={setSelectedCategoryProduct}
									setSelectedProduct={setSelectedProduct}
									selectedProduct={selectedProduct}
									className="col-span-2"
								/>
								<div className="space-y-3">
									<label className="font-semibold">قيمة التمويل المتوقعة</label>
									<input
										type="number"
										placeholder=" 0 جنيه مصري"
										{...register("LoanAmount")}
										className={buttonClass}
									/>
								</div>
								<div className=" space-y-3 ">
									<label className="font-semibold">
										الدفعة المقدمة المتوقعة
									</label>
									<input
										type="number"
										placeholder=" 0 جنيه مصري"
										{...register("DownPayment")}
										className={buttonClass}
									/>
								</div>
								{customerInfo.customerInterestedProduct &&
									customerInfo.customerInterestedProduct.downPaymentRate && (
										<div className=" space-y-3  col-span-2">
											<label className="font-bold">
												نسبة الدفعة المقدمة المتوقعة
											</label>
											<div className={buttonClass}>
												{Number(
													customerInfo.customerInterestedProduct.downPaymentRate
												)}
												%
											</div>
										</div>
									)}
							</div>
						</div>
						{/* customer info */}
						<div className="px-12 py-8 space-y-5 bg-white rounded-3xl shadow-sm">
							{/* Name Inputs */}
							<p className=" font-bold text-[#EDAA00] mb-5 text-xl">
								بيانات العميل
							</p>
							{/* customer name */}
							<div className=" w-full col-span-2 space-y-3">
								<label htmlFor="Idno" className="font-semibold">
									رقم البطاقة القومي
								</label>
								<input
									type="string"
									placeholder="الرقم القومي"
									{...register("Idno", { required: false })}
									className={buttonClass}
									disabled={true}
								/>
							</div>
							<div>
								<p className=" font-semibold mb-4">إسم العميل</p>
								<div className="w-full grid grid-cols-2 lg:grid-cols-4 items-center gap-6">
									<input
										type="string"
										placeholder="الإسم الاول"
										{...register("FirstName", { required: true })}
										className={buttonClass}
									/>
									<input
										type="string"
										placeholder="الإسم الثاني"
										{...register("SecondName", { required: true })}
										className={buttonClass}
									/>
									<input
										type="string"
										placeholder="الإسم الثالث"
										{...register("ThirdName", { required: true })}
										className={buttonClass}
									/>
									<input
										type="string"
										placeholder="الإسم الرابع"
										{...register("LastName", { required: true })}
										className={buttonClass}
									/>
								</div>
							</div>
							{/* date of birth & gender */}
							<div className="grid grid-cols-2 gap-x-6">
								<div className=" w-full  space-y-3 ">
									<label className="font-semibold">الجنس</label>
									<div className={buttonClass}>
										{customerInfo.customerAdditionalData.genderStr === "Male"
											? "ذكر"
											: "أنثي"}
									</div>
								</div>
								<div className=" w-full space-y-3">
									<label className="font-semibold">تاريخ الميلاد</label>
									<div className={buttonClass}>{formatedBirthDate}</div>
								</div>
							</div>
							{/* Address  */}
							<div className="grid gap-x-6 gap-y-5  ">
								<div className=" w-full  space-y-3">
									<label className="font-semibold">العنوان</label>
									<input
										type="string"
										placeholder="عنوان العميل"
										{...register("Address", { required: false })}
										className={buttonClass}
									/>
								</div>
								<div className=" w-full  space-y-3">
									<label
										htmlFor="InvestigationAddress"
										className="font-semibold"
									>
										عنوان الإستعلام
									</label>
									<input
										type="string"
										placeholder="عنوان الإستعلام"
										{...register("InvestigationAddress", { required: false })}
										className={buttonClass}
									/>
								</div>
							</div>
							{/* Email & phone */}
							<div className="grid grid-cols-3 gap-x-6">
								<div className=" w-full space-y-3">
									<label htmlFor="Email" className="font-semibold">
										الايميل
									</label>
									<input
										type="string"
										placeholder="الايميل الشخصي"
										{...register("Email", {
											pattern: /\S+@\S+\.\S+/,
										})}
										className={buttonClass}
									/>
									{errors.Email?.type === "pattern" && (
										<p className="text-red-400 font-semibold">
											يرجي ادخال إيميل صحيح
										</p>
									)}
								</div>
								{/* Phone */}
								<div className=" w-full space-y-3">
									<label htmlFor="PhoneNumber" className="font-semibold">
										رقم هاتف محمول
									</label>
									<input
										type="number"
										placeholder="01146390954"
										{...register("PhoneNumber", {
											pattern: /^01[0125][0-9]{8}$/gm,
										})}
										className={buttonClass}
									/>
									{errors.PhoneNumber?.type === "pattern" && (
										<p className="text-red-400 font-semibold">
											يرجي ادخال رقم هاتف صحيح
										</p>
									)}
								</div>
								<div className=" w-full space-y-3 ">
									<label htmlFor="SecPhoneNumber" className="font-semibold">
										رقم هاتف محمول أخر
									</label>
									<input
										type="number"
										placeholder="01546390954"
										{...register("SecPhoneNumber", {
											pattern: /^01[0125][0-9]{8}$/gm,
										})}
										className={buttonClass}
									/>
								</div>
							</div>
							{/* job & salary */}
							<div className="grid grid-cols-3 gap-x-6">
								<div className=" w-full space-y-3">
									<label htmlFor="JobTitle" className="font-semibold">
										المسمي الوظيفى
									</label>
									<input
										type="string"
										placeholder="لقب العمل"
										{...register("JobTitle")}
										className={buttonClass}
									/>
								</div>

								<div className=" w-full space-y-3">
									<label htmlFor="yearsInBusiness" className="font-semibold">
										سنوات العمل
									</label>
									<input
										type="number"
										placeholder="عدد سنوات العمل"
										{...register("yearsInBusiness")}
										className={buttonClass}
									/>
								</div>
								<div className=" w-full space-y-3">
									<label htmlFor="Income" className="font-semibold">
										الدخل الشهري
									</label>
									<input
										type="number"
										placeholder="0"
										{...register("Income")}
										className={classNames(buttonClass)}
									/>
								</div>
							</div>
						</div>
						<div className="px-12">
							<h5 className="my-3 font-bold text-2xl">المستندات</h5>
							<div className="grid grid-cols-3  gap-6">
								{customerDocs &&
									customerDocs.map((doc, index) => {
										return (
											<FileReplacer
												key={index++}
												doc={doc}
												EntityType={1}
												EntityID={customerId}
												fileName={doc.documentDescription}
											/>
										);
									})}
							</div>
						</div>
						<div className=" flex justify-end px-12">
							<button
								type="submit"
								disabled={succes}
								className={classNames(
									" font-semibold rounded-full bg-[#343434]   text-white flex rtl:flex-row-reverse border-0  justify-center items-center  py-6  px-20  group hover:bg-[#EDAA00]  transition-all duration-200",
									succes && "bg-[#EDAA00] color"
								)}
							>
								<span className="group-hover:text-primary">تحديث البيانات</span>
							</button>
						</div>
					</form>
				</div>
			)}
		</DashboardLayout>
	);
};

export default PendingCustomer;

const ViewEye = (
	<svg
		width="32"
		height="32"
		viewBox="0 0 24 25"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M1.33497 13.6232C0.888345 12.8453 0.888342 11.8892 1.33497 11.1113C3.68496 7.01816 7.44378 4.36719 11.6798 4.36719C15.9158 4.36719 19.6746 7.01812 22.0246 11.1112C22.4712 11.8891 22.4712 12.8453 22.0246 13.6232C19.6746 17.7163 15.9158 20.3672 11.6798 20.3672C7.44377 20.3672 3.68497 17.7163 1.33497 13.6232Z"
			stroke="#999999"
			strokeWidth="2"
		/>
		<circle cx="11.6797" cy="12.3672" r="3" stroke="#999999" strokeWidth="2" />
	</svg>
);
const FileUploadIcon = (
	<svg
		width="56"
		height="57"
		viewBox="0 0 56 57"
		className="mb-4"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M41.6735 9.34839H33.4334C31.3817 9.36249 29.4332 8.45058 28.1305 6.86657L25.4174 3.11725C24.1371 1.51815 22.1886 0.600854 20.1396 0.632635H14.3158C3.85824 0.632635 2.62432e-06 6.76584 2.62432e-06 17.1968V28.4671C-0.0139968 29.7066 55.9865 29.7066 55.9893 28.4671V25.1934C56.0397 14.7625 52.2795 9.35119 41.6735 9.35119V9.34839Z"
			fill="#A0A3BD"
		/>
		<path
			opacity="0.1"
			fillRule="evenodd"
			clipRule="evenodd"
			d="M41.6735 9.34839H33.4334C31.3817 9.36249 29.4332 8.45058 28.1305 6.86657L25.4174 3.11725C24.1371 1.51815 22.1886 0.600854 20.1396 0.632635H14.3158C3.85824 0.632635 2.62432e-06 6.76584 2.62432e-06 17.1968V28.4671C-0.0139968 29.7066 55.9865 29.7066 55.9893 28.4671V25.1934C56.0397 14.7625 52.2795 9.35119 41.6735 9.35119V9.34839Z"
			fill="black"
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M52.7274 13.0363C53.6234 14.0856 54.315 15.2887 54.7714 16.5898C55.6617 19.2591 56.0733 22.0654 55.9893 24.8802V39.5781C55.9856 40.816 55.8939 42.0521 55.7149 43.277C55.3746 45.4397 54.6136 47.5148 53.475 49.3851C52.9512 50.2887 52.3152 51.1225 51.5823 51.8669C48.2623 54.9111 43.8578 56.4948 39.358 56.2625H16.6061C12.0994 56.4942 7.68762 54.9121 4.35662 51.8697C3.63237 51.123 3.00494 50.2882 2.4891 49.3851C1.35743 47.5161 0.612872 45.439 0.299588 43.277C0.100117 42.0551 -7.2115e-05 40.819 3.89446e-08 39.5809V24.883C3.89446e-08 23.6547 0.0671973 22.4292 0.198792 21.2093C0.226791 20.9938 0.268789 20.784 0.310787 20.5769C0.380784 20.2272 0.450782 19.8858 0.450782 19.5444C0.702771 18.0727 1.16195 16.6429 1.81713 15.2999C3.76025 11.1533 7.74168 9.04357 14.2654 9.04357H41.6483C45.3021 8.76098 48.928 9.86059 51.8063 12.1214C52.1395 12.4012 52.4475 12.7089 52.7302 13.0391L52.7274 13.0363ZM13.9154 38.5184H42.1466C42.7644 38.5448 43.3672 38.3236 43.821 37.9037C44.2747 37.4839 44.5418 36.9003 44.5629 36.2828C44.5975 35.7406 44.4187 35.2064 44.0645 34.7942C43.6571 34.2388 43.0121 33.9072 42.323 33.8989H13.9154C13.0704 33.8695 12.2768 34.3032 11.8456 35.0299C11.4144 35.7566 11.4144 36.6606 11.8456 37.3873C12.2768 38.1141 13.0704 38.5477 13.9154 38.5184Z"
			fill="#A0A3BD"
		/>
	</svg>
);
