import { Fragment } from "react";
import { Listbox } from "@headlessui/react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../../Utils/Services/apiClient";
import ClipLoader from "react-spinners/ClipLoader";
import { CustomDropDown } from "../../../Atoms/FormInputs/DropDown";

export const OwnHomeDropDown = ({ home, setHome, homeType, setHomeType }) => {
	const { isLoading, isError, isSuccess, data } = useQuery(
		["firstHomeLookup"],
		async () => {
			return await apiClient.get("/api/Lookup/GetLookupOwnershipHome");
		}
	);
	const {
		isLoading: loadingHomeStatus,
		isError: errorHomeStatus,
		isSuccess: succesHomeStatus,
		data: dataHomeStatus,
	} = useQuery(["homeOwenerShipStatues"], async () => {
		return await apiClient.get("/api/Lookup/GetLookupResidencyType");
	});

	return (
		<div className="grid grid-cols-2 gap-6">
			{isLoading && (
				<div className="py-8">
					<ClipLoader
						color={"black"}
						loading={isLoading}
						size={48}
						aria-label="Loading Spinner"
					/>
				</div>
			)}
			{isSuccess && (
				<CustomDropDown
					option={home}
					selectOption={setHome}
					items={data?.data?.data}
					btnName={home.status}
					label="ملكية المنزل"
					// icon={Arrow}
					className=" text-black  p-6 w-full rounded-full text-right   bg-[#DADADA36] bg-opacity-20"
				/>
			)}
			{loadingHomeStatus && (
				<div className="py-8">
					<ClipLoader
						color={"black"}
						loading={isLoading}
						size={48}
						aria-label="Loading Spinner"
					/>
				</div>
			)}
			{succesHomeStatus && (
				<>
					<div className=" space-y-5 flex flex-col">
						<label className="font-semibold">نوع ملكية المنزل</label>
						<Listbox value={homeType} onChange={setHomeType} name={"jobSector"}>
							<div className="relative ">
								<Listbox.Button
									className=" text-black  p-6 w-full rounded-full text-right   bg-[#DADADA36] bg-opacity-20"
									as={Fragment}
								>
									<button>{homeType.residencyTypeStatus}</button>
								</Listbox.Button>
								<Listbox.Options className="absolute mt-2 w-full overflow-auto  rounded-2xl bg-white  text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
									{dataHomeStatus?.data?.data?.map((item) => (
										<Listbox.Option
											className={({ active }) =>
												`relative cursor-default select-none py-4 pl-10 pr-4  z-50 bg-white ${
													active
														? "bg-amber-100 text-amber-900"
														: "text-gray-900"
												}`
											}
											key={item.residencyTypeID}
											value={item}
										>
											{item.residencyTypeStatus}
										</Listbox.Option>
									))}
								</Listbox.Options>
							</div>
						</Listbox>
					</div>
				</>
			)}
		</div>
	);
};
