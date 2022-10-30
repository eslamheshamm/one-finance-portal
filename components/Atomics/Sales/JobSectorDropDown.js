import { Fragment, useState } from "react";
import { Listbox } from "@headlessui/react";
import apiClient from "../../../services/apiClient";
import { Loading } from "../Loading";
import { useQuery } from "@tanstack/react-query";

export const JobSectorDropDown = () => {
	const { isLoading, isError, isSuccess, data } = useQuery(
		["jobSector"],
		async () => {
			return await apiClient.get("/api/Lookup/GetLookupSector");
		}
	);
	const [jobSector, setJobSector] = useState({
		name: "إختيار نوع الوظيفة",
		clubID: -1,
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
						<label className="font-semibold">نوع الوظيفة</label>
						<Listbox
							value={jobSector}
							onChange={setJobSector}
							name={"jobSector"}
						>
							<div className="relative ">
								<Listbox.Button
									className=" text-black  p-6 w-full rounded-full text-right   bg-[#DADADA36] bg-opacity-20"
									as={Fragment}
								>
									<button>{jobSector.name}</button>
								</Listbox.Button>
								<Listbox.Options className="absolute h-64 mt-2 w-full overflow-scroll rounded-2xl bg-white  text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
									{data?.data?.data?.map((club, idx) => (
										<Listbox.Option
											className={({ active }) =>
												`relative cursor-default select-none py-4 pl-10 pr-4 ${
													active
														? "bg-amber-100 text-amber-900"
														: "text-gray-900"
												}`
											}
											key={idx++}
											value={club}
										>
											{club.name}
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
