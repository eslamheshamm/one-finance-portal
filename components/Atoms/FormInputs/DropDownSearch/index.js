import { Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";

export const DropDownSearch = ({
	title,
	onChange,
	value,
	items = [],
	placeholder,
	disabled,
}) => {
	const [query, setQuery] = useState("");
	const filterItems =
		query === ""
			? items
			: items?.filter((item) => {
					return item.name.toLowerCase().includes(query.toLowerCase());
			  });
	return (
		<div className="space-y-5">
			{title && <label className="font-semibold">{title}</label>}{" "}
			<Combobox value={value} onChange={onChange} disabled={disabled}>
				{({ open }) => (
					<>
						<div className="relative">
							<div className="relative cursor-default overflow-hidden focus:border-0 focus:outline-none border-0 rounded-xl">
								<Combobox.Input
									className="focus:border-none border-none focus:outline-none focus:ring-0 focus:outline-offset-0  p-6 w-full rounded-full text-right   bg-[#DADADA36] bg-opacity-20"
									displayValue={(item) => item?.name}
									onChange={(e) => {
										setQuery(e.target.value);
									}}
									onClick={(e) => setQuery("  ")}
									placeholder={placeholder}
									disabled={disabled}
								/>
								<Combobox.Button className="absolute inset-y-0 focus:outline-none focus:border-none left-0 flex items-center px-8">
									<svg
										width="24"
										height="25"
										viewBox="0 0 24 25"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M12 -5.25042e-07C18.6274 -2.35069e-07 24 5.38413 24 12.0115V12.0115C24 18.639 18.6274 24.0231 12 24.0231V24.0231C5.37258 24.0231 -1.17158e-06 18.639 -8.82165e-07 12.0115V12.0115C-5.9275e-07 5.38413 5.37258 -8.15014e-07 12 -5.25042e-07V-5.25042e-07Z"
											fill="#9E9E9E"
										/>
										<path
											d="M15 10.7246L12.0158 13.7117L9.03157 10.7246"
											stroke="white"
											strokeWidth="1.5"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</Combobox.Button>
							</div>
							<Transition
								show={open}
								as={Fragment}
								leave="transition ease-in duration-100"
								leaveFrom="opacity-100"
								leaveTo="opacity-0"
								afterLeave={() => setQuery("")}
							>
								<Combobox.Options className="  absolute w-full    p-4 rounded-3xl shadow-lg z-50 bg-white overflow-auto max-h-60  scrollbar-thin ">
									{filterItems && filterItems.length === 0 && query !== "" ? (
										<li className="relative cursor-default select-none py-2 px-4 text-gray-700">
											لا يوجد شيء
										</li>
									) : (
										filterItems.map((item, idx) => (
											<Combobox.Option
												key={idx++}
												className={({ active, selected }) =>
													`relative cursor-default select-none p-4 my-2 rounded-2xl ${
														selected && "bg-amber-100"
													} ${active && "bg-amber-100"}`
												}
												value={item}
											>
												{({ selected }) => (
													<p className="my-1">
														<span>{item.name}</span>
														{selected && (
															<span
																className={`absolute inset-y-0 left-0 flex items-center px-3 ${
																	selected && "text-gray-600"
																}`}
															>
																<svg
																	fill="currentcolor"
																	xmlns="http://www.w3.org/2000/svg"
																	viewBox="0 0 32 32"
																	width="32px"
																	height="32px"
																>
																	<path d="M 16 4 C 9.3844239 4 4 9.3844287 4 16 C 4 22.615571 9.3844239 28 16 28 C 22.615576 28 28 22.615571 28 16 C 28 9.3844287 22.615576 4 16 4 z M 16 6 C 21.534697 6 26 10.465307 26 16 C 26 21.534693 21.534697 26 16 26 C 10.465303 26 6 21.534693 6 16 C 6 10.465307 10.465303 6 16 6 z M 20.949219 12 L 14.699219 18.25 L 11.449219 15 L 10.050781 16.400391 L 14.699219 21.050781 L 22.349609 13.400391 L 20.949219 12 z" />
																</svg>
															</span>
														)}
													</p>
												)}
											</Combobox.Option>
										))
									)}
								</Combobox.Options>
							</Transition>
						</div>
					</>
				)}
			</Combobox>
		</div>
	);
};
