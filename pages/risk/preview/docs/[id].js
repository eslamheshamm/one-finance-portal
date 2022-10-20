import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DashboardLayout from "../../../../components/Dashboard/Layout";
import { Tab } from "@headlessui/react";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";

import apiClient from "../../../../services/apiClient";
import { CustomerDetails } from "../../../../components/RiskProcess/CustomerDetails";
import { LoanDetails } from "../../../../components/RiskProcess/LoanDetails";
import { LoanDocaments } from "../../../../components/RiskProcess/LoanDocuments";
import { LoanRequestHistoryTimeLine } from "../../../../components/Shared/LoanRequestHistory";
import { TabButton } from "../../../../components/Atomics/TabButton";

const RiskLoanDocsPreview = () => {
	const router = useRouter();
	const { id } = router.query;
	const loanId = id;
	const [selectedIndex, setSelectedIndex] = useState(2);
	const [loanDetails, setLoanDetails] = useState(null);
	const [customerInfo, setCustomerInfo] = useState(null);
	const [loanDocs, setLoanDocs] = useState(null);
	const [requestHistory, setRequestHistory] = useState(null);
	const GetCustomerInfo = () => {
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
					console.log(res.data, "dataas");
				}
			});
	};
	const GetLoanDocs = () => {
		apiClient
			.post("/api/Loan/GetRequestedLoanDocuments", {
				loanId: loanId,
			})
			.then((res) => {
				if (res.data.requestedLoanDocuments) {
					setLoanDocs(res.data.requestedLoanDocuments);
				}
			})
			.catch((error) => {
				console.log(error, "doc");
				toast.error("لقد حدث خطأ في الأنترنت.");
			});
	};
	const GetLoanRequestHistory = () => {
		apiClient
			.post("/api/Loan/GetRequestHistory", {
				loanId: loanId,
			})
			.then((res) => {
				if (res.data.isSuccess) {
					setRequestHistory(res.data.loanHistory);
				}
			})
			.catch(() => {
				toast.error("لقد حدث خطأ في الأنترنت.");
			});
	};
	useEffect(() => {
		if (loanId) {
			GetCustomerInfo();
			GetLoanDocs();
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
						<TabButton>بيانات العميل</TabButton>
						<TabButton>بيانات التمويل</TabButton>
						<TabButton>مستندات التمويل</TabButton>
						<TabButton>تاريخ الطلب</TabButton>
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

export default RiskLoanDocsPreview;
