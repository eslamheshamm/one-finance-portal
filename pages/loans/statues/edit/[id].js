import Image from "next/image";
import DashboardLayout from "../../../../components/Dashboard/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import apiClient from "../../../../services/apiClient";
import toast, { Toaster } from "react-hot-toast";
import { FileReplacer } from "../../../../components/Atomics/Files/FileReplacer";
import { useSession } from "next-auth/react";
import { Loading } from "../../../../components/Atomics/Loading";

const RequestForEditCustomer = () => {
	const { data: session, status } = useSession();
	const router = useRouter();
	const { id } = router.query;
	const loanId = id;

	const [loanDownloadDocs, setLoanDownloadDocs] = useState(null);
	const [loanUploadDocs, setLoanUploadDocs] = useState(null);

	const [loanDocs, setLoanDocs] = useState(null);
	const [customerInfo, setCustomerInfo] = useState(null);
	const [comment, setComment] = useState("");
	const [loading, setLoading] = useState(true);
	const GetLoanDownloadDocs = () => {
		apiClient
			.post("/api/Loan/GetLoanDownloadDocuments", { loanId: loanId })
			.then((res) => {
				setLoanDownloadDocs(res.data.loanDownloadDocuments);
			})
			.catch(() => {
				toast.error("لقد حدث خطأ.");
			});
	};

	const GetUploadDocs = () => {
		apiClient
			.post("/api/Loan/GetLoanContractingDocumentTypeUpload", {
				loanId: loanId,
			})
			.then((res) => {
				setLoanUploadDocs(res.data.loanDownloadDocuments);
			})
			.catch((error) => {
				toast.error("لقد حدث خطأ...");
			});
	};

	const GetLoanData = () => {
		const loading = toast.loading("جاري تحميل البيانات..");
		apiClient
			.post("/api/Loan/GetRequestedLoanDetails", { loanId: loanId })
			.then(({ data }) => {
				toast.dismiss(loading);
				if (data.isSuccess) {
					toast.success("تم تحميل البيانات بنجاح...");
					setCustomerInfo(data.customer);
					setComment(data.loan.comment);
					setLoading(false);
				}
			})
			.catch((err) => {
				console.error(err);
			});
	};

	const handleUpdateLoanDocs = () => {
		const loading = toast.loading("جاري تحديث بيانات التمويل..");
		apiClient
			.post("/api/Loan/SetLoanAsEdited", {
				id: loanId,
				comment: "",
				user: session.user.id,
			})
			.then((res) => {
				toast.dismiss(loading);
				if (res.data.isSuccess) {
					toast.success("تم تحديث مستندات التمويل بنجاح");
				}
			})
			.catch((error) => {
				toast.dismiss(loading);
				toast.error("لقد حدث خطأ...");
			})
			.finally(() => {
				setTimeout(() => {
					router.push("/loans/queue");
				}, 1000);
			});
	};
	useEffect(() => {
		if (loanId) {
			GetLoanDownloadDocs();
			GetUploadDocs();
			GetLoanData();
		}
	}, [loanId]);

	return (
		<DashboardLayout>
			<Toaster position="bottom-center" />
			{loading && (
				<div className="py-20">
					<Loading />
				</div>
			)}
			{!loading && customerInfo && (
				<section className="w-10/12 mx-auto   shadow-sm rounded-[32px] bg-white pb-8">
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
								يرجي مراجعة مستندات التمويل..
							</p>
						</div>
					</div>
					{/* docs */}
					<div className="px-8 ">
						<div>
							<div className={"pt-8 mb-4 bg-white   rounded-3xl"}>
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
								{comment && (
									<div className=" mb-6">
										<h5 className="my-3 font-bold text-2xl">الملاحظة</h5>
										<p className=" rounded-full px-10 pt-5 p-5  bg-[#DADADA36]">
											{comment}
										</p>
									</div>
								)}
								<div className="flex items-center mb-4 font-semibold"></div>
							</div>
							<div>
								<h5 className="mb-6 font-bold text-2xl"> المستندات المطلوبة</h5>
								<div className="grid grid-cols-3 gap-6">
									{loanDownloadDocs &&
										loanDownloadDocs.map((doc, index) => {
											return (
												<button
													key={index++}
													className="p-4 bg-[#FFC662]	  rounded-2xl text-xs"
												>
													<a
														href={doc.url}
														download={doc.typeName}
														target="_blank"
														rel="noopener noreferrer"
													>
														<div className=" flex items-center  font-semibold text-xl ">
															<span>{DowloanIcon}</span>
															<span className="mr-4">
																{doc.documentDescription}
															</span>
														</div>
													</a>
												</button>
											);
										})}
								</div>
							</div>
							<div className="py-8 border-t mt-8">
								<h5 className="mb-6 font-bold text-2xl"> المستندات المرفوعة</h5>
								<div className="grid grid-cols-3  gap-6">
									{loanUploadDocs.map((doc, index) => {
										return (
											<FileReplacer
												key={index++}
												doc={doc}
												EntityType={2}
												EntityID={loanId}
												fileName={doc.documentDescription}
											/>
										);
									})}
								</div>
							</div>
						</div>
						<div className="mt-10 flex justify-end w-full">
							<button
								onClick={handleUpdateLoanDocs}
								className=" font-semibold rounded-full  bg-[#343434]   text-white flex rtl:flex-row-reverse justify-center items-center  py-5  px-24  group hover:bg-[#EDAA00]  transition-all duration-200"
							>
								<span className="group-hover:text-primary">إرسال</span>
							</button>
						</div>
					</div>
				</section>
			)}
		</DashboardLayout>
	);
};

