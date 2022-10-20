import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import DashboardLayout from "../../components/Dashboard/Layout";
import AddCustomerForm from "../../components/Forms/AddCustomer";

const AddCustomerPage = () => {
	const { data: session, status } = useSession();
	const router = useRouter();

	return (
		<DashboardLayout>
			<AddCustomerForm />
		</DashboardLayout>
	);
};
export default AddCustomerPage;
