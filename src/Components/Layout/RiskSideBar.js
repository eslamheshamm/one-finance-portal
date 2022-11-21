import { SideBarAccordion } from "../Atoms/Accordion";
import ActiveLink from "../Atoms/ActiveLink";

export const RiskSideBar = () => {
	const riskRoutes = {
		customer: {
			title: "العملاء",
			icon: CustomersIcon,
			routes: [
				{
					title: "الطلبات الجديدة",
					route: "/risk/customers/queue",
				},
			],
		},
		loan: {
			title: "التمويلات",
			Icon: LoansIcon,
			routes: [
				{
					title: "الطلبات الجديدة",
					route: "/risk/loans/queue",
				},
				{
					title: "الطلبات المكتملة",
					route: "/risk/loans/completed",
				},
				{
					title: "الطلبات المقبولة",
					route: "/risk/loans/approved",
				},
				{
					title: "الطلبات المرفوضة",
					route: "/risk/loans/rejected",
				},
			],
		},
	};
	return (
		<ul className="w-full  space-y-4 flex flex-col  mt-8">
			<li className="w-full text-xl text-white">
				{Object.values(riskRoutes).map((tab, idx) => {
					{
						return (
							<SideBarAccordion
								key={idx}
								title={tab.title}
								icon={CustomersIcon}
								content={
									<ul className="flex flex-col gap-4">
										{tab.routes.map((route, idx) => {
											return (
												<ActiveLink
													activeClassName="text-"
													href={route.route}
													key={idx}
												>
													<a className=" text-xl ">{route.title}</a>
												</ActiveLink>
											);
										})}
									</ul>
								}
							/>
						);
					}
				})}
			</li>
		</ul>
	);
};
