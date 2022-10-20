import React, { useState } from "react";
import classNames from "classnames";
import "moment/locale/ar";
import moment from "moment";
import { Loading } from "../../Atomics/Loading";

// CustomerRequestHistor;
export const CustomerRequestHistoryTimeLine = ({ timeline = [] }) => {
	return (
		<div className="px-12 pb-8 relative  mx-auto">
			{!timeline && (
				<div className="flex items-center justify-center py-24">
					<Loading />
				</div>
			)}
			{timeline && (
				<ul className="">
					{timeline &&
						timeline.map((card, index, array) => {
							moment.locale("ar");
							const formatedDate = moment(card.updateDate).format(
								"DD MMM  - h:mm:ss a"
							);
							return (
								<li key={index}>
									<div className=" relative">
										<div>
											<div
												className={classNames(
													`bg-white absolute left-0 rtl:left-auto rtl:right-0 w-14 h-14  rounded-full flex items-center p-2 justify-center shadow-lg z-10`
													// array.length === 1 ? "hidden" : "block"
												)}
											>
												<div className=" bg-[#EDAA00] rounded-full z-10 w-full h-full flex items-center justify-center ">
													<svg
														width="17"
														height="14"
														viewBox="0 0 17 14"
														fill="none"
														xmlns="http://www.w3.org/2000/svg"
													>
														<path
															d="M5.66834 10.7845L1.92116 6.71188L0.645142 8.08894L5.66834 13.5484L16.4516 1.82866L15.1846 0.451599L5.66834 10.7845Z"
															fill="white"
														/>
													</svg>
												</div>
											</div>

											<div className="mt-12 rtl:pl-0 pr-20  min-h-full flex flex-col">
												<div className=" flex flex-col ">
													<div className="flex items-center">
														<h2 className="font-bold ">
															{card.statusName === "Submitted Customer" &&
																"تم تقديم الطلب"}
															{card.statusName === "Pending Customer" &&
																"طلب تعديل"}
															{card.statusName === "Updated Customer" &&
																"تم تحديث الطلب"}
														</h2>
														{/* <p className="text-[#999999] mx-4">
															{formatedDate}
														</p> */}
														<p className=" py-2 px-4 rounded-full bg-[#00BAFF33] bg-opacity-20 font-bold text-[#00BAFF]">
															{card.userName}
														</p>
													</div>
													<div>
														{card.comment && (
															<p className="p-4 rounded-2xl bg-[#9797971A] bg-opacity-10  mt-6 w-6/12">
																{card.comment}
															</p>
														)}

														{card.rejecgtionReasonName && (
															<p className="p-4 rounded-2xl bg-red-500 bg-opacity-10  mt-6 w-6/12">
																{card.rejecgtionReasonName}
															</p>
														)}
													</div>
												</div>
											</div>
										</div>
										<div
											className={classNames(
												`absolute z-auto top-12 left-7 rtl:left-auto rtl:right-7 h-full border   border-[#F5B803]`,
												array.length - 1 === index && "hidden",
												array.length >= 2 && "block"
											)}
										></div>
									</div>
								</li>
							);
						})}
				</ul>
			)}
		</div>
	);
};
