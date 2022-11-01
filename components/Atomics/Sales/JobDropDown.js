import { Fragment, useEffect, useState } from "react";
import { Listbox } from "@headlessui/react";
import apiClient from "../../../services/apiClient";
import { Loading } from "../Loading";
import { useQuery } from "@tanstack/react-query";
import { Combobox } from "@headlessui/react";
import { DropDownSearch } from "../../Atoms/FormInputs/DropDownSearch";

export const JobDropDown = ({ jobsList, setJobsList }) => {
	const { isLoading, isError, isSuccess, data } = useQuery(
		["jobsLookup"],
		async () => {
			return await apiClient.get("/api/Lookup/GetLookupJob");
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
					onChange={(e) => setJobsList(e)}
					value={jobsList}
					title="الوظيفة"
					placeholder="يرجي الإختيار"
					items={data?.data?.data}
				/>
			)}
		</>
	);
};
