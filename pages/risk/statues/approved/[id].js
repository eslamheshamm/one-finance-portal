import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import { Tab } from "@headlessui/react";
import classNames from "classnames";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";

import DashboardLayout from "../../../../components/Dashboard/Layout";
import apiClient from "../../../../services/apiClient";
import { CustomerDetails } from "../../../../components/RiskProcess/CustomerDetails";
import { LoanDetails } from "../../../../components/RiskProcess/LoanDetails";
import { LoanDocaments } from "../../../../components/RiskProcess/LoanDocuments";
import { LoanRequestHistoryTimeLine } from "../../../../components/Shared/LoanRequestHistory";

const PreviewApprovedLoan = () => {
	const router = useRouter();
	const { id } = router.query;
	const loanId = id;
	const [selectedIndex, setSelectedIndex] = useState(2);
	const [loanDetails, setLoanDetails] = useState(null);
	const [customerInfo, setCustomerInfo] = useState(null);
	const [loanDocs, setLoanDocs] = useState(null);
	const [requestHistory, setRequestHistory] = useState(null);
	const [comment, setComment] = useState("");

	const GetLoanInfo = () => {
		const loadingInfo = toast.loading("جاري تحميل بيانات العميل..");
		apiClient
			.post("/api/Loan/GetRequestedLoanDetails", { loanId: id })
			.then((res) => {
				toast.dismiss(loadingInfo);
				if (res.data.isSuccess) {
					toast.success("تم تحميل بيانات العميل بنجاح");
					setCustomerInfo(res.data.customer);
					setComment(res.data.loan.comment);
					setLoanDetails(res.data.loan);
				}
			})
			.catch(() => {
				toast.dismiss(loadingInfo);
				toast.success("تم تحميل بيانات العميل بنجاح");
			});
	};
	const GetLoanDocs = () => {
		const loadingDocs = toast.loading("جاري تحميل مستندات التمويل..");
		apiClient
			.post("/api/Loan/GetRequestedLoanDocuments", {
				loanId: loanId,
			})
			.then((res) => {
				toast.dismiss(loadingDocs);
				if (res.data.requestedLoanDocuments.length >= 1) {
					toast.success("تم تحميل مستندات التمويل بنجاح");
					setLoanDocs(res.data.requestedLoanDocuments);
				}
			})
			.catch((error) => {
				toast.dismiss(loadingDocs);
				toast.error("لقد حدث خطأ...");
			});
	};
	const GetLoanRequestHistory = () => {
		const loadingLoanHistory = toast.loading("جاري تحميل تاريخ الطلب..");
		apiClient
			.post("/api/Loan/GetRequestHistory", {
				loanId: loanId,
			})
			.then((res) => {
				toast.dismiss(loadingLoanHistory);
				if (res.data.isSuccess) {
					setRequestHistory(res.data.loanHistory);
					console.log(res.data, "history");
				}
			})
			.catch(() => {
				toast.dismiss(loadingLoanHistory);
				toast.error("لقد حدث خطأ...");
			});
	};
	useEffect(() => {
		if (loanId) {
			GetLoanInfo();
			GetLoanDocs();
			GetLoanRequestHistory();
		}
	}, [loanId]);

	return (
		<DashboardLayout>
			<Toaster position="bottom-center" />
			<div className="w-10/12 mx-auto shadow-md pb-8 rounded-3xl bg-white">
				<div className="flex items-center justify-start  pt-8 px-3 pb-0 bg-[#151516]  rounded-[36px] mb-10">
					<Image src="/Wave.png" alt="Almasria Logo" width={212} height={212} />
					<div className="mr-4">
						<h2 className="text-7xl mb-3 text-[#FFC662]">مرحباً </h2>
						<p className="text-4xl text-white">بيانات التمويل المطلوب..</p>
					</div>
				</div>
				<Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
					<Tab.List className="bg-white  px-10 rounded-3xl">
						<Tab as={Fragment}>
							{({ selected }) => (
								<button
									className={classNames(
										"font-bold  text-2xl px-6 focus:outline-none",
										selected ? " text-black" : " text-[#999999]"
									)}
								>
									<p className="flex flex-col items-center">
										<span>تفاصيل العميل</span>
										<span
											className={classNames(
												"h-4 border-b-4 border-black  block w-24 rounded-sm",
												selected ? " visible  x-" : " invisible"
											)}
										></span>
									</p>
								</button>
							)}
						</Tab>
						<Tab as={Fragment}>
							{({ selected }) => (
								<button
									className={classNames(
										"font-bold  text-2xl px-6 focus:outline-none",
										selected ? " text-black" : " text-[#999999]"
									)}
								>
									<p className="flex flex-col items-center">
										<span>تفاصيل التمويل</span>
										<span
											className={classNames(
												"h-4 border-b-4 border-black  block w-24 rounded-sm",
												selected ? " visible  x-" : " invisible"
											)}
										></span>
									</p>
								</button>
							)}
						</Tab>
						<Tab as={Fragment}>
							{({ selected }) => (
								<button
									className={classNames(
										"font-bold  text-2xl px-6 focus:outline-none",
										selected ? " text-black" : " text-[#999999]"
									)}
								>
									<p className="flex flex-col items-center">
										<span>مستندات التمويل</span>
										<span
											className={classNames(
												"h-4 border-b-4 border-black  block w-24 rounded-sm",
												selected ? " visible  x-" : " invisible"
											)}
										></span>
									</p>
								</button>
							)}
						</Tab>
						<Tab as={Fragment}>
							{({ selected }) => (
								<button
									className={classNames(
										"font-bold  text-2xl px-6 focus:outline-none",
										selected ? " text-black" : " text-[#999999]"
									)}
								>
									<p className="flex flex-col items-center">
										<span>تاريخ الطلب</span>
										<span
											className={classNames(
												"h-4 border-b-4 border-black  block w-24 rounded-sm",
												selected ? " visible  x-" : " invisible"
											)}
										></span>
									</p>
								</button>
							)}
						</Tab>
					</Tab.List>
					<Tab.Panels className="bg-white pb-12 px-12 ">
						<Tab.Panel className="mt-4">
							<CustomerDetails
								disableAction={true}
								customerInfo={customerInfo}
							/>
						</Tab.Panel>
						<Tab.Panel className="mt-4">
							<LoanDetails
								comment={comment}
								disableActions={true}
								loanDetails={loanDetails}
							/>
						</Tab.Panel>
						<Tab.Panel className="mt-4">
							<LoanDocaments
								id={loanId}
								loanDocs={loanDocs}
								customerInfo={customerInfo}
								disableAction={true}
							/>
						</Tab.Panel>
						<Tab.Panel>
							<LoanRequestHistoryTimeLine timeline={requestHistory} />
						</Tab.Panel>
					</Tab.Panels>
				</Tab.Group>
			</div>
		</DashboardLayout>
	);
};

export default PreviewApprovedLoan;

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
