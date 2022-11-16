import ActiveLink from "../../components/Atomics/ActiveLink";
import DashboardLayout from "../../components/Dashboard/Layout";
import AddLoanForm from "../../components/Forms/AddLoan";
const AddLoanPage = () => {
	return (
		<DashboardLayout>
			<section className="w-10/12 mx-auto flex justify-center mb-10 ">
				<div className=" rounded-full shadow-lg flex bg-white">
					<ActiveLink
						activeClassName="  bg-[#EDAA00] text-white"
						className=" rounded-ful  "
						href="/loans/add"
					>
						<a className="py-5 px-36 rounded-full text-xl ">إضافة تمويل</a>
					</ActiveLink>
					<ActiveLink
						activeClassName=" bg-[#EDAA00] text-white"
						className=" rounded-full"
						href="/loans/queue"
					>
						<a className="py-5 px-36 rounded-full text-xl bg-white">
							جدول التمويلات
						</a>
					</ActiveLink>
				</div>
			</section>
			<AddLoanForm />
		</DashboardLayout>
	);
};
export default AddLoanPage;
