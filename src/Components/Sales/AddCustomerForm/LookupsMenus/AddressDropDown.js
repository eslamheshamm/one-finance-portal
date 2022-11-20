import { useQuery } from "@tanstack/react-query";
import ClipLoader from "react-spinners/ClipLoader";

import apiClient from "../../../../Utils/Services/apiClient";
import { DropDownSearch } from "../../../Atoms/FormInputs/DropDownSearch";

export const AddressDropDown = ({
	govList,
	setGovList,
	cityList,
	setCityList,
	districtList,
	setDistrictList,
}) => {
	const { isLoading, isError, isSuccess, data } = useQuery(
		["addressLookups"],
		async () => {
			return await apiClient.get("/api/Lookup/GetLookupAddress");
		}
	);
	console.log(data, "data");
	return (
		<div>
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
			{isError && (
				<div className="py-8">
					<h2>لقد حدث خطأ في تحميل البيانات!!</h2>
				</div>
			)}
			{isSuccess && (
				<div className="grid grid-cols-3  gap-6">
					<DropDownSearch
						value={govList}
						onChange={(e) => {
							setGovList(e);
							setCityList({
								name: "",
								cityID: -1,
								cityList: e.cityList,
							});
						}}
						items={data?.data?.data?.governorateList}
						title="المحافظة"
						placeholder="إختيار المحافظة"
					/>

					<DropDownSearch
						onChange={(e) => {
							setCityList(e);
							setDistrictList({
								name: "إختيار المنطقة",
								districtID: -1,
								districtList: e.districtList,
							});
						}}
						value={cityList}
						title="المدينة"
						disabled={govList.govID === -1}
						placeholder="إختيار المدينة"
						items={govList.cityList}
					/>
					<DropDownSearch
						value={districtList}
						onChange={(e) => {
							setDistrictList(e);
						}}
						title="المنطقة"
						items={cityList.districtList}
						placeholder="إختيار المنطقة"
						disabled={cityList.cityID === -1 || govList.govID === -1}
					/>
				</div>
			)}
		</div>
	);
};
