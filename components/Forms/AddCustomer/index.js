import classNames from "classnames";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import useIdnoInfo from "../../../hooks/useIdnoInfo";
import apiClient from "../../../services/apiClient";
import { FileReplacer } from "../../Atomics/Files/FileReplacer";
import { AddressDropDown } from "../../Atomics/Sales/AddressDropDown";
import { CarsDropDown } from "../../Atomics/Sales/CarsDropDown";
import { ClubsDropDown } from "../../Atomics/Sales/ClubsDropDown";
import { JobDropDown } from "../../Atomics/Sales/JobDropDown";
import { ProductsDropDown } from "../../Atomics/Sales/ProductDropDown";

const handleCalculateDownPaymentRate = (dp, la) => {
	return ((dp * 100) / (la + dp)).toFixed(2);
};

const AddCustomerForm = () => {
	const router = useRouter();
	const { data: session } = useSession();
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		getValues,
		watch,
	} = useForm({
		defaultValues: {
			LoanAmount: null,
			DownPayment: null,
			mobileNumber: null,
			mobileNumber2: null,
		},
		mode: "onBlur",
	});
	// states
	const [downPaymentRate, setDownPaymentRate] = useState(0);

	// product
	const [selectedCategoryProduct, setSelectedCategoryProduct] = useState({
		name: "يرجي الإختيار",
		id: -1,
		product: [],
	});
	const [selectedProduct, setSelectedProduct] = useState({
		name: "يرجي الإختيار",
		id: -1,
	});
	// customer
	const [customerId, setCustomerId] = useState(null);
	const [customerDocs, setCustomerDocs] = useState(null);
	// watch
	const idnoWatch = watch("nationalId");
	const watchLoanAmount = watch("LoanAmount");
	const downPaymentWatch = watch("DownPayment");
	// teeest
	const { dateOfBirth, gender } = useIdnoInfo(idnoWatch);

	const handleSaveCustomer = (data) => {
		console.log(data);
		const loading = toast.loading("جاري حفظ العميل..");
		apiClient
			.post("/api/Customer/SaveCustomer", {
				customerDTO: {
					firstName: data.FirstName,
					secondName: data.SecondName,
					middleName: data.ThirdName,
					lastName: data.LastName,
					nationalID: data.nationalId,
				},
				customerAdditionalDTO: {
					gender: gender.id,
					dateOfBirth: dateOfBirth,
					homeAddress: data.Address,
					primaryPhone: data.SecPhoneNumber,
					anotherPhone: data.SecPhoneNumber,
					email: data.Email,
					businessDescription: data.JobTitle,
					yearsInBusiness: Number(data.yearsInBusiness),
					monthlyIncome: Number(data.Income),
					inquireAddress: data.InvestigationAddress,
					businessName: data.businessName,
					businessAddress: data.businessAddress,
				},
				customerInterestedDTO: {
					productTypeID: Number(selectedCategoryProduct.id),
					productID: Number(selectedProduct.id),
					amount: Number(data.LoanAmount),
					downPayment: Number(data.DownPayment),
				},
			})
			.then(({ data }) => {
				toast.dismiss(loading);
				if (data.isSuccess) {
					toast.success("تم حفظ العميل بنجاح.");
					setCustomerId(data.customerID);
				}
			})
			.catch(() => {
				toast.dismiss(loading);
				toast.error("لقد حدث خطأ في الأنترنت.");
			});
	};
	// 29910012125319
	const handleSubmitCustomer = (e) => {
		e.preventDefault();
		const loading = toast.loading("جاري ارسال العميل ..");
		apiClient
			.post("api/Customer/SubmitCustomer", {
				customerID: customerId,
			})
			.then(({ data }) => {
				toast.dismiss(loading);
				if (data.isSuccess) {
					toast.success("تم إرسال العميل بنجاح.");
					setTimeout(() => {
						router.reload();
					}, 1000);
				}
			})
			.catch(() => {
				toast.dismiss(loading);
				toast.error("لقد حدث خطأ في الأنترنت.");
			});
	};
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
	const handlNationalIdSearch = () => {
		const loading = toast.loading("جاري البحث عن العميل..");
		const Idno = getValues("nationalId");
		apiClient
			.get("/api/Customer/GetCustomerDetailsByNationalID", {
				params: {
					NationalID: Idno,
				},
			})
			.then(({ data }) => {
				console.log(data, "datratatatata");
				toast.dismiss(loading);
				if (data.isSuccess) {
					toast.success("تم العثور على العميل.");
					const customer = data.data;
					setCustomerId(customer.customerID);
					setValue("FirstName", customer.firstName);
					setValue("SecondName", customer.secondName);
					setValue("ThirdName", customer.middileName);
					setValue("LastName", customer.lastName);
					setValue("Address", customer.homeAddress);
					setValue("InvestigationAddress", customer.inquireAddress);
					setValue("Email", customer.email);
					setValue("PhoneNumber", customer.primaryPhone);
					setValue("SecPhoneNumber", customer.anotherPhone);
					setValue("JobTitle", customer.buesinessDescription);
					setValue("yearsInBusiness", customer.yearsInBusiness);
					setValue("businessAddress", customer.businessAddress);
					setValue("businessName", customer.businessName);
					setValue("Income", customer.monthlyIncome);
					setValue("LoanAmount", customer.amount);
					setValue("DownPayment", customer.downPayment);
				}
			})
			.catch(() => {
				toast.dismiss(loading);
				toast.error("لقد حدث خطأ في الأنترنت.");
			});
	};

	useEffect(() => {
		if (watchLoanAmount > 0 && downPaymentWatch >= 0) {
			setDownPaymentRate(
				handleCalculateDownPaymentRate(
					Number(downPaymentWatch),
					Number(watchLoanAmount)
				)
			);
		}
	}, [watchLoanAmount, downPaymentWatch, setDownPaymentRate, downPaymentRate]);

	useEffect(() => {
		if (customerId) {
			GetCustomerDocs();
		}
	}, [customerId]);

	const buttonClass = `p-6 placeholder-[#9099A9] rounded-full  bg-[#DADADA36] bg-opacity-20   focus:outline-2 focus:outline-[#EDAA00] block w-full border-0  focus:ring-0 `;
	return (
		<section className="w-10/12 mx-auto ">
			<Toaster position="bottom-center" />
			<form
				onSubmit={handleSubmit(handleSaveCustomer)}
				className="space-y-6"
				autoComplete="off"
			>
				<div className=" rounded-[32px] py-8 px-12 bg-white shadow-sm">
					{/* National Id inputs */}
					<div className="w-full grid grid-cols-4 gap-6 items-end">
						<div className=" w-full space-y-3 col-span-3">
							<label htmlFor="nationalId" className="font-semibold">
								الرقم القومي
							</label>
							<div>
								<input
									type="number"
									placeholder="29945879254946"
									{...register("nationalId", {
										required: true,
										minLength: 14,
										maxLength: 14,
									})}
									className={buttonClass}
								/>
							</div>
						</div>
						<div>
							<div
								className={classNames(
									" cursor-pointer  rounded-full font-bold   flex justify-center items-center  p-6  w-full  text-black   bg-[#EDAA00]  transition-all duration-200",
									(errors.nationalId?.type === "minLength" ||
										errors.nationalId?.type === "maxLength" ||
										errors.nationalId?.type === "required") &&
										"bg-[#999999] text-[#14142B]"
								)}
								onClick={(e) => {
									e.preventDefault();
									handlNationalIdSearch(e);
								}}
								disabled={
									errors.nationalId?.type === "minLength" ||
									errors.nationalId?.type === "maxLength" ||
									errors.nationalId?.type === "required"
								}
							>
								<span className="ml-4 font-bold">بحث</span>
								{SearchIcon}
							</div>
						</div>
					</div>
					<p className="mt-2 text-red-400">
						{errors.nationalId?.type === "required" && "يرجي إدخال رقم قومي "}
					</p>
					<p className="mt-2 text-red-400">
						{(errors.nationalId?.type === "minLength" ||
							errors.nationalId?.type === "maxLength") &&
							"يرجي إدخال رقم قومي صحيح"}
					</p>
				</div>

				{/* customer info */}
				<div className="px-12 py-8 space-y-5 bg-white rounded-3xl shadow-sm">
					{/* Name Inputs */}
					<p className=" font-bold text-[#EDAA00] mb-5 text-xl">
						بيانات العميل
					</p>
					{/* customer name */}
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
								{gender ? gender.arabicName : "الرقم القومي غير صحيح"}
							</div>
						</div>
						<div className=" w-full space-y-3">
							<label className="font-semibold">تاريخ الميلاد</label>
							<div className={buttonClass}>
								{dateOfBirth ? dateOfBirth : "الرقم القومي غير صحيح"}
							</div>
						</div>
					</div>
					{/* Address  */}
					<div className="flex flex-col gap-5">
						<AddressDropDown />
						<div className=" w-full  col-span-2 space-y-3">
							<label className="font-semibold">العنوان</label>
							<input
								type="string"
								placeholder="عنوان العميل"
								{...register("Address", { required: false })}
								className={buttonClass}
							/>
						</div>
						<div className=" w-full col-span-2 space-y-3">
							<label htmlFor="InvestigationAddress" className="font-semibold">
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
					<div className="grid gap-6 ">
						<div className="grid grid-cols-3 gap-x-6">
							{/*  */}
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
								<label htmlFor="businessName" className="font-semibold">
									إسم جهة العمل
								</label>
								<input
									type="string"
									placeholder="إسم جهة العمل"
									{...register("businessName")}
									className={buttonClass}
								/>
							</div>
						</div>
						<div className="grid gap-6">
							<div className=" w-full space-y-3 ">
								<label htmlFor="businessAddress" className="font-semibold">
									عنوان جهة العمل
								</label>
								<input
									type="string"
									placeholder="عنوان جهة العمل"
									{...register("businessAddress")}
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
						{/*  */}
					</div>
				</div>
				<div className="mt-6">
					<div className=" mt-6 px-12 py-8 bg-white rounded-[32px] shadow-sm">
						<h2 className=" font-bold text-[#EDAA00] mb-4 text-xl">
							معلومات إضافية
						</h2>
						<div className="grid grid-cols-3 gap-5">
							<CarsDropDown />
							<div className=" w-full space-y-3">
								<label htmlFor="CarModelYear" className="font-semibold">
									سنة الصنع
								</label>
								<input
									type="string"
									placeholder="سنة الصنع"
									{...register("CarModelYear", { required: false })}
									className={buttonClass}
								/>
							</div>
						</div>
						<div className="grid grid-cols-3 gap-5">
							<JobDropDown />
							<ClubsDropDown />
						</div>
					</div>
				</div>
				<div className="w-full grid-cols-3">
					<button
						type="submit"
						className={classNames(
							" font-semibold rounded-full bg-[#343434]   text-white flex rtl:flex-row-reverse border-0  justify-center items-center  py-6 w-full   group hover:bg-[#EDAA00]  transition-all duration-200"
						)}
					>
						<div
							className={classNames(
								"text- w-6 h-6 rounded-full flex justify-center items-center bg-white mr-2 text-[#343434] group-hover:text-[#EDAA00] "
							)}
						>
							{Check}
						</div>
						<span className="group-hover:text-primary">حفظ العميل</span>
					</button>
				</div>
			</form>

			<div className="mt-6">
				<div className=" mt-6 px-12 py-8 bg-white rounded-[32px] shadow-sm">
					<h2 className=" font-bold text-[#EDAA00] mb-4 text-xl">
						مستندات العميل
					</h2>
					{!customerDocs && (
						<p className="text-2xl font-bold mt-8">يرجي حفظ العميل اولاً!</p>
					)}
					<div className="grid grid-cols-3  gap-6">
						{customerDocs &&
							customerDocs.map((doc, index) => {
								console.log(doc, "doccc");
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

				<div
					className="flex items-end  justify-center mt-6"
					onClick={(e) => handleSubmitCustomer(e)}
				>
					<button
						disabled={!customerDocs}
						className={classNames(
							" font-semibold rounded-full bg-[#343434]   text-white flex rtl:flex-row-reverse justify-center items-center py-5 px-20 group hover:bg-[#EDAA00]  transition-all duration-200 disabled:bg-[#999999] w-full group-hover:text-[#ed0000]"
						)}
					>
						{SendIcon}
						<span className="group-hover:text-primary">إرسال</span>
					</button>
				</div>
			</div>
		</section>
	);
};
export default AddCustomerForm;

const Check = (
	<svg
		width="11"
		height="9"
		viewBox="0 0 11 9"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M10 1L3.8125 7.75L1 4.68182"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);
const SearchIcon = (
	<svg
		width="25"
		height="24"
		viewBox="0 0 25 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M11.5 20C16.4706 20 20.5 15.9706 20.5 11C20.5 6.02944 16.4706 2 11.5 2C6.52944 2 2.5 6.02944 2.5 11C2.5 15.9706 6.52944 20 11.5 20Z"
			stroke="black"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M22.5 22L18.5 18"
			stroke="black"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);
const SendIcon = (
	<svg
		className="mr-4"
		width="25"
		height="25"
		viewBox="0 0 25 25"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M2.22669 12.827C1.39894 12.5087 1.36449 11.3503 2.17186 10.9833L20.9068 2.46743C21.748 2.08508 22.6133 2.95043 22.2309 3.7916L13.7151 22.5265C13.3481 23.3339 12.1897 23.2994 11.8714 22.4717L9.35183 15.9209C9.25026 15.6568 9.04156 15.4481 8.77746 15.3466L2.22669 12.827Z"
			stroke="#FCFCFC"
			strokeWidth="2"
		/>
	</svg>
);

// const handleUpdateCustomerDate = (data) => {
// 	const loading = toast.loading("جاري تحديث بيانات العميل..");
// 	apiClient
// 		.post("/api/Customer/UpdateCustomer", {
// 			customer: {
// 				id: customerId,
// 				firstName: data.FirstName,
// 				secondName: data.SecondName,
// 				thirdName: data.ThirdName,
// 				fourthName: data.LastName,
// 				idno: data.nationalId,
// 				officeJoiningDate: new Date(), //today date
// 				officeId: Number(session.user.officeId),
// 				officeName: "",
// 				updatedBy: Number(session.user.id),
// 				statues: null,
// 				sales: session.user.id,
// 				salesName: "",
// 			},
// 			extraData: {
// 				homeAddress: data.Address,
// 				mobileNumber: data.PhoneNumber,
// 				emailAddress: data.Email,
// 				buesinessDescription: data.JobTitle,
// 				yearsInBusiness: Number(data.yearsInBusiness),
// 				monthlyIncome: Number(data.Income),
// 				gender: gender.id,
// 				genderStr: "",
// 				dateOfBirth: dateOfBirth,
// 				educationLevelCd: 0,
// 				inquireAddress: data.InvestigationAddress,
// 				mobileNumber2: data.SecPhoneNumber,
// 			},
// 			interestedProduct: {
// 				productTypeId: Number(selectedCategoryProduct.categoryId),
// 				productTypeName: "",
// 				productId: Number(selectedProduct.id),
// 				productName: "",
// 				amount: Number(data.LoanAmount),
// 				downPayment: Number(data.DownPayment),
// 				insertedOnDate: new Date(),
// 				insertedOnUser: Number(session.user.id),
// 			},
// 		})
// 		.then(({ data }) => {
// 			toast.dismiss(loading);
// 			if (data.isSuccess) {
// 				toast.success("تم تحديث بيانات العميل بنجاح.");
// 			}
// 			if (!data.isSuccess) {
// 				toast.error("لقد حدث خطأ.");
// 			}
// 			return data;
// 		})
// 		.catch(() => {
// 			toast.dismiss(loading);
// 			toast.error("لقد حدث خطأ.");
// 		});
// };
