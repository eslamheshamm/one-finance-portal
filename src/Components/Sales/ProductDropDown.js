import { Fragment } from "react";
import { Listbox } from "@headlessui/react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../Utils/Services/apiClient";
import { ClipLoader } from "react-spinners";

export const ProductsDropDown = ({
	selectedCategoryProduct = {
		name: "يرجي الإختيار",
		id: -1,
		productListResponseDTO: [],
	},
	setSelectedCategoryProduct,
	selectedProduct = {
		name: "يرجي الإختيار",
		id: -1,
	},
	setSelectedProduct,
	className,
	disableProductCategory,
}) => {
	const { isLoading, isError, isSuccess, data } = useQuery(
		["products"],
		async () => {
			return await apiClient.get("/api/Product/GetProductsWithCategories");
		}
	);

	// useEffect(() => {
	// 	if (isSuccess) {
	// 		if (selectedCategoryProduct.id !== -1) {
	// 			const result = data.data.data.filter((product) => {
	// 				return product.id === selectedCategoryProduct.id;
	// 			});
	// 			setSelectedCategoryProduct(result[0]);
	// 		}
	// 	}
	// }, []);
	return (
		<div className={className}>
			{isLoading && (
				<div className="py-8">
					<ClipLoader
						color={"#F9CD09"}
						loading={isLoading}
						size={48}
						aria-label="Loading Spinner"
					/>{" "}
				</div>
			)}
			{isSuccess && (
				<div className="grid grid-cols-2  gap-6">
					<div className=" space-y-5">
						<label htmlFor="productCategory" className="font-semibold">
							نوع المنتج
						</label>
						{selectedCategoryProduct && (
							<Listbox
								value={selectedCategoryProduct}
								onChange={(e) => {
									setSelectedCategoryProduct(e);
								}}
								disabled={disableProductCategory}
								name={"productCategory"}
							>
								<div className="relative ">
									<Listbox.Button
										className=" text-black  p-6 w-full rounded-full text-right   bg-[#DADADA36] bg-opacity-20"
										as={Fragment}
									>
										<button>{selectedCategoryProduct.name}</button>
									</Listbox.Button>
									<Listbox.Options className="absolute mt-2 w-full overflow-auto rounded-2xl bg-white  text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
										{data.data.data.map((category) => (
											<Listbox.Option
												className={({ active }) =>
													`relative cursor-default select-none py-4 pl-10 pr-4 ${
														active
															? "bg-amber-100 text-amber-900"
															: "text-gray-900"
													}`
												}
												key={category.id}
												value={category}
											>
												{category.name}
											</Listbox.Option>
										))}
									</Listbox.Options>
								</div>
							</Listbox>
						)}
					</div>
					{/* product type */}
					<div className=" space-y-5">
						<label htmlFor="product" className="font-semibold">
							المنتج
						</label>
						{selectedProduct && (
							<Listbox
								value={selectedProduct}
								onChange={setSelectedProduct}
								disabled={selectedCategoryProduct.id === -1}
							>
								<div className="relative ">
									<Listbox.Button
										className=" text-black  p-6 w-full rounded-full text-right   bg-[#DADADA36] bg-opacity-20"
										as={Fragment}
										disabled={selectedCategoryProduct.id === -1}
									>
										<button>{selectedProduct.name}</button>
									</Listbox.Button>
									<Listbox.Options className="absolute mt-2 w-full overflow-auto rounded-2xl bg-white  text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
										{selectedCategoryProduct.productListResponseDTO &&
											selectedCategoryProduct.productListResponseDTO.map(
												(product) => {
													return (
														<Listbox.Option
															className={({ active }) =>
																`relative cursor-default select-none py-4 pl-10 pr-4 ${
																	active
																		? "bg-amber-100 text-amber-900"
																		: "text-gray-900"
																}`
															}
															key={product.id}
															value={product}
															disabled={
																selectedCategoryProduct.categoryId === -1
															}
														>
															{product.name}
														</Listbox.Option>
													);
												}
											)}
									</Listbox.Options>
								</div>
							</Listbox>
						)}
					</div>
				</div>
			)}
		</div>
	);
};
