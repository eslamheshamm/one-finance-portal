import { Fragment } from "react";
import { Listbox } from "@headlessui/react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../Utils/Services/apiClient";
import { ClipLoader } from "react-spinners";
import { CustomDropDown } from "../Atoms/FormInputs/DropDown";

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
				<div className="py-12 flex justify-center items-center">
					<ClipLoader />
				</div>
			)}
			{isSuccess && (
				<div className="grid grid-cols-2  gap-6">
					<CustomDropDown
						option={selectedCategoryProduct}
						selectOption={setSelectedCategoryProduct}
						items={data.data.data || []}
						label="نوع المنتج"
						icon={"Arrow"}
						// disable={data.data.data.length === 0}
						className=" text-black  p-6 w-full rounded-full text-right   bg-[#DADADA36] bg-opacity-20"
					/>
					{/* product type */}
					<CustomDropDown
						option={selectedProduct}
						selectOption={setSelectedProduct}
						items={selectedCategoryProduct.productListResponseDTO || []}
						label="المنتج"
						icon={"Arrow"}
						disabled={selectedCategoryProduct.id === -1}
						className=" text-black  p-6 w-full rounded-full text-right   bg-[#DADADA36] bg-opacity-20"
					/>
				</div>
			)}
		</div>
	);
};
