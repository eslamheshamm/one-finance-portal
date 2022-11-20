import { SideBarAccordion } from "../Atoms/Accordion";
import ActiveLink from "../Atoms/ActiveLink";

export const RiskSideBar = () => {
	return (
		<ul className="w-full  space-y-6 flex flex-col  mt-10 ">
			<li className="w-full text-xl ">
				<SideBarAccordion
					title="العملاء"
					content={
						<>
							<ul className="flex flex-col space-y-4">
								<li className="w-full text-xl">
									<ActiveLink
										activeClassName=" font-semibold"
										href="/risk/customers/queue"
									>
										<a className=" text-xl  text-[#999999]">الطلبات الجديدة</a>
									</ActiveLink>
								</li>
							</ul>
						</>
					}
				/>
			</li>

			<li className="w-full text-xl ">
				<SideBarAccordion
					title="التمويلات"
					content={
						<>
							<ul className="flex flex-col space-y-3 text-white">
								<li className="w-full text-xl">
									<ActiveLink
										activeClassName="text-black  font-semibold"
										href="/risk/loans/queue"
									>
										<a className=" text-xl  text-[#999999]">الطلبات الجديدة</a>
									</ActiveLink>
								</li>
								<li className="w-full text-xl">
									<ActiveLink
										activeClassName="text-black  font-semibold"
										href="/risk/loans/completed"
									>
										<a className=" text-xl  text-[#999999]">الطلبات المكتملة</a>
									</ActiveLink>
								</li>
								<li className="w-full text-xl">
									<ActiveLink
										activeClassName="text-black  font-semibold"
										href="/risk/loans/approved"
									>
										<a className=" text-xl  text-[#999999]">الطلبات المقبولة</a>
									</ActiveLink>
								</li>
								<li className="w-full text-xl">
									<ActiveLink
										activeClassName="text-black  font-semibold"
										href="/risk/loans/rejected"
									>
										<a className=" text-xl  text-[#999999]">الطلبات المرفوضة</a>
									</ActiveLink>
								</li>
							</ul>
						</>
					}
				/>
			</li>
		</ul>
	);
};
