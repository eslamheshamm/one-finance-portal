import { useQuery } from "@tanstack/react-query";
import ClipLoader from "react-spinners/ClipLoader";
import apiClient from "../../../../Utils/Services/apiClient";
import { DropDownSearch } from "../../../Atoms/FormInputs/DropDownSearch";

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
					<ClipLoader
						color={"black"}
						loading={isLoading}
						size={48}
						aria-label="Loading Spinner"
					/>
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
