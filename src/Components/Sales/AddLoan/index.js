import classNames from "classnames";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { ProductsDropDown } from "../ProductDropDown";

// import { FileUploader } from "../../Atomics/Files/FileUploader";
// import { Loading } from "../../Atomics/Loading";

const AddLoanForm = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		getValues,
		watch,
	} = useForm();
	const { data: session } = useSession();
	const [customerId, setCustomerId] = useState(null);
	const [customerInfo, setCustomerData] = useState(null);

	const [selectedCategoryProduct, setSelectedCategoryProduct] = useState({
		categoryName: "يرجي الإختيار",
		categoryId: -1,
		product: [],
	});
	const [selectedProduct, setSelectedProduct] = useState({
		name: "يرجي الإختيار",
		id: -1,
	});

	const [requetedLoanDocs, setRequetedLoanDocs] = useState(null);
	const [loadingDocs, setLoadingDocs] = useState(false);
	const [loanInstallments, setLoanInstallments] = useState(0);
	const handleGetRequestedLoanDocs = () => {
		setLoadingDocs(true);
		apiClient
			.post(`/api/Loan/GetLoanRequestedDocumentTypeUpload`, {
				productId: selectedProduct.id,
			})
			.then((res) => {
				setLoadingDocs(false);
				if (res.data.isSuccess) {
					setRequetedLoanDocs(res.data.loanDownloadDocuments);
				}
			})
			.catch((err) => {
				console.log(err);
			})
			.finally(() => {
				setLoadingDocs(false);
			});
	};

	useEffect(() => {
		if (selectedProduct.id !== -1 && selectedProduct.id !== null) {
			handleGetRequestedLoanDocs();
		}
	}, [selectedProduct.id]);

	const handleSeachCustomer = () => {
		const loading = toast.loading("جاري البحث عن العميل..");
		const idno = getValues("nationalId");
		apiClient
			.post("/api/Customer/GetCustomerSearchResult", { idno: idno })
			.then(({ data }) => {
				toast.dismiss(loading);
				if (data.isSuccess) {
					toast.success("العميل موجود..");
					setCustomerId(data.customer.customer.id);
					setCustomerData(data.customer);
					console.log(data.customer);
				}
				if (!data.isSuccess) {
					toast.error("العميل غير موجود..");
				}
			})
			.catch(() => {
				toast.dismiss(loading);
				toast.error("حدث خطأ..");
			});
	};
	const onSubmit = (data) => {
		const loading = toast.loading("جاري إضافة التمويل..");
		apiClient
			.post("/api/Loan/CreateLoan", {
				id: 0,
				customerId: Number(customerId),
				sales: session.user.id,
				product: selectedProduct.id,
				amount: Number(data.LoanAmount),
				period: Number(data.LoanDuration),
				downPayment: Number(data.DownPayment),
			})
			.then((res) => {
				toast.dismiss(loading);
				if (res.data.code == 602) {
					toast.error("العميل يمتلك تمويل بالفعل..");
					return null;
				}
				if (res.data.isSuccess === true) {
					toast.success("تم إضافة التمويل..");
				}
			})
			.catch(() => {
				toast.dismiss(loading);
				toast.error("لقد حدث خطأ..");
			});
	};
	const requestDate = new Date();
	const watchLoanAmount = watch("LoanAmount");
	const watchLoanDuration = watch("LoanDuration");
	const watchDownPayment = watch("DownPayment");
	const handleCalcLoans = () => {
		const loading = toast.loading("جاري حسبة القسط..");
		apiClient
			.post("/api/Loan/Calculator", {
				customerId: customerId,
				pricingSegmentId: customerInfo,
				productId: Number(selectedProduct.id),
				downPayment: Number(watchDownPayment),
				amount: Number(watchLoanAmount),
				period: Number(watchLoanDuration),
				requestDate: requestDate,
			})
			.then((res) => {
				toast.dismiss(loading);
				if (res.data.isSuccess) {
					setLoanInstallments(res.data.installmentAmount);
				}
			})
			.catch(() => {
				toast.dismiss(loading);
				toast.error("حدث خطأ..");
			});
	};
	// useEffect(() => {
	// 	if (
	// 		(watchLoanAmount &&
	// 			watchLoanDuration > 0 &&
	// 			selectedProduct.interestRate) ||
	// 		watchDownPayment > 0
	// 	) {
	// 		const finalRepaymentAmount = calcLoans(
	// 			Number(watchLoanAmount),
	// 			Number(watchLoanDuration),
	// 			Number(selectedProduct.interestRate),
	// 			requestDate
	// 		);
	// 		setLoanInstallments(finalRepaymentAmount);
	// 	}
	// }, [
	// 	watchLoanAmount,
	// 	watchLoanDuration,
	// 	watchDownPayment,
	// 	selectedProduct,
	// 	setLoanInstallments,
	// 	loanInstallments,
	// ]);
	const buttonClass = `p-6 placeholder-[#9099A9] rounded-full  bg-[#DADADA36] bg-opacity-20   focus:outline-2 focus:outline-[#EDAA00] block w-full  border-0 focus:ring-0 focus:outline-none`;

	return (
		<section className="w-10/12 mx-auto  bg-white  rounded-3xl ">
			<div>
				<Toaster position="bottom-center" />
			</div>
			<div className="flex items-end pt-8 px-12 bg-[#FFCE58]  rounded-3xl mb-10 bg=">
				<div>
					<Image
						src="/loans/add.png"
						alt="Almasria Logo"
						width={240}
						height={240}
					/>
				</div>
				<div className="text-5xl  mb-10">
					<p>إضافة تمويل</p>
				</div>
			</div>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className=" space-y-6 w-full px-12  pb-8"
				autoComplete="off"
			>
				<div className="w-full grid grid-cols-4 gap-6 items-end">
					<div className=" w-full space-y-4 col-span-3">
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
								className={classNames(buttonClass)}
							/>
						</div>
					</div>
					<div>
						<div
							className={classNames(
								" cursor-pointer bg-[#343434] rounded-full font-bold   flex justify-center items-center  p-6  w-full  text-white   hover:bg-[#EDAA00]  transition-all duration-200",
								(errors.nationalId?.type === "minLength" ||
									errors.nationalId?.type === "maxLength") &&
									"hover:bg-red-500"
							)}
							onClick={(e) => {
								if (
									errors.nationalId?.type === "minLength" ||
									errors.nationalId?.type === "maxLength"
								) {
									return null;
								}
								handleSeachCustomer(e);
							}}
						>
							<span className="ml-4">بحث</span>
							{SearchIcon}
						</div>
					</div>
				</div>
				{customerInfo && customerInfo.customerScoring && (
					<div>
						<h2 className="mt-12 mb-6 font-3xl font-bold ">تقييم العميل</h2>
						{customerInfo && customerInfo.customerScoring && (
							<div className="grid grid-cols-2 gap-x-8 gap-y-6">
								<div>
									<h5 className="my-3 font-medium"> شريحة العميل</h5>
									<p className=" rounded-full px-10 p-5 bg-[#DADADA36]">
										{customerInfo.customerScoring.segmentation === 1 &&
											"Prestige"}
										{customerInfo.customerScoring.segmentation === 2 && "Elite"}
										{customerInfo.customerScoring.segmentation === 3 &&
											"Select Plus"}
										{customerInfo.customerScoring.segmentation === 4 &&
											"Select"}
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
									<h5 className="my-3 font-medium">حد التمويل</h5>
									<p className=" rounded-full px-10 p-5 bg-[#DADADA36]    ">
										{customerInfo.customerScoring.exposureLimit}
									</p>
								</div>
								<div>
									<h5 className="my-3 font-medium">سعر فائدة السلعة المعمرة</h5>
									<p className=" rounded-full px-10 p-5 bg-[#DADADA36]">
										{customerInfo.customerScoring.cgfRate}
									</p>
								</div>
							</div>
						)}
					</div>
				)}
				<div className="grid grid-cols-2 gap-6">
					<h2 className="mt-12 mb-6 font-3xl font-bold ">بيانات التمويل</h2>
					<ProductsDropDown
						selectedCategoryProduct={selectedCategoryProduct}
						setSelectedCategoryProduct={setSelectedCategoryProduct}
						setSelectedProduct={setSelectedProduct}
						selectedProduct={selectedProduct}
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
							{...register("DownPayment")}
							className={buttonClass}
						/>
					</div>
					<div>
						<button
							className=" font-semibold rounded-full    text-white flex rtl:flex-row-reverse justify-center items-center  py-5   px-20  group bg-[#EDAA00]  transition-all duration-200 w-full"
							onClick={(e) => {
								e.preventDefault();
								handleCalcLoans();
							}}
						>
							<span className="group-hover:text-primary">حساب قيمة القسط</span>
						</button>
					</div>
					<div className=" w-full space-y-4">
						<p className="font-semibold">قيمة القسط</p>
						<div className={buttonClass}>{loanInstallments} </div>
					</div>
				</div>
				{/* <div>
					{loadingDocs && (
						<div className="py-12 flex justify-center items-center">
							<Loading />
						</div>
					)}
					{!loadingDocs && requetedLoanDocs && (
						<>
							{requetedLoanDocs && requetedLoanDocs.length >= 1 ? (
								<div className="">
									<h5 className="my-8 font-bold text-xl">المستندات المطلوبة</h5>
									<div className="mt-8 text-black  items-center gap-4 grid grid-cols-4">
										{requetedLoanDocs.map((doc, index) => {
											return (
												<FileUploader
													key={index++}
													EntityType={2}
													EntityID={customerId}
													TypeID={doc.documentTypeId}
													fileName={doc.documentDescription}
												/>
											);
										})}
									</div>
								</div>
							) : (
								<h5 className="my-8 font-bold text-xl">
									لا يوجد مستندات مطلوبة
								</h5>
							)}
						</>
					)}
				</div> */}
				<div className="flex items-center  justify-end">
					<button
						type="submit"
						className=" font-semibold rounded-full bg-[#343434]   text-white flex rtl:flex-row-reverse justify-center items-center  py-5   px-20  group hover:bg-[#EDAA00]  transition-all duration-200"
					>
						{SendIcon}
						<span className="group-hover:text-primary">إرسال</span>
					</button>
				</div>
			</form>
		</section>
	);
};
export default AddLoanForm;

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
			stroke="#FCFCFC"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M22.5 22L18.5 18"
			stroke="#FCFCFC"
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
