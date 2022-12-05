import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { ClockLoader } from "react-spinners";

export default function Modal({
	isOpen,
	onClose,
	title,
	text,
	type,
	acceptBtnText,
	discardBtntext,
	onAccept,
	onDiscard,
}) {
	return (
		<>
			<Transition appear show={isOpen} as={Fragment}>
				<Dialog
					as="div"
					className="relative z-10  font-Cairo"
					onClose={onClose}
					dir="rtl"
				>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-black bg-opacity-25" />
					</Transition.Child>
					<div className="fixed inset-0 overflow-y-auto">
						<div className="flex min-h-full items-center justify-center p-4 text-center">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 scale-95"
								enterTo="opacity-100 scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 scale-100"
								leaveTo="opacity-0 scale-95"
							>
								<Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6   shadow-xl transition-all">
									<div className="flex  justify-center">
										{type === "success" && SuccesIcon}
										{type === "error" && ErrorIcon}
										{type === "loading" && (
											<div className="py-12">
												<ClockLoader
													color="#EDAA00"
													size={64}
													loading={isOpen}
												/>
											</div>
										)}
									</div>
									{title && (
										<Dialog.Title
											as="h3"
											className="text-xl font-bold leading-6 text-gray-900 mt-4 mb-6"
										>
											{title}
										</Dialog.Title>
									)}
									{text && (
										<p className=" mb-6 text-lg text-gray-500 text-center">
											{text}
										</p>
									)}
									<div className=" flex justify-center items-center gap-6">
										{onAccept && (
											<button
												type="button"
												className="text-lg font-semibold rounded-md border border-transparent bg-black text-white px-4 py-2    hover:bg-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
												onClick={onAccept}
											>
												{acceptBtnText}
											</button>
										)}
										{onDiscard && (
											<button
												type="button"
												className="text-lg font-semibold rounded-md border border-transparent bg-red-100 px-4 py-2   text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
												onClick={onDiscard}
											>
												{discardBtntext}
											</button>
										)}
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>
		</>
	);
}
const ErrorIcon = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		x="0px"
		y="0px"
		width="100"
		height="100"
		viewBox="0 0 48 48"
		className="w-16 h-16"
	>
		<path
			fill="#f44336"
			d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"
		></path>
		<path
			fill="#fff"
			d="M29.656,15.516l2.828,2.828l-14.14,14.14l-2.828-2.828L29.656,15.516z"
		></path>
		<path
			fill="#fff"
			d="M32.484,29.656l-2.828,2.828l-14.14-14.14l2.828-2.828L32.484,29.656z"
		></path>
	</svg>
);
const SuccesIcon = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		x="0px"
		y="0px"
		width="100"
		height="100"
		viewBox="0 0 48 48"
		className="w-16 h-16"
	>
		<path
			fill="#4caf50"
			d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"
		></path>
		<path
			fill="#ccff90"
			d="M34.602,14.602L21,28.199l-5.602-5.598l-2.797,2.797L21,33.801l16.398-16.402L34.602,14.602z"
		></path>
	</svg>
);
