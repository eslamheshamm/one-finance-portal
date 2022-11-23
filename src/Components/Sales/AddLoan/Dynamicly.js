import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";
import { ProductsDropDown } from "../ProductDropDown";
// import { FileUploader } from "../../Atomics/Files/FileUploader";

const AddLoanDynamclyForm = ({ customerId, customerInfo }) => {
	const router = useRouter();
	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm({ mode: "onChange" });
	const [selectedCategoryProduct, setSelectedCategoryProduct] = useState({
		name: "يرجي الإختيار",
		id: -1,
		productListResponseDTO: [],
	});
	const [selectedProduct, setSelectedProduct] = useState({
		name: "يرجي الإختيار",
		id: -1,
	});
	const [loanInstallments, setLoanInstallments] = useState(0);

	// const [requetedLoanDocs, setRequetedLoanDocs] = useState(null);
	// const [loadingDocs, setLoadingDocs] = useState(false);
	// const handleGetRequestedLoanDocs = () => {
	// 	setLoadingDocs(true);
	// 	apiClient
	// 		.post(`/api/Loan/GetLoanRequestedDocumentTypeUpload`, {
	// 			productId: selectedProduct.id,
	// 		})
	// 		.then((res) => {
	// 			setLoadingDocs(false);
	// 			if (res.data.isSuccess) {
	// 				setRequetedLoanDocs(res.data.loanDownloadDocuments);
	// 			}
	// 		})
	// 		.catch((err) => {
	// 			console.log(err);
	// 		})
	// 		.finally(() => {
	// 			setLoadingDocs(false);
	// 		});
	// };

	// useEffect(() => {
	// 	if (selectedProduct.id !== -1 && selectedProduct.id !== null) {
	// 		handleGetRequestedLoanDocs();
	// 	}
	// }, [selectedProduct, setSelectedProduct]);

	// const handleSeachCustomer = () => {
	// 	const loading = toast.loading("جاري البحث عن العميل..");
	// 	apiClient
	// 		.post("/api/Customer/GetCustomerDetails", { customerId: customerId })
	// 		.then(({ data }) => {
	// 			toast.dismiss(loading);
	// 			if (data.isSuccess) {
	// 				toast.success("العميل موجود..");
	// 			}
	// 			if (data.customer) {
	// 				const customer = data.customer;
	// 				setValue("idno", customer.customer.idno);
	// 				setCustomerData(data.customer);
	// 				setUserExist(true);
	// 			} else {
	// 				toast.error("العميل غير موجود..");
	// 				resetField("idno");
	// 			}
	// 		})
	// 		.catch(() => {
	// 			toast.dismiss(loading);
	// 			toast.error("لقد حدث خطأ..");
	// 		});
	// };
	// useEffect(() => {
	// 	handleSeachCustomer();
	// }, []);
	const onSubmit = (data) => {
		const loading = toast.loading("جاري إضافة التمويل..");
		apiClient
			.post("/api/Loan/CreateLoan", {
				customerID: Number(customerId),
				product: selectedProduct.id,
				amount: Number(data.LoanAmount),
				period: Number(data.LoanDuration),
				downPayment: Number(data.DownPayment),
			})
			.then((res) => {
				toast.dismiss(loading);
				if (res.data.code == 602) {
					toast.error("العميل يمتلك تمويل بالفعل..");
					setTimeout(() => {
						router.push("/loans/queue");
					}, 1000);
					return true;
				}
				if (res.data.isSuccess) {
					toast.success("تم إضافة التمويل..");
					setTimeout(() => {
						router.push("/loans/queue");
					}, 1000);
				}
				if (!res.data.isSuccess) {
					toast.error("لقد حدث خطأ..");
				}
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
				pricingSegmentId: 4,
				productId: Number(selectedProduct.id),
				downPayment: Number(watchDownPayment),
				amount: Number(watchLoanAmount),
				period: Number(watchLoanDuration),
				requestDate: requestDate,
			})
			.then((res) => {
				toast.dismiss(loading);
				console.log(res, "fafaf");
				if (res.data.isSuccess) {
					setLoanInstallments(res.data.data.installmentAmount);
				}
			})
			.catch(() => {
				toast.dismiss(loading);
				toast.error("حدث خطأ..");
			});
	};
	const buttonClass = `p-6 placeholder-[#9099A9] rounded-full  bg-[#DADADA36] bg-opacity-20   w-full `;
	return (
		<section className="  bg-white  rounded-3xl ">
			<div>
				<Toaster position="bottom-center" />
			</div>

			<div className="flex items-end pt-8 px-12 bg-[#FFCE58]  rounded-3xl mb-10">
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
				className=" w-full px-12 pb-8"
				autoComplete="off"
			>
				<div className="mb-5">
					<h2 className="mt-12 mb-6 font-3xl font-bold ">بيانات العميل</h2>
					<div className="grid grid-cols-2 gap-6">
						<div className=" w-full space-y-4">
							<p className="font-semibold">اسم العميل</p>
							<p className={buttonClass}>{`${customerInfo.firstName || ""} ${
								customerInfo.secondName || ""
							} ${customerInfo.middileName} ${customerInfo.lastName || ""}`}</p>
						</div>
						<div className=" w-full space-y-4">
							<p className="font-semibold">حد التمويل</p>
							<p className={buttonClass}>{customerInfo.exposureLimit}</p>
						</div>
						<div className=" w-full space-y-4">
							<p className="font-semibold">حد السلعة المعمرة</p>
							<p className={buttonClass}>{customerInfo.cgfLimit}</p>
						</div>
						<div className=" w-full space-y-4">
							<p className="font-semibold">الحد الائتماني الاضافي</p>
							<p className={buttonClass}>{customerInfo.cgfRate}</p>
						</div>
						<div>
							<h5 className="my-3 font-medium">شريحة التسعير</h5>
							<p className=" rounded-full px-10 p-5 bg-[#DADADA36]">
								{customerInfo.pricing === 1 && "A"}
								{customerInfo.pricing === 2 && "B"}
								{customerInfo.pricing === 3 && "C"}
								{customerInfo.pricing === 4 && "D"}
							</p>
						</div>{" "}
						<div>
							<h5 className="my-3 font-medium"> شريحة العميل</h5>
							<p className=" rounded-full px-10 p-5 bg-[#DADADA36]">
								{customerInfo.segmentation === 1 && "Prestige"}
								{customerInfo.segmentation === 2 && "Elite"}
								{customerInfo.segmentation === 3 && "Select Plus"}
								{customerInfo.segmentation === 4 && "Select"}{" "}
							</p>
						</div>
					</div>
				</div>
				<div className="mb-5 space-y-5">
					<h2 className="font-3xl font-bold ">بيانات التمويل</h2>
					<div className="grid grid-cols-2 gap-6">
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
					<div className="grid  gap-6 ">
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
								className=" font-semibold rounded-full text-white py-6 bg-[#EDAA00]   w-full"
								onClick={(e) => {
									e.preventDefault();
									handleCalcLoans();
								}}
							>
								حساب قيمة القسط
							</button>
						</div>
						<div className=" w-full space-y-4">
							<p className="font-semibold">قيمة القسط</p>
							<div className={buttonClass}>{loanInstallments} </div>
						</div>
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
export default AddLoanDynamclyForm;

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