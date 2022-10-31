import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { Tab } from "@headlessui/react";

import apiClient from "../../../../services/apiClient";
import DashboardLayout from "../../../../components/Dashboard/Layout";
import { CustomerDetails } from "../../../../components/RiskProcess/CustomerDetails";
import { TabButton } from "../../../../components/Atomics/TabButton";
import { CustomerRequestHistoryTimeLine } from "../../../../components/Shared/CustomerRequestHistory";

const RiskCustomerPreview = () => {
	const { data: session, status } = useSession();
	const router = useRouter();
	const { id } = router.query;
	const customerId = id;
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [customerInfo, setCustomerInfo] = useState(null);
	const [customerDocs, setCustomerDocs] = useState(null);
	const [requestHistory, setRequestHistory] = useState(null);

	// const handleSetCustomerAsTaken = () => {
	// 	apiClient
	// 		.post("/api/Customer/SetCustomerOnRiskMan", {
	// 			user: session.user.id,
	// 			customerId: customerId,
	// 		})
	// 		.then((res) => {
	// 			console.log(res);
	// 		})
	// 		.catch((err) => {
	// 			console.log(err);
	// 		});
	// };

	const GetCusomerInfo = () => {
		const loadingCustomerInfo = toast.loading("جاري تحميل بيانات العميل");
		apiClient
			.get("/api/Customer/GetCustomerDetailsByID", {
				params: { CustomerID: id },
			})
			.then((res) => {
				toast.dismiss(loadingCustomerInfo);
				if (res.data.isSuccess) {
					setCustomerInfo(res.data.data);
					toast.success("تم تحميل بيانات العميل بنجاح");
				}
			})
			.catch(() => {
				toast.dismiss(loadingCustomerInfo);
				toast.error("لقد حدث خطأ في الأنترنت.");
			});
	};
	const GetCustomerDocs = () => {
		apiClient
			.get("/api/Document/GetDocument", {
				id: id,
				type: 1,
			})
			.then((res) => {
				if (res.data.isSuccess) {
					setCustomerDocs(res.data.customerUploadDocuments);
				}
			})
			.catch(() => {
				toast.error("لقد حدث خطأ في الأنترنت.");
			});
	};
	const GetCusomerRequestHistory = () => {
		apiClient
			.post("/api/Customer/GetCustomerRequestHistory", {
				CustomerId: customerId,
			})
			.then((res) => {
				if (res.data.isSuccess) {
					setRequestHistory(res.data.customerHistory);
				}
			})
			.catch(() => {
				toast.error("لقد حدث خطأ في الأنترنت.");
			});
	};

	useEffect(() => {
		if (customerId) {
			GetCusomerInfo();
			GetCustomerDocs();
			GetCusomerRequestHistory();
		}
	}, [customerId]);

	return (
		<DashboardLayout>
			<Toaster position="bottom-center" />
			<div className="w-11/12 mx-auto bg-white rounded-3xl pb-8">
				<div className="flex items-center justify-start  pt-8 px-3 pb-0 bg-[#151516]  rounded-[36px] mb-10">
					<Image src="/Wave.png" alt="Almasria Logo" width={212} height={212} />
					<div className="mr-4">
						<h2 className="text-7xl mb-3 text-[#FFC662]">مرحباً </h2>
						<p className="text-4xl text-white">يرجي فحص بيانات العميل..</p>
					</div>
				</div>
				<Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
					<Tab.List>
						<TabButton>بيانات العميل</TabButton>
						<TabButton>بيانات التمويل</TabButton>
						<TabButton>مستندات التمويل</TabButton>
						<TabButton>تاريخ الطلب</TabButton>
					</Tab.List>
					<Tab.Panels>
						<Tab.Panel className="mt-20">
							<CustomerDetails
								customerInfo={customerInfo}
								customerDocs={customerDocs}
								// customerId={customerId}
							/>
						</Tab.Panel>
						<Tab.Panel>
							<NoData />
						</Tab.Panel>
						<Tab.Panel>
							<NoData />
						</Tab.Panel>
						<Tab.Panel>
							<CustomerRequestHistoryTimeLine timeline={requestHistory} />
						</Tab.Panel>
					</Tab.Panels>
				</Tab.Group>
			</div>
		</DashboardLayout>
	);
};

export default RiskCustomerPreview;

const NoData = () => {
	return (
		<div className="w-full my-10 flex flex-col justify-center items-center">
			{NoDataIcon}
			<p className="text-2xl text-[#151516]">لا يوجد معلومات حتي الأن.</p>
		</div>
	);
};

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
