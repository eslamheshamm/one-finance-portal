import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import ClipLoader from "react-spinners/ClipLoader";

export default function Home() {
	const { data: session, status } = useSession();
	const router = useRouter();
	if (status === "loading") {
		return (
			<div className="min-h-screen flex justify-center items-center ">
				<ClipLoader color={"#F9CD09"} size={48} aria-label="Loading Spinner" />
			</div>
		);
	}

	if (status === "unauthenticated") {
		router.push("/login");
		return (
			<div className="min-h-screen flex justify-center items-center ">
				<ClipLoader color={"#F9CD09"} size={48} aria-label="Loading Spinner" />
			</div>
		);
	}

	if (status === "authenticated") {
		if (session.user.data.roleID === 4) {
			router.push("/sales/customers/add");
		} else if (session.user.data.roleID === 14) {
			router.push("/risk/customers/queue");
		} else if (session.user.data.roleID === 17) {
			router.push("/finance/loans/approved");
		} else if (
			session.user.data.roleID === 10 ||
			session.user.data.roleID === 14
		) {
			router.push("/risk/manager/queue");
		} else {
			return (
				<div className="flex justify-center items-center min-h-screen ">
					<h1 className="text-2xl">لا يوجد صلاحيات</h1>
				</div>
			);
		}
	}

	return (
		<div className="min-h-screen flex justify-center items-center ">
			<ClipLoader color={"#F9CD09"} size={48} aria-label="Loading Spinner" />
		</div>
	);
}
