import { Fragment, useState } from "react";
import { Listbox } from "@headlessui/react";
import apiClient from "../../../services/apiClient";
import { Loading } from "../Loading";
import { useQuery } from "@tanstack/react-query";
import { DropDownSearch } from "../../Atoms/FormInputs/DropDownSearch";

export const JobSectorDropDown = ({ jobSector, setJobSector }) => {
	const { isLoading, isError, isSuccess, data } = useQuery(
		["jobSectorLookup"],
		async () => {
			return await apiClient.get("/api/Lookup/GetLookupSector");
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
				<DropDownSearch
					onChange={(e) => setJobSector(e)}
					value={jobSector}
					title="نوع الوظيفة"
					placeholder="يرجي الإختيار"
					items={data?.data?.data}
				/>
			)}
		</>
	);
};
