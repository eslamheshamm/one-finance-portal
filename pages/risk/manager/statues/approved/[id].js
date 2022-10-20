import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import { Tab } from "@headlessui/react";
import classNames from "classnames";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";

import DashboardLayout from "../../../../../components/Dashboard/Layout";
import apiClient from "../../../../../services/apiClient";
import { CustomerDetails } from "../../../../../components/RiskProcess/CustomerDetails";
import { LoanDetails } from "../../../../../components/RiskProcess/LoanDetails";
import { LoanDocaments } from "../../../../../components/RiskProcess/LoanDocuments";
import { LoanRequestHistoryTimeLine } from "../../../../../components/Shared/LoanRequestHistory";

const FinanceLoanPreview = () => {
	const router = useRouter();
	const { id } = router.query;
	const loanId = id;
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [loanDetails, setLoanDetails] = useState(null);
	const [customerInfo, setCustomerInfo] = useState(null);
	const [loanDocs, setLoanDocs] = useState(null);
	const [requestHistory, setRequestHistory] = useState(null);

	const fetchCustomerInfo = () => {
		const loadingCustomerInfo = toast.loading("جاري تحميل بيانات العميل..");
		apiClient
			.post("/api/Loan/GetRequestedLoanDetails", { loanId: id })
			.then((res) => {
				toast.dismiss(loadingCustomerInfo);
				if (res.data.isSuccess) {
					toast.dismiss(loadingCustomerInfo);
					toast.success("تم تحميل بيانات العميل بنجاح");
					setCustomerInfo(res.data.customer);
					setLoanDetails(res.data.loan);
					console.log(res.data);
				}
			});
	};
	const fetchLoanDocs = () => {
		const loadingCustomerDocs = toast.loading("جاري تحميل مستندات التمويل..");
		apiClient
			.post("/api/Loan/GetRequestedLoanDocuments", {
				loanId: loanId,
			})
			.then((res) => {
				if (res.data.requestedLoanDocuments.length >= 1) {
					toast.dismiss(loadingCustomerDocs);
					toast.success("تم تحميل مستندات التمويل بنجاح");
					setLoanDocs(res.data.requestedLoanDocuments);
				}
				if (res.data.requestedLoanDocuments.length === 0) {
					toast.dismiss(loadingCustomerDocs);
					toast.error("لا يوجد مستندات للتمويل");
				}
				console.log(res.data, "docs");
			})
			.catch((error) => {
				toast.dismiss(loadingCustomerDocs);
				toast.error("لقد حدث خطأ...");
				console.log(error);
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
			fetchCustomerInfo();
			fetchLoanDocs();
			GetLoanRequestHistory();
		}
	}, [loanId]);

	return (
		<DashboardLayout>
			<Toaster position="bottom-center" />
			<div className="w-10/12 mx-auto bg-white rounded-3xl">
				<div className="flex items-center justify-start  pt-8 px-3 pb-0 bg-[#151516]  rounded-[36px] mb-10">
					<Image src="/Wave.png" alt="Almasria Logo" width={212} height={212} />
					<div className="mr-4">
						<h2 className="text-7xl mb-3 text-[#FFC662]">مرحباً </h2>
						<p className="text-4xl text-white">يرجي فحص بيانات التمويل..</p>
					</div>
				</div>
				<Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
					<Tab.List>
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
					<Tab.Panels className="px-8 pb-8 shadow-sm">
						<Tab.Panel className="mt-20">
							<CustomerDetails
								disableAction={true}
								customerInfo={customerInfo}
							/>
						</Tab.Panel>
						<Tab.Panel className="mt-20">
							<LoanDetails disableActions={true} loanDetails={loanDetails} />
						</Tab.Panel>
						<Tab.Panel className="mt-20">
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

export default FinanceLoanPreview;
