import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import classNames from "classnames";
import toast, { Toaster } from "react-hot-toast";
import { Transition, Listbox } from "@headlessui/react";
import "moment/locale/ar";
import moment from "moment";
import DashboardLayout from "../../../src/Components/Layout";
import apiClient from "../../../src/Utils/Services/apiClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import ClipLoader from "react-spinners/ClipLoader";

const filters = [
	{ id: 1, name: "الكل", value: "All" },
	{ id: 2, name: "طلب تعديل", value: "Pending Customer" },
	{ id: 3, name: "مقبول", value: "Approved Customer" },
	{ id: 4, name: "مرفوض", value: "Rejected Customer" },
];

const CustomersQueue = () => {
	const { isLoading, isError, isSuccess, data } = useQuery(
		["pendingCustomersQueue"],
		async () => {
			return await apiClient.get("/api/Customer/GetPendingCustomers");
		}
	);
	const [q, setQ] = useState("");
	const [searchParam] = useState(["nationalID"]);
	const [filterParam, setFilterParam] = useState(filters[0]);

	function search(items) {
		return items.filter((item) => {
			if (item.status == filterParam.value) {
				return searchParam.some((newItem) => {
					return (
						item[newItem].toString().toLowerCase().indexOf(q.toLowerCase()) > -1
					);
				});
			} else if (filterParam.value == "All") {
				return searchParam.some((newItem) => {
					return (
						item[newItem].toString().toLowerCase().indexOf(q.toLowerCase()) > -1
					);
				});
			}
		});
	}

	return (
		<DashboardLayout lang={"ar"}>
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
				<section>
					<form className="grid grid-cols-5 gap-6 items-center py-8 px-12 bg-white rounded-[32px] shadow-sm">
						<div className="relative  col-span-4">
							<div className="flex absolute inset-y-0 left-0 rtl:right-0 rtl:left-auto rtl:pr-12 items-center  pointer-events-none">
								{Search}
							</div>
							<input
								type="number"
								className="block py-6 pl-12 rtl:pr-24 w-full rounded-full font-medium text-xl bg-[#F0F0F0] placeholder-[#9099A9] border-0 focus-within:ring-2 focus:ring-[#EDAA00]"
								placeholder="البحث بالرقم القومي"
								value={q}
								onChange={(e) => setQ(e.target.value)}
							/>
						</div>
						<div>
							<div className="">
								<Listbox value={filterParam} onChange={setFilterParam}>
									<div className="relative ">
										<Listbox.Button className="relative  rounded-full w-full cursor-pointer text-white  bg-[#9099A9] py-6 px-8 text-center shadow-md focus:outline-none ">
											<span className="block ">{filterParam.name}</span>
										</Listbox.Button>
										<Transition
											as={Fragment}
											leave="transition ease-in duration-100"
											leaveFrom="opacity-100"
											leaveTo="opacity-0"
										>
											<Listbox.Options className="absolute mt-2 w-full overflow-auto rounded-2xl bg-white  text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
												{filters.map((filter) => (
													<Listbox.Option
														key={filter.id}
														className={({ active }) =>
															`relative cursor-default select-none py-4 pl-10 pr-4 ${
																active
																	? "bg-amber-100 text-amber-900"
																	: "text-gray-900"
															}`
														}
														value={filter}
													>
														{({ selected }) => (
															<>
																<span
																	className={`block truncate text-lg ${
																		selected ? "font-medium" : "font-normal"
																	}`}
																>
																	{filter.name}
																</span>
																{selected ? (
																	<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600"></span>
																) : null}
															</>
														)}
													</Listbox.Option>
												))}
											</Listbox.Options>
										</Transition>
									</div>
								</Listbox>
							</div>
						</div>
					</form>

					<div className="my-12">
						<div className="  overflow-auto rounded-3xl  shadow-sm" dir="rtl">
							<table className="w-full  whitespace-nowrap rounded-lg bg-white  overflow-hidden ">
								<thead className="border-white text-right font-medium text-lg   w-full bg-white">
									<tr>
										<th className="px-6 pt-6 pb-4 font-semibold">إسم العميل</th>
										<th className="px-6 pt-6 pb-4 font-semibold">
											الرقم القومي
										</th>
										<th className="px-6 pt-6 pb-4 font-semibold">
											مسئول المبيعات
										</th>
										<th className="px-6 pt-6 pb-4 font-semibold">
											تاريخ الإرسال
										</th>
										<th className="px-6 pt-6 pb-4 font-semibold">
											تاريخ التعديل
										</th>
										<th className="px-6 pt-6 pb-4 font-semibold ">الحالة</th>
									</tr>
								</thead>
								<tbody>
									{data?.data?.data &&
										search(data?.data?.data).map((item, index) => {
											return <CustomerRequestReview key={index++} {...item} />;
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
export default CustomersQueue;

const CustomerRequestReview = ({
	customerName,
	salesName,
	office,
	nationalID,
	id,
	status,
	...props
}) => {
	const submittedOnDateFormated = moment(props.submittedDate).format(
		"DD MMM  - h:mm:ss a"
	);
	const updatedOnDateFormated = moment(props.updatedDate).format(
		"DD MMM  - h:mm:ss a"
	);
	return (
		<tr className="bg-white text-[#6E7191] ">
			<td className="  px-6 py-2 ">
				<div className="flex items-center">
					{/* <div className="ml-4">{Person}</div> */}
					<p>{customerName}</p>
				</div>
			</td>
			<td className="px-6 py-2">
				<div className="flex items-center">{nationalID}</div>
			</td>

			<td className="px-6 py-2">
				<p>{salesName}</p>
			</td>
			<td className="px-6 py-2">
				<div className="flex items-center text-center w-full">
					<p>{submittedOnDateFormated}</p>
				</div>
			</td>
			<td className="px-6 py-2">
				<div className="flex items-center text-center w-full">
					<p>{updatedOnDateFormated}</p>
				</div>
			</td>
			<td className="px-6 py-2">
				<div className="flex items-center">
					<Link
						href={
							status === "Approved Customer"
								? {
										pathname: "/sales/customers/statues/accepted/[id]",
										query: { id: id },
								  }
								: status === "Pending Customer"
								? {
										pathname: "/sales/customers/statues/pending/[id]",
										query: { id: id },
								  }
								: status === "Rejected Customer"
								? {
										pathname: "/sales/customers/statues/rejected/[id]",
										query: { id: id },
								  }
								: {
										pathname: "/sales/customers/queue",
								  }
						}
					>
						<button
							className={classNames(
								"py-3 px-6 rounded-full text-sm  flex-1 font-semibold ",
								status === "Approved Customer" && "bg-[#CCF5E0] text-[#00CC67]",
								status === "Pending Customer" && "bg-[#FFF8F2] text-[#FF7500]",
								status === "Rejected Customer" &&
									"bg-[#FF0000] bg-opacity-30 text-[#FF0000]"
							)}
						>
							{status === "Approved Customer" && "مقبول"}
							{status === "Pending Customer" && "طلب تعديل"}
							{status === "Rejected Customer" && "مرفوض"}
						</button>
					</Link>
				</div>
			</td>
		</tr>
	);
};

const Search = (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		className=" text-[#9099A9]"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M11 20C15.9706 20 20 15.9706 20 11C20 6.02944 15.9706 2 11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20Z"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M22 22L18 18"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);
