import { Fragment, useState } from "react";
import { Listbox } from "@headlessui/react";
import apiClient from "../../../services/apiClient";
import { Loading } from "../Loading";
import { useQuery } from "@tanstack/react-query";
import { DropDownSearch } from "../../Atoms/FormInputs/DropDownSearch";

export const ClubsDropDown = ({ clubsList, setClubsList }) => {
	const { isLoading, isError, isSuccess, data } = useQuery(
		["clubsLookup"],
		async () => {
			return await apiClient.get("/api/Lookup/GetLookupClub");
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
					<DropDownSearch
						onChange={(e) => setClubsList(e)}
						value={clubsList}
						items={data?.data?.data}
						title="النادي"
						placeholder="يرجي الإختيار"
					/>
				</>
			)}
		</>
	);
};
