// import { useSession } from "next-auth/react";
// import { useRouter } from "next/router";

import DashboardLayout from "../../../src/Components/Layout";
import AddCustomerForm from "../../../src/Components/Sales/AddCustomerForm";

const AddCustomerPage = () => {
	// const { data: session, status } = useSession();
	// const router = useRouter();

	return (
		<DashboardLayout>
			<AddCustomerForm />
		</DashboardLayout>
	);
};
export default AddCustomerPage;
