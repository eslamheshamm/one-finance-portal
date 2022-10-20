import React, { useEffect } from "react";
import classNames from "classnames";
import { signOut, useSession } from "next-auth/react";
import { Logo } from "../../Atomics/Logo";
import { RiskSideBar } from "./RiskSideBar";
import { SaleSideBar } from "./SaleSideBar";
import { useRouter } from "next/router";
import UserMenu from "../../Atomics/User/UserMenu";

const DashboardLayout = ({ children, lang = "ar" }) => {
	const { data: session, status } = useSession();
	const router = useRouter();
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
				` min-h-screen justify-between flex  relative bg-[#F8F8F8]`,
				lang === "ar" ? "font-Cairo" : "font-Poppins"
			)}
		>
			<div className=" h-screen sticky right-0 w-[20vw] pr-6 py-8">
				<div className=" rounded-3xl shadow-md h-full bg-white">
					<div className="w-full  p-12  h-full flex flex-col">
						<Logo />
						<div className="mt-10 h-full flex flex-col justify-between">
							<div>
								{session && session.user.data.roleID === 4 && <SaleSideBar />}
								{session && session.user.data.roleID === 14 && <RiskSideBar />}
							</div>
						</div>
					</div>
				</div>
			</div>
			<main
				className={classNames(
					"col-span-4 row-start-2 col-start-2 overflow-auto w-[80vw] h-screen pb-20"
				)}
			>
				<div className="pt-8 pb-20 col-span-4 w-11/12 mx-auto flex justify-end">
					<UserMenu />
				</div>
				{children}
			</main>
		</div>
	);
};
export default DashboardLayout;

const LogoutIcon = (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M2.75 1.25C2.72155 1.25 2.69755 1.26254 2.66992 1.26562C2.62978 1.26999 2.59363 1.27832 2.55469 1.28906C2.48762 1.30765 2.42727 1.33378 2.36914 1.36914C2.34674 1.38255 2.31992 1.38457 2.29883 1.40039C2.28487 1.41093 2.27871 1.42806 2.26562 1.43945C2.21182 1.48598 2.16967 1.54164 2.13086 1.60156C2.11186 1.6311 2.08693 1.65564 2.07227 1.6875C2.02772 1.7834 2 1.88736 2 2V18V20C2 20.344 2.23436 20.6445 2.56836 20.7285L9.32617 22.418C9.84817 22.549 10.4012 22.4306 10.8262 22.0996C11.2428 21.7742 11.4865 21.2771 11.4961 20.75H15.75C16.214 20.75 16.6583 20.5653 16.9863 20.2363C17.3153 19.9083 17.5 19.464 17.5 19V14C17.5 13.586 17.164 13.25 16.75 13.25C16.336 13.25 16 13.586 16 14V19C16 19.066 15.9747 19.1307 15.9277 19.1777C15.8807 19.2247 15.816 19.25 15.75 19.25H11.5V5.03906C11.5 4.25806 10.9815 3.57242 10.2305 3.35742C9.65426 3.19283 9.03364 3.01568 8.10352 2.75H15.75C15.888 2.75 16 2.862 16 3V8C16 8.414 16.336 8.75 16.75 8.75C17.164 8.75 17.5 8.414 17.5 8V3C17.5 2.034 16.717 1.25 15.75 1.25H2.75ZM3.5 2.99414L9.81836 4.80078C9.92536 4.83078 10 4.92706 10 5.03906V20V20.7188C10 20.7957 9.9653 20.869 9.9043 20.916C9.8433 20.964 9.76445 20.9809 9.68945 20.9629L3.5 19.4141V18V2.99414ZM19.25 8.25C19.058 8.25 18.8667 8.3242 18.7207 8.4707C18.4277 8.7627 18.4277 9.2373 18.7207 9.5293L19.4414 10.25H14.25C13.836 10.25 13.5 10.586 13.5 11C13.5 11.414 13.836 11.75 14.25 11.75H19.4414L18.7207 12.4707C18.4277 12.7627 18.4277 13.2373 18.7207 13.5293C19.0127 13.8223 19.4873 13.8223 19.7793 13.5293L21.7793 11.5293C22.0723 11.2363 22.0723 10.7637 21.7793 10.4707L19.7793 8.4707C19.6333 8.3242 19.442 8.25 19.25 8.25Z"
			fill="currentColor"
		/>
	</svg>
);
