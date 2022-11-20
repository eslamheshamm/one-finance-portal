import { useQuery } from "@tanstack/react-query";
import ClipLoader from "react-spinners/ClipLoader";
import apiClient from "../../../../Utils/Services/apiClient";
import { DropDownSearch } from "../../../Atoms/FormInputs/DropDownSearch";

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
					<ClipLoader
						color={"black"}
						loading={isLoading}
						size={48}
						aria-label="Loading Spinner"
					/>{" "}
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
