import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import classNames from "classnames";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import "moment/locale/ar";
import moment from "moment";

import DashboardLayout from "../../components/Dashboard/Layout";
import apiClient from "../../services/apiClient";

const ApprovedLoansQueue = () => {
	const { data: session, status } = useSession();
	const [customersData, setCustomersData] = useState(null);
	const fetchData = () => {
		const loading = toast.loading("جاري تحميل البيانات..");
		apiClient
			.post("/api/Loan/GetAcceptedLoans")
			.then(({ data }) => {
				toast.dismiss(loading);
				if (data.isSuccess) {
					toast.success("تم تحميل البيانات..");
					setCustomersData(data.acceptedLoans);
				}
			})
			.catch(() => {
				toast.dismiss(loading);
				toast.error("لقد حدث خطأ..");
			});
	};
	useEffect(() => {
		fetchData();
	}, []);

	return (
		<DashboardLayout lang={"ar"}>
			{customersData && (
				<section>
					<div className="my-12  mx-auto w-11/12 ">
						<div className="overflow-x-auto rounded-3xl  shadow-lg" dir="rtl">
							<table className="w-full  ">
								<thead className="border-white text-right font-medium text-lg bg-white">
									<tr>
										<th className="px-6 pt-6 pb-4 font-semibold">إسم العميل</th>
										<th className="px-6 pt-6 pb-4 font-semibold">
											مسئول المبيعات
										</th>
										<th className="px-6 pt-6 pb-4 font-semibold">المنتج</th>
										<th className="px-6 pt-6 pb-4 font-semibold">
											قيمة التمويل
										</th>
										<th className="px-6 pt-6 pb-4 font-semibold">
											تاريخ الإرسال
										</th>
										<th className="px-6 pt-6 pb-4 font-semibold">
											تاريخ التعديل
										</th>
										<th className="px-6 pt-6 pb-4 font-semibold">الحالة</th>
									</tr>
								</thead>
								<tbody>
									{customersData &&
										customersData.map((item, index) => {
											return <LoanRequestPreview key={index++} {...item} />;
										})}
								</tbody>
							</table>
						</div>
					</div>
				</section>
			)}
		</DashboardLayout>
	);
};
export default ApprovedLoansQueue;

const LoanRequestPreview = ({
	customer,
	sales,
	product,
	amount,
	status,
	id,
	...props
}) => {
	moment.locale("ar");
	const submittedOnDateFormated = moment(props.submittedOnDate).format(
		"DD MMM  - h:mm:ss a"
	);
	const updatedOnDateFormated = moment(props.updatedOnDate).format(
		"DD MMM  - h:mm:ss a"
	);
	return (
		<tr className="bg-white text-right text-[#6E7191]  text-base">
			<td className="  px-6 py-2 ">
				<div className="flex">
					{/* <span className="ml-4">{Person}</span> */}
					<p>{customer}</p>
				</div>
			</td>
			<td className="  px-6 py-2 ">
				<p>{sales}</p>
			</td>
			<td className="  px-6 py-2 ">
				<p>{product}</p>
			</td>
			<td className="  px-6 py-2 ">
				<p>{amount}</p>
			</td>
			<td className="  px-6 py-2 text-right ">
				<p>{submittedOnDateFormated}</p>
			</td>
			<td className="  px-6 py-2  text-right">
				<p>{updatedOnDateFormated}</p>
			</td>
			<td className="  px-6 py-2 ">
				<div className="flex items-center">
					{/* <Link
						href={{
							pathname: "/loans/statues/approved/[id]",
							query: { id: id },
						}}
					>
						<button
							className={classNames(
								"py-3 px-6 rounded-full text-sm  flex-1 font-semibold ",
								status === "Approved" && "bg-[#CCF5E0] text-[#00CC67]"
							)}
						>
							{status === "Approved" && "مقبول"}
						</button>
					</Link> */}
					<button
						className={classNames(
							"py-3 px-6 rounded-full text-sm  flex-1 font-semibold ",
							status === "Approved" && "bg-[#CCF5E0] text-[#00CC67]"
						)}
					>
						{status === "Approved" && "مقبول"}
					</button>
				</div>
			</td>
		</tr>
	);
};
