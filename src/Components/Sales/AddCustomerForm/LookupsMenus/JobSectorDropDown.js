import { useQuery } from "@tanstack/react-query";
import ClipLoader from "react-spinners/ClipLoader";
import apiClient from "../../../../Utils/Services/apiClient";
import { DropDownSearch } from "../../../Atoms/FormInputs/DropDownSearch";

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
