import { Fragment, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import classNames from "classnames";
import Link from "next/link";
import DashboardLayout from "../../../components/Dashboard/Layout";
import apiClient from "../../../services/apiClient";
import { Transition, Listbox } from "@headlessui/react";
import "moment/locale/ar";
import moment from "moment";
import { useQuery } from "@tanstack/react-query";

const filters = [
	{ id: 1, name: "الكل", value: "All" },
	{ id: 2, name: "انتظار", value: "Submitted Customer" },
	{ id: 3, name: "محدثة", value: "Updated Customer" },
];
const RiskPendingCustomers = () => {
	const { isLoading, isError, isSuccess, data } = useQuery(
		["submitedCustomersQueue"],
		async () => {
			return await apiClient.get("/api/Customer/GetSubmittedCustomers");
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
		<DashboardLayout>
			{isLoading && (
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
			)}
			{isSuccess && (
				<>
					<section className=" w-11/12 mx-auto  py-8 px-12 bg-white rounded-[32px] shadow-sm">
						<form className="grid grid-cols-5 gap-6 items-center">
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
					</section>
					<section>
						<div className="my-12  mx-auto w-11/12 items-center">
							<div className="overflow-x-auto rounded-3xl  shadow-lg" dir="rtl">
								<table className="w-full table-auto ">
									<thead className="border-white text-right font-medium text-lg  bg-white">
										<tr>
											<th className="pr-12 pt-6 pb-4 font-semibold">
												إسم العميل
											</th>
											<th className="px-6 pt-6 pb-4 font-semibold">
												الرقم القومي
											</th>
											<th className="px-6 pt-6 pb-4 font-semibold">
												مسئول المبيعات
											</th>
											<th className="px-6 pt-6 pb-4 font-semibold">التوقيت</th>
											<th className="px-6 pt-6 pb-4 font-semibold">الحالة</th>
										</tr>
									</thead>
									<tbody>
										{data?.data?.data &&
											search(data?.data?.data).map((item) => {
												return <LoanRequestPreview key={item.id} {...item} />;
											})}
									</tbody>
								</table>
							</div>
							<div className="flex items-center justify-center w-full">
								<p className="mt-6 text-2xl">
									عدد الطلبات:{" "}
									<span className="font-bold">{data?.data?.data.length}</span>
								</p>
							</div>
						</div>
					</section>
				</>
			)}
		</DashboardLayout>
	);
};
export default RiskPendingCustomers;

const LoanRequestPreview = ({
	customerName,
	salesName,
	office,
	nationalID,
	id,
	status,
	...props
}) => {
	moment.locale("ar");
	const formatedDate = moment(props.submittedDate).format(
		"DD MMM  - h:mm:ss a"
	);
	return (
		<tr className="bg-white text-center text-[#6E7191]">
			<td className="  px-6 py-4 ">
				<div className="flex items-center">
					<div className="ml-4">{Person}</div>
					<p>{customerName}</p>
				</div>
			</td>
			<td className="px-6 py-4">
				<div className="flex items-center font-bold">
					<p>{nationalID}</p>
				</div>
			</td>

			<td className="px-6 py-4">
				<div className="flex items-center">
					<p>{salesName}</p>
				</div>
			</td>
			<td className="px-6 py-4">
				<div className="flex items-center">
					<p>{formatedDate}</p>
				</div>
			</td>
			<td className="px-6 py-4">
				<div className="flex items-center">
					<Link
						href={{
							pathname: "/risk/preview/customer/[id]",
							query: { id: id },
						}}
					>
						<button
							className={classNames(
								"py-4 px-8 rounded-full  flex-1 font-semibold ",
								status === "Updated Customer" && "bg-[#b3aea9] text-[#ffffff]",
								status === "Submitted Customer" && "bg-[#FFF8F2] text-[#FF7500]"
							)}
						>
							{status === "Updated Customer" && "تم التحديث"}
							{status === "Submitted Customer" && "انتظار"}
						</button>
					</Link>
				</div>
			</td>
		</tr>
	);
};

const Card = (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<rect
			x="2"
			y="5"
			width="20"
			height="15"
			rx="2"
			stroke="#14142B"
			strokeWidth="2"
		/>
		<path d="M1 10H23" stroke="#14142B" strokeWidth="2" />
	</svg>
);

const Person = (
	<svg
		width="80"
		height="80"
		viewBox="0 0 80 80"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<g filter="url(#filter0_d_1225_17558)">
			<circle cx="40" cy="34" r="30" fill="white" />
		</g>
		<path
			d="M53.0625 39.3125H45.7969L44.5375 38.8281H47.4496C48.0008 38.8281 48.5162 38.4789 48.659 37.9461C48.8751 37.1406 48.2653 36.4062 47.4922 36.4062C47.0911 36.4062 46.7656 36.0807 46.7656 35.6797C46.7656 35.2786 47.0911 34.9531 47.4922 34.9531H48.9027C49.4544 34.9531 49.9693 34.6039 50.1122 34.0711C50.3282 33.2656 49.7184 32.0469 48.9453 32.0469H48.7031C48.1679 32.0469 47.7344 31.6134 47.7344 31.0781C47.7344 30.5429 48.1679 30.1094 48.7031 30.1094H53.2621C53.8138 30.1094 54.3287 29.7601 54.4715 29.2273C54.6876 28.4218 54.0778 27.6875 53.3047 27.6875H52.5781C52.0429 27.6875 51.6094 27.254 51.6094 26.7188C51.6094 26.1835 52.0429 25.75 52.5781 25.75H53.5469C54.442 25.75 55.1545 24.93 54.9709 24.0038C54.8339 23.3146 54.1863 22.8438 53.4834 22.8438H48.4609C48.0599 22.8438 47.7344 22.5182 47.7344 22.1172C47.7344 21.7161 48.0599 21.3906 48.4609 21.3906H51.3246C51.8763 21.3906 52.3912 21.0414 52.534 20.5086C52.7501 19.7031 52.1403 18.9688 51.3672 18.9688H29.1286C28.5769 18.9688 28.062 19.318 27.9191 19.8508C27.703 20.6563 28.3129 21.3906 29.0859 21.3906C29.7549 21.3906 30.2969 21.9326 30.2969 22.6016C30.2969 23.2705 29.7549 23.8125 29.0859 23.8125H28.6442H27.3906C26.5914 23.8125 25.9375 24.4664 25.9375 25.2656C25.9375 26.0648 26.5914 26.7188 27.3906 26.7188H36.5938C36.7643 26.7188 36.9255 26.6834 37.0781 26.6291V32.0469H33.4879C32.9362 32.0469 32.4213 32.8805 32.2785 33.4133C32.1724 33.809 32.2668 34.1859 32.4809 34.4688H25.2109C24.542 34.4688 24 35.0108 24 35.6797C24 36.3486 24.542 36.8906 25.2109 36.8906H25.6953C26.3642 36.8906 26.9063 37.4326 26.9063 38.1016C26.9063 38.7705 26.3642 39.3125 25.6953 39.3125H25.4531C24.6505 39.3125 24 39.963 24 40.7656C24 41.5682 24.6505 42.2188 25.4531 42.2188H28.6016C29.2705 42.2188 29.8125 42.7608 29.8125 43.4297C29.8125 44.0986 29.2705 44.6406 28.6016 44.6406H27.875C27.0724 44.6406 26.4219 45.2911 26.4219 46.0938C26.4219 46.8964 27.0724 47.5469 27.875 47.5469H51.125C51.9276 47.5469 52.5781 46.8964 52.5781 46.0938C52.5781 45.2911 51.9276 44.6406 51.125 44.6406H50.8828C50.2139 44.6406 49.6719 44.0986 49.6719 43.4297C49.6719 42.7608 50.2139 42.2188 50.8828 42.2188H53.0625C53.8651 42.2188 54.5156 41.5682 54.5156 40.7656C54.5156 39.963 53.8651 39.3125 53.0625 39.3125ZM37.0781 35.9592L34.4625 34.9531H37.0781V35.9592Z"
			fill="url(#paint0_radial_1225_17558)"
		/>
		<path
			d="M40.2266 22.8438C37.3361 22.8438 34.5641 23.992 32.5202 26.0358C30.4763 28.0797 29.3281 30.8517 29.3281 33.7422C29.3281 36.6326 30.4763 39.4047 32.5202 41.4485C34.5641 43.4924 37.3361 44.6406 40.2266 44.6406C43.117 44.6406 45.8891 43.4924 47.9329 41.4485C49.9768 39.4047 51.125 36.6326 51.125 33.7422C51.125 30.8517 49.9768 28.0797 47.9329 26.0358C45.8891 23.992 43.117 22.8438 40.2266 22.8438Z"
			fill="url(#paint1_linear_1225_17558)"
		/>
		<path
			d="M50.1562 21.3906H35.625C31.0772 21.3906 27.3906 25.0772 27.3906 29.625V37.1328C27.3906 38.8717 28.8002 40.2812 30.5391 40.2812C32.278 40.2812 33.6875 38.8717 33.6875 37.1328V34.4688C33.6875 31.5262 36.073 29.1406 39.0156 29.1406H46.2812C49.4912 29.1406 52.0938 26.5381 52.0938 23.3281C52.0938 22.2581 51.2262 21.3906 50.1562 21.3906Z"
			fill="url(#paint2_linear_1225_17558)"
		/>
		<path
			d="M50.1562 33.9844C50.1562 35.0553 49.2897 35.9219 48.2188 35.9219C47.1478 35.9219 46.2812 35.0553 46.2812 33.9844C46.2812 32.9134 47.1478 32.0469 48.2188 32.0469C49.2897 32.0469 50.1562 32.9134 50.1562 33.9844Z"
			fill="#717171"
		/>
		<path
			d="M49.1875 33.9844C49.1875 34.5191 48.7535 34.9531 48.2188 34.9531C47.684 34.9531 47.25 34.5191 47.25 33.9844C47.25 33.4496 47.684 33.0156 48.2188 33.0156C48.7535 33.0156 49.1875 33.4496 49.1875 33.9844Z"
			fill="#595859"
		/>
		<path
			d="M48.2188 33.2578C48.2188 33.6589 47.8932 33.9844 47.4922 33.9844C47.0911 33.9844 46.7656 33.6589 46.7656 33.2578C46.7656 32.8567 47.0911 32.5312 47.4922 32.5312C47.8932 32.5312 48.2188 32.8567 48.2188 33.2578Z"
			fill="#9E9E9E"
		/>
		<path
			d="M47.2539 33.9413C47.329 33.9675 47.4079 33.9844 47.4917 33.9844C47.8928 33.9844 48.2183 33.6589 48.2183 33.2578C48.2183 33.1741 48.2013 33.0951 48.1752 33.02C47.6753 33.0423 47.2762 33.4414 47.2539 33.9413Z"
			fill="#8F8E8F"
		/>
		<path
			d="M43.375 33.9844C43.375 35.0553 42.5085 35.9219 41.4375 35.9219C40.3665 35.9219 39.5 35.0553 39.5 33.9844C39.5 32.9134 40.3665 32.0469 41.4375 32.0469C42.5085 32.0469 43.375 32.9134 43.375 33.9844Z"
			fill="#717171"
		/>
		<path
			d="M42.4062 33.9844C42.4062 34.5191 41.9722 34.9531 41.4375 34.9531C40.9028 34.9531 40.4688 34.5191 40.4688 33.9844C40.4688 33.4496 40.9028 33.0156 41.4375 33.0156C41.9722 33.0156 42.4062 33.4496 42.4062 33.9844Z"
			fill="#595859"
		/>
		<path
			d="M41.4375 33.2578C41.4375 33.6589 41.112 33.9844 40.7109 33.9844C40.3099 33.9844 39.9844 33.6589 39.9844 33.2578C39.9844 32.8567 40.3099 32.5312 40.7109 32.5312C41.112 32.5312 41.4375 32.8567 41.4375 33.2578Z"
			fill="#9E9E9E"
		/>
		<path
			d="M40.4727 33.9413C40.5477 33.9675 40.6267 33.9844 40.7105 33.9844C41.1115 33.9844 41.437 33.6589 41.437 33.2578C41.437 33.1741 41.4201 33.0951 41.3939 33.02C40.8941 33.0423 40.4949 33.4414 40.4727 33.9413Z"
			fill="#8F8E8F"
		/>
		<path
			d="M45.7969 37.8594H43.8594C43.593 37.8594 43.375 38.0773 43.375 38.3438C43.375 39.1464 44.0255 39.7969 44.8281 39.7969C45.6307 39.7969 46.2812 39.1464 46.2812 38.3438C46.2812 38.0773 46.0633 37.8594 45.7969 37.8594Z"
			fill="#717171"
		/>
		<defs>
			<filter
				id="filter0_d_1225_17558"
				x="0"
				y="0"
				width="80"
				height="80"
				filterUnits="userSpaceOnUse"
				colorInterpolationFilters="sRGB"
			>
				<feFlood floodOpacity="0" result="BackgroundImageFix" />
				<feColorMatrix
					in="SourceAlpha"
					type="matrix"
					values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
					result="hardAlpha"
				/>
				<feOffset dy="6" />
				<feGaussianBlur stdDeviation="5" />
				<feColorMatrix
					type="matrix"
					values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0"
				/>
				<feBlend
					mode="normal"
					in2="BackgroundImageFix"
					result="effect1_dropShadow_1225_17558"
				/>
				<feBlend
					mode="normal"
					in="SourceGraphic"
					in2="effect1_dropShadow_1225_17558"
					result="shape"
				/>
			</filter>
			<radialGradient
				id="paint0_radial_1225_17558"
				cx="0"
				cy="0"
				r="1"
				gradientUnits="userSpaceOnUse"
				gradientTransform="translate(39.4385 35.2287) scale(24.3452)"
			>
				<stop stopColor="#AFEEFF" />
				<stop offset="0.193" stopColor="#BBF1FF" />
				<stop offset="0.703" stopColor="#D7F8FF" />
				<stop offset="1" stopColor="#E1FAFF" />
			</radialGradient>
			<linearGradient
				id="paint1_linear_1225_17558"
				x1="40.2266"
				y1="44.6406"
				x2="40.2266"
				y2="22.8438"
				gradientUnits="userSpaceOnUse"
			>
				<stop stopColor="#FFC662" />
				<stop offset="0.004" stopColor="#FFC662" />
				<stop offset="0.609" stopColor="#FFC582" />
				<stop offset="1" stopColor="#FFC491" />
			</linearGradient>
			<linearGradient
				id="paint2_linear_1225_17558"
				x1="39.7422"
				y1="21.3906"
				x2="39.7422"
				y2="40.2812"
				gradientUnits="userSpaceOnUse"
			>
				<stop stopColor="#FF8B67" />
				<stop offset="0.847" stopColor="#FFA76A" />
				<stop offset="1" stopColor="#FFAD6B" />
			</linearGradient>
		</defs>
	</svg>
);

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
