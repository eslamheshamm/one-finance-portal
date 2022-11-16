import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import DashboardLayout from "../../../../components/Dashboard/Layout";
import AddLoanDynamclyForm from "../../../../components/Forms/AddLoan/Dynamicly";

const CityClubSalesPage = () => {
	const { data: session, status } = useSession();
	const router = useRouter();
	const { id } = router.query;
	const customerId = id;

	// if (
	// 	status === "unauthenticated" ||
	// 	!session ||
	// 	!session.user ||
	// 	session.user.roleId !== 4
	// ) {
	// 	return (
	// 		<DashboardLayout>
	// 			<div className="h-full w-10/12 mx-auto flex justify-center ">
	// 				<h2 className="font-bold text-3xl ">
	// 					ليس لك الصلاحية للدخول علي هذه الصفحة!
	// 				</h2>
	// 			</div>
	// 		</DashboardLayout>
	// 	);
	// }

	return (
		<DashboardLayout>
			<AddLoanDynamclyForm customerId={customerId} />
		</DashboardLayout>
	);
};
export default CityClubSalesPage;
