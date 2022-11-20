import { Fragment } from "react";
import { Listbox, Menu, Transition } from "@headlessui/react";
import classNames from "classnames";

export const CustomDropDown = ({
	option,
	selectOption,
	items,
	icon,
	className,
	disable,
}) => {
	return (
		<Listbox disabled={disable} value={option} onChange={selectOption}>
			<div className="relative ">
				<Listbox.Button disabled={disable} className={classNames(className)}>
					<span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-12">
						{icon}
					</span>
					<span className="block ">{option.name}</span>
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
									`relative cursor-default select-none py-4 pl-10 pr-4 ${
										active ? "bg-amber-100 text-amber-900" : "text-gray-900"
									}`
								}
								value={item}
							>
								{({ selected }) => (
									<>
										<span
											className={`block truncate text-lg ${
												selected ? "font-medium" : "font-normal"
											}`}
										>
											{item.name}
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
	);
};
