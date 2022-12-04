import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import classNames from "classnames";
import { useSession } from "next-auth/react";

import moment from "moment";
import DashboardLayout from "../../../../../src/Components/Layout";
import apiClient from "../../../../../src/Utils/Services/apiClient";
import { useQuery } from "@tanstack/react-query";
import { ClipLoader } from "react-spinners";

const PendingCustomer = () => {
	const { data: session } = useSession();
	const router = useRouter();
	const { id } = router.query;
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
	const [customerId, setCustomerId] = useState(null);

	const [succes, setSuccess] = useState(false);
	const [customerDocs, setCustomerDocs] = useState(null);
	const [customerInfo, setCustomerInfo] = useState(null);
	const [comment, setComment] = useState("");
	const { isLoading, isError, isSuccess, data } = useQuery(
		["CustomerDetailsById", id],
		async () => {
			const res = await apiClient.get("/api/Customer/GetCustomerDetailsByID", {
				params: { CustomerID: id },
			});
			return res;
		},
		{
			enabled: id !== undefined ? true : false,
		}
	);
	useEffect(() => {
		if (isSuccess) {
			const customer = data.data.data;
			console.log(customer);
			setCustomerId(customer.customerID);
			setValue("Idno", customer.nationalID);
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
		}
	}, [isSuccess]);
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
	// const GetCustomerData = () => {
	// 	const loading = toast.loading("جاري تحميل بيانات العميل ..");
	// 	apiClient
	// 		.get(`/api/Customer/GetCustomerDetailsByID=?${customerId}`)
	// 		.then((res) => {
	// 			toast.dismiss(loading);
	// 			if (res && res.data && res.data.isSuccess) {
	// 				toast.success("تم تحميل بيانات العميل.");
	// 				setCustomerInfo(res.data.customer);
	// 				setComment(res.data.customer.customerStatusDetails.comment);
	// 				const customer = res.data.customer;
	// 				// setCustomerId(customer.customerID);
	// 				setValue("FirstName", customer.firstName);
	// 				setValue("SecondName", customer.secondName);
	// 				setValue("ThirdName", customer.middileName);
	// 				setValue("LastName", customer.lastName);
	// 				setValue("Address", customer.homeAddress);
	// 				setValue("InvestigationAddress", customer.inquireAddress);
	// 				setValue("Email", customer.email);
	// 				setValue("PhoneNumber", customer.primaryPhone);
	// 				setValue("SecPhoneNumber", customer.anotherPhone);
	// 				setValue("JobTitle", customer.buesinessDescription);
	// 				setValue("yearsInBusiness", customer.yearsInBusiness);
	// 				setValue("businessAddress", customer.businessAddress);
	// 				setValue("businessName", customer.businessName);
	// 				setValue("Income", customer.monthlyIncome);
	// 			}
	// 		})
	// 		.catch(() => {
	// 			// toast.dismiss(loading);
	// 			// toast.error("لقد حدث خطأ.");
	// 		});
	// };
	const handleUpdateCustomer = (data) => {
		const loading = toast.loading("جاري حفظ العميل..");
		apiClient
			.post("/api/Customer/UpdateCustomer", {
				customerDTO: {
					firstName: data.FirstName,
					secondName: data.SecondName,
					middleName: data.ThirdName,
					lastName: data.LastName,
					nationalID: data.nationalId,
				},
				customerAdditionalDTO: {
					// gender: gender.id,
					dateOfBirth: dateOfBirth,
					homeAddress: data.Address,
					primaryPhone: data.PhoneNumber,
					anotherPhone: data.SecPhoneNumber,
					email: data.Email,
					businessDescription: data.JobTitle,
					yearsInBusiness: Number(data.yearsInBusiness),
					monthlyIncome: Number(data.Income),
					inquireAddress: data.InvestigationAddress,
					businessName: data.businessName,
					businessAddress: data.businessAddress,
				},
				customerQuestionnaireDTO: {
					sectorID: jobSector.sectorID,
					clubID: clubsList.clubID,
					ownershipHomeID: home.ownershipHomeID,
					ownershipResidencyTypeID: homeType.residencyTypeID,
					secondHomeID: secondHome.secondHomeID,
					secondResidencyTypeID: secondHomeType.residencyTypeID,
					govID: govList.govID,
					districtID: districtList.districtID,
					jobID: jobsList.jobID,
					modelYear: data.CarModelYear,
					vehicleModelID: carsModel.vehicleModelID,
					vehicleID: carsList.vehicleID,
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
	const formatedBirthDate = moment(data?.data?.data.dateOfBirth).format(
		"YYYY-MM-DD"
	);
	return (
		<DashboardLayout>
			<Toaster position="bottom-center" />
			{isError && (
				<div className="h-full flex justify-center items-center py-32">
					<h2 className="text-2xl">عذراً يوجد مشكلة في الانترنت!</h2>
				</div>
			)}
			{isLoading && (
				<div className="h-full flex justify-center items-center py-32">
					<ClipLoader
						color={"#F9CD09"}
						loading={isLoading}
						size={48}
						aria-label="Loading Spinner"
					/>
				</div>
			)}
			{isSuccess && (
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
										{data.data.data.gender === "Male" ? "ذكر" : "أنثي"}
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
						{/* <div className="px-12">
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
						</div> */}
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
