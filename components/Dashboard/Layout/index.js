import React, { useRef, useState } from "react";
import classNames from "classnames";
import { useSession } from "next-auth/react";
import { Logo } from "../../Atomics/Logo";
import { RiskSideBar } from "./RiskSideBar";
import { SaleSideBar } from "./SaleSideBar";
import { useRouter } from "next/router";
import UserMenu from "../../Atomics/User/UserMenu";
import Sidebar from "./SideBar";
import { motion, useSpring } from "framer-motion";
import { Spin as Hamburger } from "hamburger-react";
import useOnClickOutside from "../../../hooks/useOutsideWrapper";

const DashboardLayout = ({ children, lang = "ar" }) => {
	const { data: session, status } = useSession();
	const router = useRouter();
	const [isOpen, setOpen] = useState(false);
	const x = useSpring(0, { stiffness: 400, damping: 40 });
	const sideBarRef = useRef();

	if (status === "unauthenticated") {
		router.push("/login");
		return (
			<div className="min-h-screen flex justify-center items-center ">
				<svg
					role="status"
					className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
					viewBox="0 0 100 101"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
						fill="currentColor"
					/>
					<path
						d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
						fill="currentFill"
					/>
				</svg>
			</div>
		);
	}
	if (status === "loading") {
		return (
			<div className="min-h-screen flex justify-center items-center ">
				<svg
					role="status"
					className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
					viewBox="0 0 100 101"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
						fill="currentColor"
					/>
					<path
						d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
						fill="currentFill"
					/>
				</svg>
			</div>
		);
	}

	return (
		<div
			dir={lang === "ar" ? "rtl" : "ltr"}
			className={classNames(
				` min-h-screen justify-between flex flex-col  relative bg-[#F8F8F8]`,
				lang === "ar" ? "font-Cairo" : "font-Poppins"
			)}
		>
			<header className=" py-8 mb-8 bg-white shadow-sm">
				<nav className=" w-10/12 mx-auto flex justify-between">
					<div className="flex items-center gap-6 relative ">
						<div className=" relative">
							<motion.button className="text-white   p-2 rounded-full bg-gray-800 z-[9999999999999] relative flex items-center justify-center h-full">
								<Hamburger
									onToggle={() => {
										setOpen(!isOpen);
										isOpen ? x.set(400) : x.set(0);
									}}
									toggled={isOpen}
									size={32}
								/>
							</motion.button>
						</div>
						<Logo />
					</div>
					<UserMenu />
				</nav>
				<motion.div
					transition={{
						type: "spring",
						stiffness: 400,
						damping: 40,
					}}
					initial={{ x: 400 }}
					style={{ x }}
					className="w-[400px] right-0 fixed  top-0 h-screen z-50"
					dir="ltr"
					ref={sideBarRef}
				>
					<div className="shadow-md h-full w-full bg-gray-900  z-50">
						<div className="w-full h-full p-12 flex flex-col z-50 pt-32   justify-between ">
							<ul dir="rtl">
								{session && session.user.data.roleID === 4 && <SaleSideBar />}
								{session && session.user.data.roleID === 14 && <RiskSideBar />}
							</ul>
						</div>
					</div>
				</motion.div>
			</header>
			<main className={classNames("w-10/12 mx-auto pb-32")}>{children}</main>
		</div>
	);
};
export default DashboardLayout;
