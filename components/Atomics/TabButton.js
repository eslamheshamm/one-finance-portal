import { Tab } from "@headlessui/react";
import classNames from "classnames";
import { Fragment } from "react";

export const TabButton = ({ children }) => {
	return (
		<Tab as={Fragment}>
			{({ selected }) => (
				<button
					className={classNames(
						"font-bold  text-2xl px-6 focus:outline-none",
						selected ? " text-black" : " text-[#999999]"
					)}
				>
					<p className="flex flex-col items-center">
						<span>{children}</span>
						<span
							className={classNames(
								"h-4 border-b-4 border-black  block w-24 rounded-sm",
								selected ? " visible  x-" : " invisible"
							)}
						></span>
					</p>
				</button>
			)}
		</Tab>
	);
};
