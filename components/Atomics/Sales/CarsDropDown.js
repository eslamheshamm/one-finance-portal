import { Fragment, useEffect, useState } from "react";
import { Listbox } from "@headlessui/react";
import apiClient from "../../../services/apiClient";
import { Loading } from "../Loading";
import { useQuery } from "@tanstack/react-query";
import { Combobox } from "@headlessui/react";
const cars = [
	{
		vehicleID: 1,
		name: "فيات",
		vehicleModelList: [
			{
				vehicleModelID: 1,
				name: "تيبو",
			},
			{
				vehicleModelID: 2,
				name: "E500",
			},
		],
	},
	{
		vehicleID: 2,
		name: "رينو",
		vehicleModelList: [
			{
				vehicleModelID: 3,
				name: "لوجان",
			},
			{
				vehicleModelID: 4,
				name: "ميجان",
			},
		],
	},
];
export const CarsDropDown = ({ className }) => {
	const { isLoading, isError, isSuccess, data } = useQuery(
		["cars"],
		async () => {
			return await apiClient.get("/api/Lookup/GetLookupVehicle");
		}
	);
	console.log(data, "data");

	const [carsList, setCarsList] = useState({
		name: "إختيار نوع السيارة",
		vehicleID: -1,
		vehicleModelList: [],
	});
	const [carsModel, setCarModel] = useState({
		name: "إختيار موديل السيارة",
		vehicleModelID: -1,
	});

	return (
		<>
			{isLoading && (
				<div className="py-8">
					<Loading />
				</div>
			)}
			{isSuccess && (
				<>
					<div className=" space-y-5">
						<label className="font-semibold">نوع السيارة</label>
						<Listbox value={carsList} onChange={setCarsList} name={"carsList"}>
							<div className="relative ">
								<Listbox.Button
									className=" text-black  p-6 w-full rounded-full text-right   bg-[#DADADA36] bg-opacity-20"
									as={Fragment}
								>
									<button>{carsList.name}</button>
								</Listbox.Button>
								<Listbox.Options className="absolute h-40 mt-2 w-full overflow-scroll rounded-2xl bg-white  text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
									{data.data.data.vehicleList.map((car) => (
										<Listbox.Option
											className={({ active }) =>
												`relative cursor-default select-none py-4 pl-10 pr-4 ${
													active
														? "bg-amber-100 text-amber-900"
														: "text-gray-900"
												}`
											}
											key={car.vehicleID}
											value={car}
										>
											{car.name}
										</Listbox.Option>
									))}
								</Listbox.Options>
							</div>
						</Listbox>
					</div>
					<div className=" space-y-5">
						<label htmlFor="product" className="font-semibold">
							موديل السيارة
						</label>
						<Listbox
							value={carsModel}
							onChange={(e) => {
								setCarModel(e);
							}}
						>
							<div className="relative ">
								<Listbox.Button
									className=" text-black  p-6 w-full rounded-full text-right   bg-[#DADADA36] bg-opacity-20"
									as={Fragment}
									disabled={carsList.vehicleID === -1}
								>
									<button>{carsModel.name}</button>
								</Listbox.Button>
								<Listbox.Options className="absolute mt-2 w-full overflow-scroll rounded-2xl bg-white  text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
									{carsList.vehicleModelList &&
										carsList.vehicleModelList.map((city) => {
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
													disabled={carsList.vehicleID === -1}
												>
													{city.name}
												</Listbox.Option>
											);
										})}
								</Listbox.Options>
							</div>
						</Listbox>
					</div>
				</>
			)}
		</>
	);
};
