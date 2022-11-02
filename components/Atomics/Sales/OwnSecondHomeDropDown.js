import { Fragment, useState } from "react";
import { Listbox } from "@headlessui/react";
import apiClient from "../../../services/apiClient";
import { Loading } from "../Loading";
import { useQuery } from "@tanstack/react-query";

export const OwnSecondHomeDropDown = ({ secondHome, setSecondHome }) => {
	const { isLoading, isError, isSuccess, data } = useQuery(
		["secondHomeLookup"],
		async () => {
			return await apiClient.get("/api/Lookup/GetLookupSecondHome");
		}
	);

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
						<label className="font-semibold">ملكية المنزل الثاني</label>
						<Listbox value={secondHome} onChange={setSecondHome}>
							<div className="relative z-10">
								<Listbox.Button
									className=" text-black z-10 p-6 w-full rounded-full text-right   bg-[#DADADA36] bg-opacity-20"
									as={Fragment}
								>
									<button>{secondHome.status}</button>
								</Listbox.Button>
								<Listbox.Options className="absolute mt-2 w-full  overflow-auto rounded-2xl bg-white  text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
									{data?.data?.data?.map((club) => (
										<Listbox.Option
											className={({ active }) =>
												`relative cursor-default select-none py-4 pl-10 pr-4  ${
													active
														? "bg-amber-100 text-amber-900"
														: "text-gray-900"
												}`
											}
											key={club.secondHomeID}
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
