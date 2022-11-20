import { Fragment } from "react";
import { Listbox } from "@headlessui/react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../../Utils/Services/apiClient";
import ClipLoader from "react-spinners/ClipLoader";

export const OwnHomeDropDown = ({ home, setHome }) => {
	const { isLoading, isError, isSuccess, data } = useQuery(
		["firstHomeLookup"],
		async () => {
			return await apiClient.get("/api/Lookup/GetLookupOwnershipHome");
		}
	);

	return (
		<>
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
				<>
					<div className=" space-y-5">
						<label className="font-semibold">ملكية المنزل</label>
						<Listbox value={home} onChange={setHome} name={"jobSector"}>
							<div className="relative ">
								<Listbox.Button
									className=" text-black  p-6 w-full rounded-full text-right   bg-[#DADADA36] bg-opacity-20"
									as={Fragment}
								>
									<button>{home.status}</button>
								</Listbox.Button>
								<Listbox.Options className="absolute mt-2 w-full overflow-auto  rounded-2xl bg-white  text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
									{data?.data?.data?.map((club) => (
										<Listbox.Option
											className={({ active }) =>
												`relative cursor-default select-none py-4 pl-10 pr-4  ${
													active
														? "bg-amber-100 text-amber-900"
														: "text-gray-900"
												}`
											}
											key={club.ownershipHomeID}
											value={club}
										>
											{club.status}
										</Listbox.Option>
									))}
								</Listbox.Options>
							</div>
						</Listbox>
					</div>
				</>
			)}
		</>
	);
};
