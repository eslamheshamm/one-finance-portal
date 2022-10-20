import { useSession } from "next-auth/react";
import { Fragment, useState } from "react";
import { Menu, Transition, Dialog } from "@headlessui/react";
import { signOut } from "next-auth/react";

export default function UserMenu() {
	const { data: session, status } = useSession();
	return (
		<>
			<Menu as="div" className="relative z-50">
				<div>
					<Menu.Button className="flex items-center  text-left  pt-6  rounded-2xl ">
						<Arrow className="ml-5" />
						<div className="">
							<div className="flex font-bold SP">
								<p className="ml-2">{session.user.data.name}</p>
							</div>
							<p className="text-[#EDAA00]">
								{session.user.data.roleID === 4 && "Sales Team"}
								{session.user.data.roleID === 14 && "Risk Team"}
								{session.user.data.roleID === 17 && "Finance Team"}
								{session.user.data.roleID === 10 && "Risk Manager"}
							</p>
						</div>
						<img
							src="https://picsum.photos/200"
							className="w-8 h-8 rounded-full mr-5"
						/>
					</Menu.Button>
				</div>
				<Transition
					as={Fragment}
					enter="transition ease-out duration-100"
					enterFrom="transform opacity-0 scale-95"
					enterTo="transform opacity-100 scale-100"
					leave="transition ease-in duration-75"
					leaveFrom="transform opacity-100 scale-100"
					leaveTo="transform opacity-0 scale-95"
				>
					<Menu.Items className="absolute left-0 mt-2 w-64 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-sm  focus:outline-none">
						<div className="py-3 px-2 ">
							<Menu.Item>
								{({ active }) => (
									<button
										className={`${
											active ? "bg-[#EDAA00] text-white" : "text-[#EDAA00]"
										} group flex w-full items-center rounded-md px-2 py-2 `}
									>
										الصفحة الشخصية
									</button>
								)}
							</Menu.Item>
						</div>
						<div className="py-3 px-2 ">
							<Menu.Item>
								{({ active }) => (
									<button
										onClick={() => {
											signOut({
												//  callbackUrl: `/` // dev
												// callbackUrl: `http://192.168.100.2:3000/`, //prod
												redirect: false,
											});
										}}
										className={`${
											active ? "bg-[#EDAA00] text-white" : "text-[#EDAA00]"
										} group flex w-full items-center rounded-md px-2 py-2 `}
									>
										تسجيل خروج
									</button>
								)}
							</Menu.Item>
						</div>
					</Menu.Items>
				</Transition>
			</Menu>
		</>
	);
}
function Arrow(props) {
	return (
		<svg
			{...props}
			width="16"
			height="9"
			viewBox="0 0 16 9"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M14.9258 1L7.96261 7.96317L0.999439 1"
				stroke="#EDAA00"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
