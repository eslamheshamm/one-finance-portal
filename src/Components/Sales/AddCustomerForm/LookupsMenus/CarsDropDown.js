import { useQuery } from "@tanstack/react-query";
import ClipLoader from "react-spinners/ClipLoader";

import apiClient from "../../../../Utils/Services/apiClient";
import { DropDownSearch } from "../../../Atoms/FormInputs/DropDownSearch";

export const CarsDropDown = ({
	carsList,
	setCarsList,
	carsModel,
	setCarModel,
}) => {
	const { isLoading, isError, isSuccess, data } = useQuery(
		["carsLookup"],
		async () => {
			return await apiClient.get("/api/Lookup/GetLookupVehicle");
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
						onChange={(e) => {
							setCarsList(e);
							setCarModel({
								name: "إختيار موديل السيارة",
								vehicleModelID: -1,
							});
						}}
						value={carsList}
						items={data?.data?.data?.vehicleList}
						title="نوع السيارة"
						placeholder="يرجي الإختيار"
					/>
					<DropDownSearch
						onChange={(e) => setCarModel(e)}
						value={carsModel}
						items={carsList.vehicleModelList}
						title="موديل السيارة"
						placeholder="يرجي الإختيار"
						disabled={
							carsList.vehicleModelList.length === 0 ||
							carsList.vehicleID === -1
						}
					/>
				</>
			)}
		</>
	);
};