export default RequestForEditCustomer;

const Person = (
	<svg
		width="39"
		height="39"
		viewBox="0 0 39 39"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M36.5625 26.8125H27.4219L25.8375 26.2031H29.5011C30.1945 26.2031 30.8429 25.7638 31.0227 25.0935C31.2945 24.0801 30.5273 23.1562 29.5547 23.1562C29.0501 23.1562 28.6406 22.7468 28.6406 22.2422C28.6406 21.7376 29.0501 21.3281 29.5547 21.3281H31.3292C32.0233 21.3281 32.671 20.8888 32.8508 20.2185C33.1226 19.2051 32.3554 17.6719 31.3828 17.6719H31.0781C30.4048 17.6719 29.8594 17.1265 29.8594 16.4531C29.8594 15.7798 30.4048 15.2344 31.0781 15.2344H36.8136C37.5076 15.2344 38.1554 14.795 38.3352 14.1247C38.607 13.1113 37.8398 12.1875 36.8672 12.1875H35.9531C35.2798 12.1875 34.7344 11.6421 34.7344 10.9688C34.7344 10.2954 35.2798 9.75 35.9531 9.75H37.1719C38.298 9.75 39.1944 8.71833 38.9634 7.5532C38.791 6.68606 37.9763 6.09375 37.0921 6.09375H30.7734C30.2689 6.09375 29.8594 5.68425 29.8594 5.17969C29.8594 4.67512 30.2689 4.26562 30.7734 4.26562H34.3761C35.0701 4.26562 35.7179 3.82627 35.8977 3.15595C36.1695 2.14256 35.4023 1.21875 34.4297 1.21875H6.45206C5.75799 1.21875 5.11022 1.65811 4.93045 2.32842C4.65867 3.34181 5.42588 4.26562 6.39844 4.26562C7.23999 4.26562 7.92188 4.94752 7.92188 5.78906C7.92188 6.63061 7.23999 7.3125 6.39844 7.3125H5.84269H4.26563C3.26016 7.3125 2.4375 8.13516 2.4375 9.14062C2.4375 10.1461 3.26016 10.9688 4.26563 10.9688H15.8438C16.0583 10.9688 16.2612 10.9243 16.4531 10.856V17.6719H11.9364C11.2424 17.6719 10.5946 18.7206 10.4148 19.3909C10.2814 19.8888 10.4002 20.3629 10.6695 20.7188H1.52344C0.681891 20.7188 0 21.4006 0 22.2422C0 23.0837 0.681891 23.7656 1.52344 23.7656H2.13281C2.97436 23.7656 3.65625 24.4475 3.65625 25.2891C3.65625 26.1306 2.97436 26.8125 2.13281 26.8125H1.82813C0.818391 26.8125 0 27.6309 0 28.6406C0 29.6504 0.818391 30.4688 1.82813 30.4688H5.78906C6.63061 30.4688 7.3125 31.1506 7.3125 31.9922C7.3125 32.8337 6.63061 33.5156 5.78906 33.5156H4.875C3.86527 33.5156 3.04688 34.334 3.04688 35.3438C3.04688 36.3535 3.86527 37.1719 4.875 37.1719H34.125C35.1347 37.1719 35.9531 36.3535 35.9531 35.3438C35.9531 34.334 35.1347 33.5156 34.125 33.5156H33.8203C32.9788 33.5156 32.2969 32.8337 32.2969 31.9922C32.2969 31.1506 32.9788 30.4688 33.8203 30.4688H36.5625C37.5722 30.4688 38.3906 29.6504 38.3906 28.6406C38.3906 27.6309 37.5722 26.8125 36.5625 26.8125ZM16.4531 22.5938L13.1625 21.3281H16.4531V22.5938Z"
			fill="url(#paint0_radial_1803_27121)"
		/>
		<path
			d="M20.4141 6.09375C16.7777 6.09375 13.2903 7.53829 10.719 10.1096C8.14767 12.6809 6.70313 16.1683 6.70312 19.8047C6.70313 23.4411 8.14767 26.9285 10.719 29.4998C13.2903 32.0711 16.7777 33.5156 20.4141 33.5156C24.0504 33.5156 27.5379 32.0711 30.1092 29.4998C32.6805 26.9285 34.125 23.4411 34.125 19.8047C34.125 16.1683 32.6805 12.6809 30.1092 10.1096C27.5379 7.53829 24.0504 6.09375 20.4141 6.09375V6.09375Z"
			fill="url(#paint1_linear_1803_27121)"
		/>
		<path
			d="M32.9062 4.26562H14.625C8.90358 4.26562 4.26562 8.90358 4.26562 14.625V24.0703C4.26562 26.258 6.03891 28.0312 8.22656 28.0312C10.4142 28.0312 12.1875 26.258 12.1875 24.0703V20.7188C12.1875 17.0168 15.1887 14.0156 18.8906 14.0156H28.0312C32.0696 14.0156 35.3438 10.7415 35.3438 6.70312C35.3438 5.35702 34.2524 4.26562 32.9062 4.26562Z"
			fill="url(#paint2_linear_1803_27121)"
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
			d="M30.4688 19.1953C30.4688 19.6999 30.0593 20.1094 29.5547 20.1094C29.0501 20.1094 28.6406 19.6999 28.6406 19.1953C28.6406 18.6907 29.0501 18.2812 29.5547 18.2812C30.0593 18.2812 30.4688 18.6907 30.4688 19.1953Z"
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
			d="M21.9375 19.1953C21.9375 19.6999 21.528 20.1094 21.0234 20.1094C20.5189 20.1094 20.1094 19.6999 20.1094 19.1953C20.1094 18.6907 20.5189 18.2812 21.0234 18.2812C21.528 18.2812 21.9375 18.6907 21.9375 19.1953Z"
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
				id="paint0_radial_1803_27121"
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
				id="paint1_linear_1803_27121"
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
				id="paint2_linear_1803_27121"
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
const DowloanIcon = (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M2.5 12C2 10.5 2 9 2 7.95636C2 4.47818 5.11447 1 8.95636 1C11.5312 1 13.7793 2.39892 14.9821 4.47818H15.9127C18.7941 4.47818 21.5 6.5 21.5 9C21.5 10 21.5 11 21 12"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M7.41675 18.3315L11.5001 22.2498L15.5834 18.3315"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M11.5 21.2192L11.5 10.125"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
		/>
	</svg>
);
