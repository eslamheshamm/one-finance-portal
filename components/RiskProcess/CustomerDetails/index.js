import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import moment from "moment";

import { CustomDropDown } from "../../Atomics/CustomDropDown";
import apiClient from "../../../services/apiClient";
import { FileUploader } from "../../Atomics/Files/FileUploader";

const segmentationList = [
	{ name: "Prestige", value: 1 },
	{ name: "Elite", value: 2 },
	{ name: "Select Plus", value: 3 },
	{ name: "Select", value: 4 },
];
const pricingList = [
	{ name: "A", value: 1 },
	{ name: "B", value: 2 },
	{ name: "C", value: 3 },
	{ name: "D", value: 4 },
];

export const CustomerDetails = ({
	customerInfo,
	customerDocs,
	disableAction,
}) => {
	const router = useRouter();
	const { data: session } = useSession();
	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
		setValue,
	} = useForm({
		defaultValues: {
			exposureLimit: null,
			cgfLimit: null,
			cgfRate: null,
			dpr: null,
			dprAmount: null,
			iScore: null,
			assumedIncome: null,
		},
	});

	const [pricing, setPricing] = useState({ name: "لا يوجد", value: 0 });
	const [segmentation, setSegmentation] = useState({
		name: "لا يوجد",
		value: 0,
	});
	//  refuse reasons
	const [reasons, setReasons] = useState([
		{
			id: 300,
			name: "الاستعلام الإئتماني غير مرضي",
		},
		{
			id: 301,
			name: "العبء الإئتماني لا يسمح",
		},
		{
			id: 302,
			name: "المنطقة محظورة",
		},
		{
			id: 303,
			name: "الوظيفة محظورة",
		},
		{
			id: 304,
			name: "تزوير في الأوراق",
		},
		{
			id: 305,
			name: "قوائم سلبية",
		},
		{
			id: 306,
			name: "الاستعلام الميداني غير مطابق",
		},
		{
			id: 307,
			name: "أخرى",
		},
	]);
	const [refuseReason, setRefuseReason] = useState({
		id: 300,
		name: "الاستعلام الإئتماني غير مرضي",
	});
	// files urls
	const [iscoreUrl, setIscoreUrl] = useState("");
	const [homeVisitUrl, setHomeVisitUrl] = useState("");
	const [workVisitUrl, setWorkVisitUrl] = useState("");

	// watch statue
	const watchReasons = watch("statue");

	const AcceptOrSaveCustomer = (data) => {
		const loading = toast.loading(
			watchReasons === "save" ? "جاري حفظ العميل.." : "جاري قبول العميل.."
		);
		apiClient
			.post("/api/Customer/ApproveCustomer", {
				customerID: customerInfo.customerID,
				comment: data.notes,
				isSaving: watchReasons === "save" ? true : false,
				calculation: {
					iScoreScore: data.iScoreScore,
					iScoreFileUrl: `"${iscoreUrl}"`,
					homeVisitFileUrl: `"${homeVisitUrl}"`,
					workVisitFileUrl: `"${workVisitUrl}"`,
					comment: data.notes,
					assumedIncome: data.assumedIncome,
					creditCard: data.creditCard,
					personalLoan: data.personalLoan,
					autoLoan: data.autoLoan,
					overDraft: data.overDraft,
				},
			})
			.then((res) => {
				toast.dismiss(loading);
				if (res.data.isSuccess) {
					toast.success(
						watchReasons === "save"
							? "تم حفظ العميل بنجاح."
							: "تم قبول العميل بنجاح."
					);
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
	const RequestForEdit = (data) => {
		const loader = toast.loading("جاري إرسال طلب التعديل.");
		apiClient
			.post("/api/Customer/SetCustomerAsPending", {
				id: customerInfo.customerID,
				comment: data.notes,
			})
			.then((res) => {
				if (res.data.isSuccess) {
					toast.dismiss(loader);
					toast.success("لقد تم إرسال طلب تعديلك بنجاح.");
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
	const RejectCustomer = (data) => {
		const loading = toast.loading("جاري رفض العميل..");
		apiClient
			.post("/api/Customer/RejectCustomer", {
				customerID: customerInfo.customerID,
				comment: data.notes,
				rejectionReason: refuseReason.id,
			})
			.then((res) => {
				toast.dismiss(loading);
				if (res.data.message === "customer already rejected") {
					toast.error("هذا العميل تم رفضه بالفعل.");
					return true;
				}
				if (res.data.isSuccess) {
					toast.success("تم رفض العميل.");
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
	// form
	const onSubmit = (data) => {
		if (watchReasons === "accept" || watchReasons === "save") {
			AcceptOrSaveCustomer(data);
		}
		if (watchReasons === "refuse") {
			RejectCustomer(data);
		}
		if (watchReasons === "requestForEdit") {
			RequestForEdit(data);
		}
	};
	console.log(customerInfo);
	useEffect(() => {
		if (customerInfo && customerInfo.customerCalculation) {
			setValue("iScore", customerInfo.customerCalculation.iScoreScore);
			setValue("assumedIncome", customerInfo.customerCalculation.assumedIncome);
		}
	}, [customerInfo]);
	if (!customerInfo) {
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

	const buttonClass = `p-6 placeholder-[#9099A9] rounded-full  bg-[#DADADA36] bg-opacity-20   focus:outline-2 focus:ring-0 focus:border-0 focus:outline-[#EDAA00] block w-full border-0`;
	moment.locale("en");
	const formatedBirthDate =
		(customerInfo.dateOfBirth &&
			moment(customerInfo.dateOfBirth).format("YYYY-MM-DD")) ||
		"";
	return (
		<section className="w-full px-12">
			{customerDocs && (
				<div className="mb-8">
					<div className="flex flex-col items-start">
						<h2 className="mb-4 text-2xl font-bold ">مستندات العميل </h2>
						<div className="grid grid-cols-3 gap-6">
							{customerDocs &&
								customerDocs.map((doc, index) => {
									if (doc.url) {
										return (
											<div key={index++} className="ml-6 ">
												<h5 className=" mb-6">{doc.documentDescription}</h5>
												<a
													href={doc.url}
													download={doc.documentDescription}
													target="_blank"
													rel="noopener noreferrer"
												>
													<button className=" relative py-5 px-8 text-[#9099A9] font-semibold   rounded-xl border border-dashed border-[#999999] flex items-center">
														{FolderNameIcon}
														<span className="mr-3">
															{doc.documentDescription}
														</span>
														<div className=" absolute -top-4 -right-4 bg-white p-2 border border-[#9099A9] rounded-full">
															{ViewEye}
														</div>
													</button>
												</a>
											</div>
										);
									}
								})}
						</div>
					</div>
				</div>
			)}

			{/* customer info  */}
			{customerInfo && (
				<div className="mb-12">
					<h2 className="mb-6 text-2xl font-bold ">معلومات العميل </h2>
					<div className="">
						<div className="flex items-center mb-3">
							<div className="ml-4  rounded-full  flex justify-center items-center">
								{Person}
							</div>
							<p className="font-bold">{`${customerInfo.firstName || ""} ${
								customerInfo.secondName || ""
							} ${customerInfo.middileName} ${customerInfo.lastName || ""}`}</p>
						</div>
						{customerInfo.branchName && (
							<div>
								<p className=" rounded-full  font-bold my-6">
									الفرع: {customerInfo.branchName}
								</p>
							</div>
						)}
					</div>
					<div className="grid grid-cols-2 gap-x-8 gap-y-6 w-10/12">
						{customerInfo.nationalID && (
							<div>
								<h5 className="my-3 font-medium">الرقم القومي</h5>
								<p className=" rounded-full px-10 p-5 bg-[#DADADA36]    ">
									{customerInfo.nationalID}
								</p>
							</div>
						)}
						{customerInfo.gender && (
							<div>
								<h5 className="my-3 font-medium">الجنس</h5>
								<p className=" rounded-full px-10 p-5 bg-[#DADADA36]">
									{customerInfo.gender === "Male" ? "ذكر" : "أنثي"}
								</p>
							</div>
						)}
						{customerInfo.dateOfBirth && (
							<div>
								<h5 className="my-3 font-medium">تاريخ الميلاد</h5>
								<p className=" rounded-full px-10 p-5 bg-[#DADADA36]">
									{formatedBirthDate}
								</p>
							</div>
						)}
						{customerInfo.primaryPhone && (
							<div>
								<h5 className="my-3 font-medium">رقم الهاتف</h5>
								<p className=" rounded-full px-10 p-5 bg-[#DADADA36]">
									{customerInfo.primaryPhone}
								</p>
							</div>
						)}
						{customerInfo.anotherPhone && (
							<div>
								<h5 className="my-3 font-medium">الثاني رقم الهاتف</h5>
								<p className=" rounded-full px-10 p-5 bg-[#DADADA36]">
									{customerInfo.anotherPhone}
								</p>
							</div>
						)}

						{customerInfo.homeAddress && (
							<div>
								<h5 className="my-3 font-medium">العنوان</h5>
								<p className=" rounded-full px-10 p-5 bg-[#DADADA36]">
									{customerInfo.homeAddress}
								</p>
							</div>
						)}
						{customerInfo.inquireAddress && (
							<div>
								<h5 className="my-3 font-medium">عنوان الإستعلام</h5>
								<p className=" rounded-full px-10 p-5 bg-[#DADADA36]">
									{customerInfo.inquireAddress}
								</p>
							</div>
						)}
						{customerInfo.email && (
							<div>
								<h5 className="my-3 font-medium">الايميل</h5>
								<p className=" rounded-full px-10 p-5 bg-[#DADADA36]">
									{customerInfo.email}
								</p>
							</div>
						)}
						{customerInfo.buesinessDescription && (
							<div>
								<h5 className="my-3 font-medium">المسمي الوظيفي</h5>
								<p className=" rounded-full px-10 p-5 bg-[#DADADA36]">
									{customerInfo.buesinessDescription}
								</p>
							</div>
						)}
						{customerInfo.yearsInBusiness && (
							<div>
								<h5 className="my-3 font-medium">عدد سنوات العمل</h5>
								<p className=" rounded-full px-10 p-5 bg-[#DADADA36]">
									{customerInfo.yearsInBusiness}
								</p>
							</div>
						)}

						{customerInfo.businessName && (
							<div>
								<h5 className="my-3 font-medium">إسم جهة العمل</h5>
								<p className=" rounded-full px-10 p-5 bg-[#DADADA36]">
									{customerInfo.businessName}
								</p>
							</div>
						)}
						{customerInfo.businessAddress && (
							<div>
								<h5 className="my-3 font-medium">عنوان جهة العمل</h5>
								<p className=" rounded-full px-10 p-5 bg-[#DADADA36]">
									{customerInfo.businessAddress}
								</p>
							</div>
						)}
						{customerInfo.monthlyIncome && (
							<div>
								<h5 className="my-3 font-medium">الدخل الشهري</h5>
								<p className=" rounded-full px-10 p-5 bg-[#DADADA36]">
									{customerInfo.monthlyIncome}
								</p>
							</div>
						)}
					</div>
				</div>
			)}

			{/* <div className="flex flex-col items-start ">
					<div className="w-full">
						<h2 className="mb-6 text-2xl font-bold">معلومات المنتج المتوقع</h2>
						<div className="grid grid-cols-2 gap-x-8 gap-y-6 w-10/12 mb-12">
							<div className=" w-full">
								<h5 className="my-3 ">المنتج</h5>
								<p className=" rounded-full px-10 p-5 bg-[#DADADA36]">
									{customerInfo.customerInterestedProduct.productName}
								</p>
							</div>
							<div className=" w-full">
								<h5 className="my-3 ">قيمة التمويل</h5>
								<p className=" rounded-full px-10 p-5 bg-[#DADADA36]    ">
									{customerInfo.customerInterestedProduct.amount}
								</p>
							</div>
							<div className=" w-full">
								<h5 className="my-3 ">الدفعة المقدمة</h5>
								<p className=" rounded-full px-10 p-5 bg-[#DADADA36]    ">
									{customerInfo.customerInterestedProduct.downPayment}
								</p>
							</div>
							<div className=" w-full">
								<h5 className="my-3 ">السعر الإجمالي</h5>
								<p className=" rounded-full px-10 p-5 bg-[#DADADA36]    ">
									{`${
										Number(customerInfo.customerInterestedProduct.amount) +
										Number(customerInfo.customerInterestedProduct.downPayment)
									}`}
								</p>
							</div>
							<div className=" w-full">
								<h5 className="my-3 ">نسبة الدفعة المقدمة</h5>
								<p className=" rounded-full px-10 p-5 bg-[#DADADA36]    ">
									{customerInfo.customerInterestedProduct.downPaymentRate}
								</p>
							</div>
						</div>
					</div>
				</div>
				 */}
			{customerInfo.customerCalculation && (
				<div className="flex flex-col items-start ">
					<div className="w-full">
						<h2 className="mb-6 text-2xl font-bold">نتيجة التقييم</h2>
						<div className="grid grid-cols-2 gap-x-8 gap-y-6 w-10/12 mb-12">
							<div className=" w-full">
								<h5 className="my-3 "> تقييم الIscore</h5>
								<p className=" rounded-full px-10 p-5 bg-[#DADADA36]">
									{customerInfo.customerCalculation.iScoreScore}
								</p>
							</div>
							<div className=" w-full">
								<h5 className="my-3 "> دخل العميل المفترض</h5>
								<p className=" rounded-full px-10 p-5 bg-[#DADADA36]    ">
									{customerInfo.customerCalculation.assumedIncome}
								</p>
							</div>
							<div className=" flex  min-w-full gap-6">
								{customerInfo.customerCalculation.iScoreFileUrl && (
									<div className=" flex-shrink-0">
										<a
											href={customerInfo.customerCalculation.iScoreFileUrl}
											download={customerInfo.customerCalculation.iScoreFileUrl}
											target="_blank"
											rel="noopener noreferrer"
											className="w-full"
										>
											<button className=" relative py-5 px-8 text-[#9099A9] font-semibold   rounded-xl border border-dashed border-[#999999] flex items-center w-full">
												{FolderNameIcon}
												<span className="mr-4">
													{customerInfo.customerCalculation.iScoreFileUrl &&
														"Iscore"}
												</span>
												<div className=" absolute -top-4 -right-4 bg-white p-2 border border-[#9099A9] rounded-full">
													{ViewEye}
												</div>
											</button>
										</a>
									</div>
								)}
								{customerInfo.customerCalculation.homeVisitFileUrl && (
									<div className=" flex-shrink-0">
										<a
											href={customerInfo.customerCalculation.homeVisitFileUrl}
											download={
												customerInfo.customerCalculation.homeVisitFileUrl
											}
											target="_blank"
											rel="noopener noreferrer"
										>
											<button className=" relative py-5 px-8 text-[#9099A9] font-semibold   rounded-xl border border-dashed border-[#999999] flex items-center">
												{FolderNameIcon}
												<span className="mr-4">
													{customerInfo.customerCalculation.homeVisitFileUrl &&
														"زيارة العمل"}
												</span>
												<div className=" absolute -top-4 -right-4 bg-white p-2 border border-[#9099A9] rounded-full">
													{ViewEye}
												</div>
											</button>
										</a>
									</div>
								)}

								{customerInfo.customerCalculation.workVisitFileUrl && (
									<div className="flex-shrink-0">
										<a
											href={customerInfo.customerCalculation.workVisitFileUrl}
											download={
												customerInfo.customerCalculation.workVisitFileUrl
											}
											target="_blank"
											rel="noopener noreferrer"
										>
											<button className=" relative py-5 px-8 text-[#9099A9] font-semibold   rounded-xl border border-dashed border-[#999999] flex items-center">
												{FolderNameIcon}
												<span className="mr-4">
													{customerInfo.customerCalculation.workVisitFileUrl &&
														"زيارة المنزل"}
												</span>
												<div className=" absolute -top-4 -right-4 bg-white p-2 border border-[#9099A9] rounded-full">
													{ViewEye}
												</div>
											</button>
										</a>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			)}
			{/* customerScoring */}
			{/* {customerInfo && customerInfo.customerScoring && (
				<div className="mb-12">
					<h2 className="mb-6 text-2xl font-bold">شريحة العميل </h2>
					<div className="grid grid-cols-2 gap-x-8 gap-y-6 w-10/12">
						<div>
							<h5 className="my-3 font-medium">حد التمويل</h5>
							<p className=" rounded-full px-10 p-5 bg-[#DADADA36]    ">
								{customerInfo.customerScoring.exposureLimit}
							</p>
						</div>
						<div>
							<h5 className="my-3 font-medium">DBR</h5>
							<p className=" rounded-full px-10 p-5 bg-[#DADADA36]">
								{customerInfo.customerScoring.dpr}
							</p>
						</div>
						<div>
							<h5 className="my-3 font-medium"> شريحة العميل</h5>
							<p className=" rounded-full px-10 p-5 bg-[#DADADA36]">
								{customerInfo.customerScoring.segmentation === 1 && "Prestige"}
								{customerInfo.customerScoring.segmentation === 2 && "Elite"}
								{customerInfo.customerScoring.segmentation === 3 &&
									"Select Plus"}
								{customerInfo.customerScoring.segmentation === 4 && "Select"}{" "}
							</p>
						</div>
						<div>
							<h5 className="my-3 font-medium">شريحة التسعير</h5>
							<p className=" rounded-full px-10 p-5 bg-[#DADADA36]">
								{customerInfo.customerScoring.pricing === 1 && "A"}
								{customerInfo.customerScoring.pricing === 2 && "B"}
								{customerInfo.customerScoring.pricing === 3 && "C"}
								{customerInfo.customerScoring.pricing === 4 && "D"}
							</p>
						</div>
						<div>
							<h5 className="my-3 font-medium">سعر فائدة السلعة المعمرة</h5>
							<p className=" rounded-full px-10 p-5 bg-[#DADADA36]">
								{customerInfo.customerScoring.cgfRate}
							</p>
						</div>
						<div>
							<p className="my-3 font-medium">حد السلعة المعمرة</p>
							<p className=" rounded-full px-10 p-5 bg-[#DADADA36]">
								{customerInfo.customerScoring.cgfLimit}
							</p>
						</div>
					</div>
				</div>
			)} */}

			{disableAction ? null : (
				<div className="">
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-10/12">
						{/* customer rate */}
						<div className=" border-t border-b py-8">
							<h2 className="mb-6 text-2xl font-bold ">بيانات التقييم </h2>
							<div className="grid grid-cols-2 gap-6">
								<div className=" w-full space-y-5">
									<label htmlFor="iScoreScore" className="font-semibold">
										تقييم الIscore
									</label>
									<input
										type="number"
										placeholder="0"
										{...register("iScoreScore")}
										className={buttonClass}
									/>
								</div>
								<div className=" w-full space-y-5">
									<label htmlFor="assumedIncome" className="font-semibold">
										دخل العميل المفترض
									</label>
									<input
										type="number"
										placeholder="0"
										{...register("assumedIncome")}
										className={buttonClass}
									/>
								</div>
								<div className=" w-full space-y-5">
									<label htmlFor="creditCard" className="font-semibold">
										Credit Card
									</label>
									<input
										type="number"
										placeholder="0"
										{...register("creditCard")}
										className={buttonClass}
									/>
								</div>
								<div className=" w-full space-y-5">
									<label htmlFor="personalLoan" className="font-semibold">
										Personal Loan
									</label>
									<input
										type="number"
										placeholder="0"
										{...register("personalLoan")}
										className={buttonClass}
									/>
								</div>
								<div className=" w-full space-y-5">
									<label htmlFor="autoLoan" className="font-semibold">
										Auto Loan
									</label>
									<input
										type="number"
										placeholder="0"
										{...register("autoLoan")}
										className={buttonClass}
									/>
								</div>
								<div className=" w-full space-y-5">
									<label htmlFor="overDraft" className="font-semibold">
										Over Draft
									</label>
									<input
										type="number"
										placeholder="0"
										{...register("overDraft")}
										className={buttonClass}
									/>
								</div>
							</div>
							<div className=" mt-6  ">
								<h2 className=" font-bold  mb-4 text-xl">مستندات التقييم</h2>
								<div className="flex items-center gap-8 w-full">
									{customerInfo.customerCalculation &&
									customerInfo.customerCalculation.iScoreFileUrl ? (
										<div className="">
											<p className="mt-3 mb-6">Iscore</p>
											<a
												href={customerInfo.customerCalculation.iScoreFileUrl}
												download={"Iscore"}
												target="_blank"
												rel="noopener noreferrer"
											>
												<div className=" relative py-5 px-8 text-[#9099A9] font-semibold   rounded-xl border border-dashed border-[#999999] flex items-center">
													{FolderNameIcon}
													<span className="mr-4">Iscore</span>
													<div className=" absolute -top-4 -right-4 bg-white p-2 border border-[#9099A9] rounded-full">
														{ViewEye}
													</div>
												</div>
											</a>
										</div>
									) : (
										<FileUploader
											fileName={"Iscore"}
											EntityID={customerInfo.customerID}
											EntityType={1}
											TypeID={312}
											setUrl={setIscoreUrl}
										/>
									)}

									{customerInfo.customerCalculation &&
									customerInfo.customerCalculation.homeVisitFileUrl ? (
										<div>
											<p className="mt-3 mb-6">إستعلام منزلي</p>
											<a
												href={customerInfo.customerCalculation.homeVisitFileUrl}
												download={"إستعلام منزلي"}
												target="_blank"
												rel="noopener noreferrer"
											>
												<div className=" relative py-5 px-8 text-[#9099A9] font-semibold   rounded-xl border border-dashed border-[#999999] flex items-center">
													{FolderNameIcon}
													<span className="mr-4">إستعلام منزلي</span>
													<div className=" absolute -top-4 -right-4 bg-white p-2 border border-[#9099A9] rounded-full">
														{ViewEye}
													</div>
												</div>
											</a>
										</div>
									) : (
										<FileUploader
											fileName={"إستعلام منزلي"}
											EntityID={customerInfo.customerID}
											EntityType={1}
											TypeID={313}
											setUrl={setHomeVisitUrl}
										/>
									)}
									{customerInfo.customerCalculation &&
									customerInfo.customerCalculation.workVisitFileUrl ? (
										<div>
											<p className="mt-3 mb-6">إستعلام عمل</p>
											<a
												href={customerInfo.customerCalculation.workVisitFileUrl}
												download={"إستعلام عمل"}
												target="_blank"
												rel="noopener noreferrer"
											>
												<div className=" relative py-5 px-8 text-[#9099A9] font-semibold   rounded-xl border border-dashed border-[#999999] flex items-center">
													{FolderNameIcon}
													<span className="mr-4">إستعلام عمل</span>
													<div className=" absolute -top-4 -right-4 bg-white p-2 border border-[#9099A9] rounded-full">
														{ViewEye}
													</div>
												</div>
											</a>
										</div>
									) : (
										<FileUploader
											fileName={"إستعلام عمل"}
											EntityID={customerInfo.customerID}
											EntityType={1}
											TypeID={314}
											setUrl={setWorkVisitUrl}
										/>
									)}
								</div>
							</div>
						</div>

						{/* actions */}
						<div className="w-full space-y-5">
							<h5 className="font-bold text-2xl ">ملاحظة</h5>
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
							<ul className="flex items-center px-6 py-4 bg-[#DADADA36] rounded-full space-x-4">
								<li className="relative ml-4">
									<input
										className="sr-only peer"
										type="radio"
										value="save"
										{...register("statue", { required: true })}
										id="save"
									/>
									<label
										className="flex py-4 px-16 bg-[#A0A3BD] text-white border-0 rounded-full cursor-pointer focus:outline-none hover:bg-[#EDAA00] peer-checked:ring-red-500 peer-checked:ring-0 peer-checked:border-transparent peer-checked:bg-[#EDAA00]"
										htmlFor="save"
									>
										حفظ
									</label>
								</li>
								<li className="relative  ">
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

								<li className="relative ">
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
										id="rejectionReasons"
										className="bg-[#DADADA36] border-0 text-gray-900 text-lg rounded-2xl focus:ring-[#EDAA00] focus:border-0 block w-full py-6 px-8 "
										{...register("refuseReasons", {
											required: watchReasons === "refuse" ? true : false,
										})}
									>
										{reasons.map((item, index) => {
											return (
												<option
													onChange={() => {
														setRefuseReason(item);
													}}
													key={index++}
													value={item.name}
												>
													{item.name}
												</option>
											);
										})}
									</select>
									<div className=" absolute top-6 left-6"> {ArrowIcon}</div>
								</div>
							</div>
						)}
						<div className="mt-10 flex justify-end w-full">
							<button
								disabled={
									watchReasons === "accept" &&
									(segmentation.value === 0 || pricing.value === 0)
								}
								type="submit"
								className=" font-semibold rounded-full  bg-[#343434]   text-white flex rtl:flex-row-reverse justify-center items-center  py-5  px-24  group hover:bg-[#EDAA00]  transition-all duration-200"
							>
								<span className="group-hover:text-primary">إرسال</span>
							</button>
						</div>
					</form>
				</div>
			)}
		</section>
	);
};
const Arrow = (
	<svg
		width="16"
		height="10"
		viewBox="0 0 16 10"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M14.9263 1.36816L7.9631 8.33134L0.999928 1.36816"
			stroke="#14142B"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

const Person = (
	<svg
		width="39"
		height="39"
		viewBox="0 0 39 39"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M36.5625 26.8125H27.4219L25.8375 26.2031H29.5011C30.1945 26.2031 30.8429 25.7638 31.0227 25.0935C31.2945 24.0801 30.5273 23.1562 29.5547 23.1562C29.0501 23.1562 28.6406 22.7467 28.6406 22.2422C28.6406 21.7376 29.0501 21.3281 29.5547 21.3281H31.3292C32.0233 21.3281 32.671 20.8888 32.8508 20.2185C33.1226 19.2051 32.3554 17.6719 31.3828 17.6719H31.0781C30.4048 17.6719 29.8594 17.1265 29.8594 16.4531C29.8594 15.7798 30.4048 15.2344 31.0781 15.2344H36.8136C37.5076 15.2344 38.1554 14.795 38.3352 14.1247C38.607 13.1113 37.8398 12.1875 36.8672 12.1875H35.9531C35.2798 12.1875 34.7344 11.6421 34.7344 10.9688C34.7344 10.2954 35.2798 9.75 35.9531 9.75H37.1719C38.298 9.75 39.1944 8.71833 38.9634 7.5532C38.791 6.68606 37.9763 6.09375 37.092 6.09375H30.7734C30.2689 6.09375 29.8594 5.68425 29.8594 5.17969C29.8594 4.67512 30.2689 4.26562 30.7734 4.26562H34.3761C35.0701 4.26562 35.7179 3.82627 35.8977 3.15595C36.1695 2.14256 35.4023 1.21875 34.4297 1.21875H6.45206C5.75799 1.21875 5.11022 1.65811 4.93045 2.32842C4.65867 3.34181 5.42588 4.26562 6.39844 4.26562C7.23998 4.26562 7.92188 4.94752 7.92188 5.78906C7.92188 6.63061 7.23998 7.3125 6.39844 7.3125H5.84269H4.26563C3.26016 7.3125 2.4375 8.13516 2.4375 9.14062C2.4375 10.1461 3.26016 10.9688 4.26563 10.9688H15.8438C16.0583 10.9688 16.2612 10.9243 16.4531 10.856V17.6719H11.9364C11.2424 17.6719 10.5946 18.7206 10.4148 19.3909C10.2814 19.8888 10.4002 20.3629 10.6695 20.7188H1.52344C0.681891 20.7188 0 21.4006 0 22.2422C0 23.0837 0.681891 23.7656 1.52344 23.7656H2.13281C2.97436 23.7656 3.65625 24.4475 3.65625 25.2891C3.65625 26.1306 2.97436 26.8125 2.13281 26.8125H1.82813C0.818391 26.8125 0 27.6309 0 28.6406C0 29.6504 0.818391 30.4688 1.82813 30.4688H5.78906C6.63061 30.4688 7.3125 31.1506 7.3125 31.9922C7.3125 32.8337 6.63061 33.5156 5.78906 33.5156H4.875C3.86527 33.5156 3.04688 34.334 3.04688 35.3438C3.04688 36.3535 3.86527 37.1719 4.875 37.1719H34.125C35.1347 37.1719 35.9531 36.3535 35.9531 35.3438C35.9531 34.334 35.1347 33.5156 34.125 33.5156H33.8203C32.9788 33.5156 32.2969 32.8337 32.2969 31.9922C32.2969 31.1506 32.9788 30.4688 33.8203 30.4688H36.5625C37.5722 30.4688 38.3906 29.6504 38.3906 28.6406C38.3906 27.6309 37.5722 26.8125 36.5625 26.8125ZM16.4531 22.5938L13.1625 21.3281H16.4531V22.5938Z"
			fill="url(#paint0_radial_1803_30948)"
		/>
		<path
			d="M20.4141 6.09375C16.7777 6.09375 13.2903 7.53829 10.719 10.1096C8.14767 12.6809 6.70313 16.1683 6.70312 19.8047C6.70313 23.4411 8.14767 26.9285 10.719 29.4998C13.2903 32.0711 16.7777 33.5156 20.4141 33.5156C24.0504 33.5156 27.5379 32.0711 30.1092 29.4998C32.6805 26.9285 34.125 23.4411 34.125 19.8047C34.125 16.1683 32.6805 12.6809 30.1092 10.1096C27.5379 7.53829 24.0504 6.09375 20.4141 6.09375Z"
			fill="url(#paint1_linear_1803_30948)"
		/>
		<path
			d="M32.9062 4.26562H14.625C8.90358 4.26562 4.26562 8.90358 4.26562 14.625V24.0703C4.26562 26.258 6.03891 28.0312 8.22656 28.0312C10.4142 28.0312 12.1875 26.258 12.1875 24.0703V20.7188C12.1875 17.0168 15.1887 14.0156 18.8906 14.0156H28.0312C32.0696 14.0156 35.3438 10.7415 35.3438 6.70312C35.3438 5.35702 34.2524 4.26562 32.9062 4.26562Z"
			fill="url(#paint2_linear_1803_30948)"
		/>
		<path
			d="M32.9062 20.1094C32.9062 21.4567 31.8161 22.5469 30.4688 22.5469C29.1214 22.5469 28.0312 21.4567 28.0312 20.1094C28.0312 18.762 29.1214 17.6719 30.4688 17.6719C31.8161 17.6719 32.9062 18.762 32.9062 20.1094Z"
			fill="#717171"
		/>
		<path
			d="M31.6875 20.1094C31.6875 20.7821 31.1415 21.3281 30.4688 21.3281C29.796 21.3281 29.25 20.7821 29.25 20.1094C29.25 19.4366 29.796 18.8906 30.4688 18.8906C31.1415 18.8906 31.6875 19.4366 31.6875 20.1094Z"
			fill="#595859"
		/>
		<path
			d="M30.4688 19.1953C30.4688 19.6999 30.0592 20.1094 29.5547 20.1094C29.0501 20.1094 28.6406 19.6999 28.6406 19.1953C28.6406 18.6908 29.0501 18.2812 29.5547 18.2812C30.0592 18.2812 30.4688 18.6908 30.4688 19.1953Z"
			fill="#9E9E9E"
		/>
		<path
			d="M29.2559 20.0555C29.3503 20.0884 29.4496 20.1097 29.5551 20.1097C30.0596 20.1097 30.4691 19.7002 30.4691 19.1957C30.4691 19.0903 30.4478 18.9909 30.4149 18.8965C29.786 18.9245 29.2839 19.4266 29.2559 20.0555Z"
			fill="#8F8E8F"
		/>
		<path
			d="M24.375 20.1094C24.375 21.4567 23.2848 22.5469 21.9375 22.5469C20.5902 22.5469 19.5 21.4567 19.5 20.1094C19.5 18.762 20.5902 17.6719 21.9375 17.6719C23.2848 17.6719 24.375 18.762 24.375 20.1094Z"
			fill="#717171"
		/>
		<path
			d="M23.1562 20.1094C23.1562 20.7821 22.6102 21.3281 21.9375 21.3281C21.2648 21.3281 20.7188 20.7821 20.7188 20.1094C20.7188 19.4366 21.2648 18.8906 21.9375 18.8906C22.6102 18.8906 23.1562 19.4366 23.1562 20.1094Z"
			fill="#595859"
		/>
		<path
			d="M21.9375 19.1953C21.9375 19.6999 21.528 20.1094 21.0234 20.1094C20.5189 20.1094 20.1094 19.6999 20.1094 19.1953C20.1094 18.6908 20.5189 18.2812 21.0234 18.2812C21.528 18.2812 21.9375 18.6908 21.9375 19.1953Z"
			fill="#9E9E9E"
		/>
		<path
			d="M20.7246 20.0555C20.8191 20.0884 20.9184 20.1097 21.0238 20.1097C21.5284 20.1097 21.9379 19.7002 21.9379 19.1957C21.9379 19.0903 21.9165 18.9909 21.8836 18.8965C21.2548 18.9245 20.7526 19.4266 20.7246 20.0555Z"
			fill="#8F8E8F"
		/>
		<path
			d="M27.4219 24.9844H24.9844C24.6492 24.9844 24.375 25.2586 24.375 25.5938C24.375 26.6035 25.1934 27.4219 26.2031 27.4219C27.2129 27.4219 28.0312 26.6035 28.0312 25.5938C28.0312 25.2586 27.757 24.9844 27.4219 24.9844Z"
			fill="#717171"
		/>
		<defs>
			<radialGradient
				id="paint0_radial_1803_30948"
				cx="0"
				cy="0"
				r="1"
				gradientUnits="userSpaceOnUse"
				gradientTransform="translate(19.4226 21.6749) scale(30.6278)"
			>
				<stop stopColor="#AFEEFF" />
				<stop offset="0.193" stopColor="#BBF1FF" />
				<stop offset="0.703" stopColor="#D7F8FF" />
				<stop offset="1" stopColor="#E1FAFF" />
			</radialGradient>
			<linearGradient
				id="paint1_linear_1803_30948"
				x1="20.4141"
				y1="33.5156"
				x2="20.4141"
				y2="6.09375"
				gradientUnits="userSpaceOnUse"
			>
				<stop stopColor="#FFC662" />
				<stop offset="0.004" stopColor="#FFC662" />
				<stop offset="0.609" stopColor="#FFC582" />
				<stop offset="1" stopColor="#FFC491" />
			</linearGradient>
			<linearGradient
				id="paint2_linear_1803_30948"
				x1="19.8047"
				y1="4.26562"
				x2="19.8047"
				y2="28.0312"
				gradientUnits="userSpaceOnUse"
			>
				<stop stopColor="#FF8B67" />
				<stop offset="0.847" stopColor="#FFA76A" />
				<stop offset="1" stopColor="#FFAD6B" />
			</linearGradient>
		</defs>
	</svg>
);

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
