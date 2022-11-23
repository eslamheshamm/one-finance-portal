import React, { useRef, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import ClipLoader from "react-spinners/ClipLoader";

import classNames from "classnames";

import { motion, useSpring } from "framer-motion";
import { Spin as Hamburger } from "hamburger-react";
import Image from "next/image";

import { RiskSideBar } from "./RiskSideBar";
import { SaleSideBar } from "./SaleSideBar";
import UserMenu from "./UserMenu";
import Head from "next/head";

const DashboardLayout = ({ title, children, lang = "ar" }) => {
	const { data: session, status } = useSession();
	const router = useRouter();
	const [isOpen, setOpen] = useState(false);
	const x = useSpring(0, { stiffness: 400, damping: 40 });
	const sideBarRef = useRef();

	if (status === "unauthenticated") {
		router.push("/login");
		return (
			<div className="min-h-screen flex justify-center items-center ">
				<ClipLoader color={"#F9CD09"} size={48} aria-label="Loading Spinner" />
			</div>
		);
	}
	if (status === "loading") {
		return (
			<div className="min-h-screen flex justify-center items-center ">
				<ClipLoader color={"#F9CD09"} size={48} aria-label="Loading Spinner" />
			</div>
		);
	}

	return (
		<div
			dir={lang === "ar" ? "rtl" : "ltr"}
			className={classNames(
				` min-h-screen flex flex-col  relative bg-[#F8F8F8]`,
				lang === "ar" ? "font-Cairo" : "font-Poppins"
			)}
		>
			<Head>
				<title>{title} - وان فينانس</title>
				<meta
					name="description"
					content="One finance is a consumer finance company that introduces an
						innovative after pay "
				/>
				<link rel="icon" href="/favicon.svg" />
			</Head>

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
						<div className=" flex items-center">
							<Image src="/logo.png" alt="One Finance" width={64} height={48} />
							<p className="text-2xl   font-bold mr-3">وان فاينانس</p>
						</div>{" "}
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
