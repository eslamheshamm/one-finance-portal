import { Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import apiClient from "../../../services/apiClient";
import { Loading } from "../Loading";
import { useQuery } from "@tanstack/react-query";
import { Combobox } from "@headlessui/react";

export const AddressDropDown = ({ className }) => {
	const { isLoading, isError, isSuccess, data } = useQuery(
		["address"],
		async () => {
			return await apiClient.get("/api/Lookup/GetLookupAddress");
		}
	);
	const [govList, setGovList] = useState({
		name: "إختيار المحافظة",
		govID: -1,
		govs: [],
	});
	const [cityList, setCityList] = useState({
		name: "إختيار المدينة",
		cityID: -1,
		districtList: [],
	});
	const [districtList, setDistrictList] = useState({
		name: "إختيار المنطقة",
		districtID: -1,
		districtList: [],
	});

	const [query, setQuery] = useState("");
	const [selected, setSelected] = useState(govList);

	const filteredPeople =
		query === ""
			? data?.data.data.governorateList
			: data?.data.data.governorateList.filter((gov) => {
					return gov.name.toLowerCase().includes(query.toLowerCase());
			  });

	return (
		<div className={className}>
			{isLoading && (
				<div className="py-8">
					<Loading />
				</div>
			)}
			{isSuccess && (
				<div className="grid grid-cols-3  gap-6">
					<div className=" space-y-5">
						<label className="font-semibold">المحافظة</label>
						<Listbox
							value={govList}
							onChange={(e) => {
								setGovList(e);
								setCityList({
									name: "إختيار المدينة",
									cityID: -1,
									cityList: e.cityList,
								});
								setDistrictList({
									name: "إختيار المنطقة",
									districtID: -1,
									districtList: [],
								});
							}}
							name={"govList"}
						>
							<div className="relative ">
								<Listbox.Button
									className=" text-black  p-6 w-full rounded-full text-right   bg-[#DADADA36] bg-opacity-20"
									as={Fragment}
								>
									<button>{govList.name}</button>
								</Listbox.Button>
								<Listbox.Options className="absolute h-64 mt-2 w-full overflow-scroll rounded-2xl bg-white  text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
									{data.data.data.governorateList.map((gov) => (
										<Listbox.Option
											className={({ active }) =>
												`relative cursor-default select-none py-4 pl-10 pr-4 ${
													active
														? "bg-amber-100 text-amber-900"
														: "text-gray-900"
												}`
											}
											key={gov.govID}
											value={gov}
										>
											{gov.name}
										</Listbox.Option>
									))}
								</Listbox.Options>
							</div>
						</Listbox>
					</div>
					<div className=" space-y-5">
						<label className="font-semibold">المحافظة</label>
						<Combobox value={selected} onChange={setSelected}>
							<div className="relative mt-1">
								<div className="relative cursor-default overflow-hidden focus:border-0 focus:outline-none  sm:text-sm border-0">
									<Combobox.Input
										className="focus:border-none border-none focus:outline-none focus:ring-0 focus:outline-offset-0  p-6 w-full rounded-full text-right   bg-[#DADADA36] bg-opacity-20"
										displayValue={(person) => person.name}
										onChange={(event) => setQuery(event.target.value)}
									/>
									<Combobox.Button className="absolute inset-y-0 focus:outline-none focus:border-none left-0 flex items-center px-8">
										<svg
											width="24"
											height="25"
											viewBox="0 0 24 25"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M12 -5.25042e-07C18.6274 -2.35069e-07 24 5.38413 24 12.0115V12.0115C24 18.639 18.6274 24.0231 12 24.0231V24.0231C5.37258 24.0231 -1.17158e-06 18.639 -8.82165e-07 12.0115V12.0115C-5.9275e-07 5.38413 5.37258 -8.15014e-07 12 -5.25042e-07V-5.25042e-07Z"
												fill="#9E9E9E"
											/>
											<path
												d="M15 10.7246L12.0158 13.7117L9.03157 10.7246"
												stroke="white"
												strokeWidth="1.5"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</svg>
									</Combobox.Button>
								</div>
								<Transition
									as={Fragment}
									leave="transition ease-in duration-100"
									leaveFrom="opacity-100"
									leaveTo="opacity-0"
									afterLeave={() => setQuery("")}
								>
									<Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
										{filteredPeople.length === 0 && query !== "" ? (
											<div className="relative cursor-default select-none py-2 px-4 text-gray-700">
												لا يوجد شيء
											</div>
										) : (
											filteredPeople.map((person) => (
												<Combobox.Option
													key={person.id}
													className={({ active }) =>
														`relative cursor-default select-none py-2 pl-10 pr-4 ${
															active
																? "bg-amber-100 text-amber-900"
																: "text-gray-900"
														}`
													}
													value={person}
												>
													{({ selected, active }) => (
														<>
															<span
																className={`block truncate ${
																	selected ? "font-medium" : "font-normal"
																}`}
															>
																{person.name}
															</span>
															{selected ? (
																<span
																	className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
																		active ? "text-white" : "text-teal-600"
																	}`}
																></span>
															) : null}
														</>
													)}
												</Combobox.Option>
											))
										)}
									</Combobox.Options>
								</Transition>
							</div>
						</Combobox>
					</div>
					{/* city*/}
					<div className=" space-y-5">
						<label htmlFor="product" className="font-semibold">
							المدينة
						</label>
						<Listbox
							value={cityList}
							onChange={(e) => {
								setCityList(e);
								setDistrictList({
									name: "إختيار المنطقة",
									districtID: -1,
									districtList: e.districtList,
								});
							}}
							disabled={govList.govID === -1}
						>
							<div className="relative ">
								<Listbox.Button
									className=" text-black  p-6 w-full rounded-full text-right   bg-[#DADADA36] bg-opacity-20"
									as={Fragment}
									disabled={govList.govID === -1}
								>
									<button>{cityList.name}</button>
								</Listbox.Button>
								<Listbox.Options className="absolute mt-2 w-full overflow-auto rounded-2xl bg-white  text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
									{govList.cityList &&
										govList.cityList.map((city) => {
											return (
												<Listbox.Option
													className={({ active }) =>
														`relative cursor-default select-none py-4 pl-10 pr-4 ${
															active
																? "bg-amber-100 text-amber-900"
																: "text-gray-900"
														}`
													}
													key={city.cityID}
													value={city}
													disabled={govList.govID === -1}
												>
													{city.name}
												</Listbox.Option>
											);
										})}
								</Listbox.Options>
							</div>
						</Listbox>
					</div>
					<div className=" space-y-5">
						<label htmlFor="product" className="font-semibold">
							المنطقة
						</label>
						<Listbox
							value={districtList}
							onChange={(e) => {
								setDistrictList(e);
							}}
							disabled={cityList.cityID === -1 || govList.govID === -1}
						>
							<div className="relative ">
								<Listbox.Button
									className=" text-black  p-6 w-full rounded-full text-right   bg-[#DADADA36] bg-opacity-20"
									as={Fragment}
								>
									<button>{districtList.name}</button>
								</Listbox.Button>
								<Listbox.Options className="absolute mt-2 w-full overflow-auto rounded-2xl bg-white  text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
									{cityList.districtList &&
										cityList.districtList.map((district) => {
											return (
												<Listbox.Option
													className={({ active }) =>
														`relative cursor-default select-none py-4 pl-10 pr-4 ${
															active
																? "bg-amber-100 text-amber-900"
																: "text-gray-900"
														}`
													}
													key={district.districtID}
													value={district}
													disabled={
														cityList.cityID === -1 || govList.govID === -1
													}
												>
													{district.name}
												</Listbox.Option>
											);
										})}
								</Listbox.Options>
							</div>
						</Listbox>
					</div>
				</div>
			)}
		</div>
	);
};
