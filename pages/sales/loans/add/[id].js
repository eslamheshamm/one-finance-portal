import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import AddLoanDynamclyForm from "../../../../src/Components/Sales/AddLoan/Dynamicly";
import DashboardLayout from "../../../../src/Components/Layout";
import { ClipLoader } from "react-spinners";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../../src/Utils/Services/apiClient";

const AddLoaDynamicPage = () => {
	const { data: session, status } = useSession();
	const router = useRouter();
	const { id } = router.query;
	const { isLoading, isError, isSuccess, data } = useQuery(
		["CustomerDetailsById", id],
		async () => {
			const res = await apiClient.get("/api/Customer/GetCustomerDetailsByID", {
				params: { CustomerID: id },
			});
			return res;
		},
		{
			enabled: id !== undefined ? true : false,
		}
	);
	return (
		<DashboardLayout>
			{isError && (
				<div className="h-full flex justify-center items-center py-32">
					<h2 className="text-2xl">عذراً يوجد مشكلة في الانترنت!</h2>
				</div>
			)}
			{isLoading && (
				<div className="h-full flex justify-center items-center py-32">
					<ClipLoader
						color={"#F9CD09"}
						loading={isLoading}
						size={48}
						aria-label="Loading Spinner"
					/>
				</div>
			)}
			{isSuccess && (
				<AddLoanDynamclyForm customerInfo={data.data.data} customerId={id} />
			)}
		</DashboardLayout>
	);
};
export default AddLoaDynamicPage;
