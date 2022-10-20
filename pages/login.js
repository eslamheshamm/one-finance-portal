import { LoginForm } from "../components/Forms/Login";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { Logo } from "../components/Atomics/Logo";
import Image from "next/image";
import Head from "next/head";
import { useState } from "react";
import { Loading } from "../components/Atomics/Loading";
const LoginPage = () => {
	// const [isPending, startTransition] = useTransitionHook();
	const { data: session, status } = useSession();
	const router = useRouter();
	if (status === "loading") {
		return (
			<div className="h-screen flex justify-center items-center">
				<Loading />
			</div>
		);
	}
	if (status === "authenticated") {
		router.push("/");
		return (
			<div className="h-screen flex justify-center items-center">
				<Loading />
			</div>
		);
	}
	return (
		<div
			className="grid grid-cols-2 min-h-screen  overflow-hidden font-Cairo"
			dir="rtl"
		>
			<Head>
				<title>تسجيل الدخول - وان فاينانس</title>
				<meta
					property="og:title"
					content="تسجيل الدخول - وان فاينانس"
					key="title"
				/>
			</Head>
			<div className="bg-[#151516] pt-8 relative overflow-hidden">
				<div className="w-8/12 mx-auto my-12">
					<div className="flex flex-col items-center mb-8 justify-center">
						<div className="flex items-center mb-6">
							<Image width={64} height={48} src="/logo.png" />

							<h2 className=" text-[#EDAA00]  font-bold text-6xl  mr-3">
								وان فاينانس <br />
							</h2>
						</div>
						<p className="text-4xl text-[#565656]">لخدمات التمويل الإستهلاكي</p>
					</div>
				</div>
				<div className=" absolute top-[55%] transform -translate-y-[55%] left-0 right-0 bottom-0 m-auto  w-3/4">
					<Image
						src="/login-background.png"
						alt="background black"
						width={652}
						height={504}
					/>
				</div>
				<div className=" absolute top-[70%] transform -translate-y-[70%] left-0 right-0 bottom-0 m-auto  w-[45%]">
					<img src="/cardsLogin.png" alt="login" />
				</div>
			</div>
			<div className="  pt-16  flex flex-col mt-32">
				<div className="w-9/12 mx-auto">
					<Logo />
					<h2 className=" my-8     font-bold text-3xl ">
						مرحبا بك
						<br />
						نتمني لك يوماً سعيداً
					</h2>
					{status === "unauthenticated" && <LoginForm />}
					{status === "authenticated" && (
						<button
							onClick={() => {
								router.push("/");
							}}
							className=" font-bold rounded-2xl bg-[#343434]   text-white  py-5  w-full px-20  group hover:bg-[#EDAA00]  transition-all duration-200"
						>
							<span className="group-hover:text-primary">الصفحة الرئيسية</span>
						</button>
					)}
				</div>
			</div>
		</div>
	);
};
export default LoginPage;
