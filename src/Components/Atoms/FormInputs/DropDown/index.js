import { Fragment } from "react";
import { Listbox, Menu, Transition } from "@headlessui/react";
import classNames from "classnames";

export const CustomDropDown = ({
	option,
	selectOption,
	items,
	icon,
	btnName,
	label,
	className,
	disable,
}) => {
	return (
		<div className="flex flex-col">
			{label && <label className="font-semibold mb-5">{label}</label>}
			<Listbox disabled={disable} value={option} onChange={selectOption}>
				<div className="relative ">
					<Listbox.Button disabled={disable} className={classNames(className)}>
						{icon && (
							<span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-12">
								{icon === "Arrow" ? Arrow : icon}
							</span>
						)}
						<span className="block ">{option.name || btnName}</span>
					</Listbox.Button>
					<Transition
						as={Fragment}
						leave="transition ease-in duration-100"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<Listbox.Options className="absolute mt-2 w-full overflow-auto rounded-2xl bg-white  text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
							{items.map((item, index) => (
								<Listbox.Option
									key={index}
									className={({ active }) =>
										`relative cursor-default select-none py-4 pl-10 pr-4 z-50 bg-white ${
											active ? "bg-amber-100 text-amber-900" : "text-gray-900"
										}`
									}
									value={item}
									disabled={disable}
								>
									{({ selected }) => (
										<>
											<span
												className={`block truncate text-lg ${
													selected ? "font-medium" : "font-normal"
												}`}
											>
												{item.name || item.status}
											</span>
											{/* {selected ? (
											<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
												#
											</span>
										) : null} */}
										</>
									)}
								</Listbox.Option>
							))}
						</Listbox.Options>
					</Transition>
				</div>
			</Listbox>
		</div>
	);
};

const Arrow = (
	<svg
		width="16"
		height="10"
		viewBox="0 0 16 10"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M14.9263 1.36816L7.9631 8.33134L0.999928 1.36816"
			stroke="#14142B"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);
