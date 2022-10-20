import { Fragment, useEffect, useState } from "react";
import { Listbox } from "@headlessui/react";
import apiClient from "../../../services/apiClient";
import { Loading } from "../Loading";
import { useQuery } from "@tanstack/react-query";

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
