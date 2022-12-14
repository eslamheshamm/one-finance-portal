import { useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import classNames from "classnames";
import toast, { Toaster } from "react-hot-toast";

import useIdnoInfo from "../../../Utils/hooks/useIdnoInfo";
import apiClient from "../../../Utils/Services/apiClient";

import { FileReplacer } from "../../Atoms/Files/FileReplacer";
import { AddressDropDown } from "./LookupsMenus/AddressDropDown";
import { CarsDropDown } from "./LookupsMenus/CarsDropDown";
import { ClubsDropDown } from "./LookupsMenus/ClubsDropDown";
import { JobDropDown } from "./LookupsMenus/JobDropDown";
import { JobSectorDropDown } from "./LookupsMenus/JobSectorDropDown";
import { OwnHomeDropDown } from "./LookupsMenus/OwnHomDropDown";
import { OwnSecondHomeDropDown } from "./LookupsMenus/OwnSecondHomeDropDown";
import Modal from "../../Atoms/Modal";

const AddCustomerForm = () => {
	const router = useRouter();
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		getValues,
		watch,
	} = useForm({
		defaultValues: {
			LoanAmount: null,
			DownPayment: null,
			mobileNumber: null,
			mobileNumber2: null,
			nationalID: "",
		},
		mode: "oChange",
	});
	// customer
	const [customerId, setCustomerId] = useState(null);
	const [modalBody, setModalBody] = useState({
		title: "",
		text: "",
		isOpen: false,
		onAccept: () => {},
		onClose: () => {},
	});
	const [customerDocs, setCustomerDocs] = useState(null);

	// watch
	const idnoWatch = watch("nationalId");
	// lokups states
	const [govList, setGovList] = useState({
		name: "",
		govID: -1,
		govs: [],
	});
	const [cityList, setCityList] = useState({
		name: "",
		cityID: -1,
		districtList: [],
	});
	const [districtList, setDistrictList] = useState({
		name: "",
		districtID: -1,
		districtList: [],
	});
	// cars drop downs
	const [carsList, setCarsList] = useState({
		name: "",
		vehicleID: -1,
		vehicleModelList: [],
	});
	const [carsModel, setCarModel] = useState({
		name: "",
		vehicleModelID: -1,
	});
	// job drop down
	const [jobSector, setJobSector] = useState({
		name: "",
		sectorID: -1,
	});
	const [jobsList, setJobsList] = useState({
		name: "",
		jobID: -1,
	});
	const [clubsList, setClubsList] = useState({
		name: "",
		clubID: -1,
	});
	// own home drop down
	const [home, setHome] = useState({
		status: "???????? ????????????????",
		ownershipHomeID: -1,
	});
	const [homeType, setHomeType] = useState({
		residencyTypeStatus: "???????? ????????????????",
		residencyTypeID: -1,
	});

	const [secondHome, setSecondHome] = useState({
		status: "???????? ????????????????",
		secondHomeID: -1,
	});
	const [secondHomeType, setSecondHomeType] = useState({
		residencyTypeStatus: "???????? ????????????????",
		residencyTypeID: -1,
	});
	const { dateOfBirth, gender } = useIdnoInfo(idnoWatch);

	const handleSaveCustomer = (data) => {
		const loading = toast.loading("???????? ?????? ????????????..");
		apiClient
			.post("/api/Customer/SaveCustomer", {
				customerDTO: {
					firstName: data.FirstName,
					secondName: data.SecondName,
					middleName: data.ThirdName,
					lastName: data.LastName,
					nationalID: data.nationalId,
				},
				customerAdditionalDTO: {
					gender: gender.id,
					dateOfBirth: dateOfBirth,
					homeAddress: data.Address,
					primaryPhone: data.PhoneNumber,
					anotherPhone: data.SecPhoneNumber,
					email: data.Email,
					businessDescription: data.JobTitle,
					yearsInBusiness: Number(data.yearsInBusiness),
					monthlyIncome: Number(data.Income),
					inquireAddress: data.InvestigationAddress,
					businessName: data.businessName,
					businessAddress: data.businessAddress,
				},
				customerQuestionnaireDTO: {
					sectorID: jobSector.sectorID,
					clubID: clubsList.clubID,
					ownershipHomeID: home.ownershipHomeID,
					ownershipResidencyTypeID: homeType.residencyTypeID,
					secondHomeID: secondHome.secondHomeID,
					secondResidencyTypeID: secondHomeType.residencyTypeID,
					govID: govList.govID,
					districtID: districtList.districtID,
					jobID: jobsList.jobID,
					modelYear: data.CarModelYear,
					vehicleModelID: carsModel.vehicleModelID,
					vehicleID: carsList.vehicleID,
				},
			})
			.then(({ data }) => {
				toast.dismiss(loading);
				if (data.isSuccess) {
					setCustomerId(data.data.customerID);
					setModalBody({
						title: "??????????!",
						text: "???? ?????? ???????????? ??????????",
						type: "success",
						isOpen: true,
						onAccept: () =>
							setModalBody((prevState) => ({ ...prevState, isOpen: false })),
						onClose: () =>
							setModalBody((prevState) => ({ ...prevState, isOpen: false })),
					});
				}
			})
			.catch(() => {
				toast.dismiss(loading);
				// toast.error("?????? ?????? ?????? ???? ????????????????.");
			})
			.finally(() => {
				toast.dismiss(loading);
			});
	};

	const handleSubmitCustomer = (e) => {
		e.preventDefault();
		const loading = toast.loading("???????? ?????????? ???????????? ..");
		apiClient
			.post("/api/Customer/SubmitCustomer", {
				customerID: customerId,
			})
			.then(({ data }) => {
				toast.dismiss(loading);
				if (data.isSuccess) {
					setModalBody({
						title: "??????????!",
						text: "???? ?????????? ???????????? ??????????",
						type: "success",
						isOpen: true,
						onAccept: () =>
							setModalBody((prevState) => ({ ...prevState, isOpen: false })),
						onClose: () =>
							setModalBody((prevState) => ({ ...prevState, isOpen: false })),
					});
				}
				if (data.errors.code == 40) {
					setModalBody({
						title: "??????????",
						text: "?????? ???? ?????? ?????? ????????????.",
						type: "error",
						isOpen: true,
						onAccept: () =>
							setModalBody((prevState) => ({ ...prevState, isOpen: false })),
						onClose: () =>
							setModalBody((prevState) => ({ ...prevState, isOpen: false })),
					});
				}
				if (data.errors.code == 39) {
					setModalBody({
						title: "??????????",
						text: "???????? ?????????? ???????? ????????????.",
						type: "error",
						isOpen: true,
						onAccept: () =>
							setModalBody((prevState) => ({ ...prevState, isOpen: false })),
						onClose: () =>
							setModalBody((prevState) => ({ ...prevState, isOpen: false })),
					});
				}
			})
			.catch(() => {
				toast.dismiss(loading);
				// toast.error("?????? ?????? ?????? ???? ????????????????.");
			});
	};

	const handlNationalIdSearch = () => {
		const loading = toast.loading("???????? ?????????? ???? ????????????..");
		const Idno = getValues("nationalId");
		apiClient
			.get("/api/Customer/GetCustomerDetailsByNationalID", {
				params: {
					NationalID: Idno,
				},
			})
			.then(({ data }) => {
				toast.dismiss(loading);
				if (data.isSuccess) {
					toast.success("???? ???????????? ?????? ????????????.");
					const customer = data.data;
					setCustomerId(customer.customerID);
					setValue("FirstName", customer.firstName);
					setValue("SecondName", customer.secondName);
					setValue("ThirdName", customer.middileName);
					setValue("LastName", customer.lastName);
					setValue("Address", customer.homeAddress);
					setValue("InvestigationAddress", customer.inquireAddress);
					setValue("Email", customer.email);
					setValue("PhoneNumber", customer.primaryPhone);
					setValue("SecPhoneNumber", customer.anotherPhone);
					setValue("JobTitle", customer.buesinessDescription);
					setValue("yearsInBusiness", customer.yearsInBusiness);
					setValue("businessAddress", customer.businessAddress);
					setValue("businessName", customer.businessName);
					setValue("Income", customer.monthlyIncome);
				}
			})
			.catch(() => {
				toast.dismiss(loading);
				toast.error("?????? ?????? ?????? ???? ????????????????.");
			})
			.finally(() => {
				toast.dismiss(loading);
			});
	};

	// const GetCustomerDocs = () => {
	// 	apiClient
	// 		.post("/api/Document/GetDocument", {
	// 			id: "47",
	// 			type: 1,
	// 		})
	// 		.then((res) => {
	// 			console.log(res);
	// 			setCustomerDocs(res.data.data);
	// 		})
	// 		.catch(() => {
	// 			toast.error("?????? ?????? ?????? ???? ?????????? ??????????????????..");
	// 		});
	// };
	// useEffect(() => {
	// 	GetCustomerDocs();
	// }, [customerId]);

	const nationalIdButtonClass =
		" cursor-pointer  rounded-full font-bold   flex justify-center items-center  p-6  w-full  text-black   bg-[#EDAA00]  transition-all duration-200";
	const buttonClass = `p-6 placeholder-[#9099A9] rounded-full  bg-[#DADADA36] bg-opacity-20   focus:outline-2 focus:outline-[#EDAA00] block w-full border-0 ring-0 focus:ring-0 `;
	return (
		<section>
			<Toaster position="bottom-center" />
			<Modal
				isOpen={modalBody.isOpen}
				onClose={modalBody.onClose}
				title={modalBody.title}
				text={modalBody.text}
				type={modalBody.type}
				onAccept={modalBody.onAccept}
				discardBtntext="??????????"
				acceptBtnText="??????????"
			/>
			<form
				onSubmit={handleSubmit(handleSaveCustomer)}
				className="space-y-6"
				autoComplete="off"
			>
				<div className=" rounded-[32px] py-8 px-12 bg-white shadow-sm">
					{/* National Id inputs */}
					<div className="w-full grid grid-cols-4 gap-6 items-end">
						<div className=" w-full space-y-3 col-span-3">
							<label htmlFor="nationalId" className="font-semibold">
								?????????? ????????????
							</label>
							<input
								type="number"
								placeholder="???????? ?????????? ?????????? ????????????"
								{...register("nationalId", {
									required: true,
									minLength: 14,
									maxLength: 14,
								})}
								className={buttonClass}
							/>
						</div>
						<div>
							<div
								className={classNames(nationalIdButtonClass)}
								onClick={(e) => {
									e.preventDefault();
									handlNationalIdSearch(e);
								}}
							>
								<span className="ml-4 font-bold">??????</span>
								{SearchIcon}
							</div>
						</div>
					</div>
					<p className="mt-2 text-red-400">
						{(errors.nationalId?.type === "minLength" ||
							errors.nationalId?.type === "maxLength") &&
							"???????? ?????????? ?????? ???????? ????????"}
					</p>
				</div>

				{/* customer info */}
				<div className="px-12 py-8 space-y-5 bg-white rounded-3xl shadow-sm">
					{/* Name Inputs */}
					<p className=" font-bold text-[#EDAA00] mb-5 text-xl">
						???????????? ????????????
					</p>
					{/* customer name */}
					<div>
						<p className=" font-semibold mb-4">?????? ????????????</p>
						<div className="w-full grid grid-cols-2 lg:grid-cols-4 items-center gap-6">
							<input
								type="string"
								placeholder="?????????? ??????????"
								{...register("FirstName", { required: true })}
								className={buttonClass}
							/>
							<input
								type="string"
								placeholder="?????????? ????????????"
								{...register("SecondName", { required: true })}
								className={buttonClass}
							/>
							<input
								type="string"
								placeholder="?????????? ????????????"
								{...register("ThirdName", { required: true })}
								className={buttonClass}
							/>
							<input
								type="string"
								placeholder="?????????? ????????????"
								{...register("LastName", { required: true })}
								className={buttonClass}
							/>
						</div>
					</div>
					{/* date of birth & gender */}
					<div className="grid grid-cols-2 gap-x-6">
						<div className=" w-full  space-y-3 ">
							<label className="font-semibold">??????????</label>
							<div className={buttonClass}>
								{gender ? gender.arabicName : "?????????? ???????????? ?????? ????????"}
							</div>
						</div>
						<div className=" w-full space-y-3">
							<label className="font-semibold">?????????? ??????????????</label>
							<div className={buttonClass}>
								{dateOfBirth ? dateOfBirth : "?????????? ???????????? ?????? ????????"}
							</div>
						</div>
					</div>
					{/* Address  */}

					<AddressDropDown
						govList={govList}
						setGovList={setGovList}
						cityList={cityList}
						setCityList={setCityList}
						districtList={districtList}
						setDistrictList={setDistrictList}
					/>
					<div className="grid grid-cols-2 gap-5">
						<div className=" w-full   space-y-3">
							<label className="font-semibold">??????????????</label>
							<input
								type="string"
								placeholder="?????????? ????????????"
								{...register("Address", { required: false })}
								className={buttonClass}
							/>
						</div>
						<div className=" w-full space-y-3">
							<label htmlFor="InvestigationAddress" className="font-semibold">
								?????????? ??????????????????
							</label>
							<input
								type="string"
								placeholder="?????????? ??????????????????"
								{...register("InvestigationAddress", { required: false })}
								className={buttonClass}
							/>
						</div>
					</div>

					{/* Email & phone */}
					<div className="grid grid-cols-3 gap-x-6">
						<div className=" w-full space-y-3">
							<label htmlFor="Email" className="font-semibold">
								??????????????
							</label>
							<input
								type="email"
								placeholder="?????????????? ????????????"
								{...register("Email", {
									pattern: /\S+@\S+\.\S+/,
								})}
								className={classNames(
									buttonClass,
									errors.Email?.type === "pattern" &&
										"border-2 focus:border-red-500 focus:outline-0 focus:outline-none border-red-500"
								)}
							/>
						</div>
						{/* Phone */}
						<div className=" w-full space-y-3">
							<label htmlFor="PhoneNumber" className="font-semibold">
								?????? ???????? ??????????
							</label>
							<input
								type="number"
								placeholder="01146390954"
								{...register("PhoneNumber", {
									pattern: /^01[0125][0-9]{8}$/gm,
								})}
								className={classNames(
									buttonClass,
									errors.PhoneNumber?.type === "pattern" &&
										"border-2 focus:border-red-500 focus:outline-0 focus:outline-none border-red-500"
								)}
							/>
						</div>
						<div className=" w-full space-y-3 ">
							<label htmlFor="SecPhoneNumber" className="font-semibold">
								?????? ???????? ?????????? ??????
							</label>
							<input
								type="number"
								placeholder="01546390954"
								{...register("SecPhoneNumber", {
									pattern: /^01[0125][0-9]{8}$/gm,
								})}
								className={buttonClass}
							/>
						</div>
					</div>
					{/* job & salary */}
					<div className="grid gap-6 ">
						<div className="grid grid-cols-4 gap-x-6">
							{/*  */}
							<div className=" w-full space-y-3">
								<label htmlFor="JobTitle" className="font-semibold">
									???????????? ??????????????
								</label>
								<input
									type="string"
									placeholder="?????? ??????????"
									{...register("JobTitle")}
									className={buttonClass}
								/>
							</div>
							<div className=" w-full space-y-3">
								<label htmlFor="yearsInBusiness" className="font-semibold">
									?????????? ??????????
								</label>
								<input
									type="number"
									placeholder="?????? ?????????? ??????????"
									{...register("yearsInBusiness")}
									className={buttonClass}
								/>
							</div>
							<div className=" w-full space-y-3">
								<label htmlFor="businessName" className="font-semibold">
									?????? ?????? ??????????
								</label>
								<input
									type="string"
									placeholder="?????? ?????? ??????????"
									{...register("businessName")}
									className={buttonClass}
								/>
							</div>
							<div className=" w-full space-y-3 ">
								<label htmlFor="businessAddress" className="font-semibold">
									?????????? ?????? ??????????
								</label>
								<input
									type="string"
									placeholder="?????????? ?????? ??????????"
									{...register("businessAddress")}
									className={buttonClass}
								/>
							</div>
						</div>
						<div className="grid gap-6">
							<div className=" w-full space-y-3">
								<label htmlFor="Income" className="font-semibold">
									?????????? ????????????
								</label>
								<input
									type="number"
									placeholder="0"
									{...register("Income")}
									className={classNames(buttonClass)}
								/>
							</div>
						</div>
						{/*  */}
					</div>
				</div>
				<div className="mt-6">
					<div className=" mt-6 px-12 py-8 bg-white rounded-[32px] flex flex-col gap-5 shadow-sm">
						<h2 className=" font-bold text-[#EDAA00] mb-4 text-xl">
							?????????????? ????????????
						</h2>
						<div className="grid grid-cols-3 gap-5">
							<CarsDropDown
								carsList={carsList}
								setCarsList={setCarsList}
								setCarModel={setCarModel}
								carsModel={carsModel}
							/>
							<div className=" w-full space-y-3">
								<label htmlFor="CarModelYear" className="font-semibold">
									?????? ??????????
								</label>
								<input
									type="string"
									placeholder="?????? ??????????"
									{...register("CarModelYear", { required: false })}
									className={buttonClass}
								/>
							</div>
						</div>
						<div className="grid grid-cols-3 gap-5">
							<JobSectorDropDown
								jobSector={jobSector}
								setJobSector={setJobSector}
							/>
							<JobDropDown jobsList={jobsList} setJobsList={setJobsList} />
							<ClubsDropDown
								clubsList={clubsList}
								setClubsList={setClubsList}
							/>
						</div>
						<div className="grid  gap-5 grid-cols-2">
							<OwnHomeDropDown
								homeType={homeType}
								setHomeType={setHomeType}
								home={home}
								setHome={setHome}
							/>
							<OwnSecondHomeDropDown
								secondHome={secondHome}
								setSecondHome={setSecondHome}
								secondHomeType={secondHomeType}
								setSecondHomeType={setSecondHomeType}
							/>
						</div>
					</div>
				</div>
				<div className="w-full grid-cols-3">
					<button
						type="submit"
						className={classNames(
							" font-semibold rounded-full bg-[#343434]   text-white flex rtl:flex-row-reverse border-0  justify-center items-center  py-6 w-full   group hover:bg-[#EDAA00]  transition-all duration-200"
						)}
					>
						<div
							className={classNames(
								"text- w-6 h-6 rounded-full flex justify-center items-center bg-white mr-2 text-[#343434] group-hover:text-[#EDAA00] "
							)}
						>
							{Check}
						</div>
						<span className="group-hover:text-primary">?????? ????????????</span>
					</button>
				</div>
			</form>

			<div className="mt-6">
				{/* <div className=" mt-6 px-12 py-8 bg-white rounded-[32px] shadow-sm">
					<h2 className=" font-bold text-[#EDAA00] mb-4 text-xl">
						?????????????? ????????????
					</h2>
					{!customerDocs && (
						<p className="text-2xl font-bold mt-8">???????? ?????? ???????????? ??????????!</p>
					)}
					<div className="grid grid-cols-3  gap-6">
						{customerDocs &&
							customerDocs.map((doc, index) => {
								console.log(doc, "doccc");
								return (
									<FileReplacer
										key={index++}
										doc={doc}
										EntityType={1}
										EntityID={customerId}
										fileName={doc.typeName}
									/>
								);
							})}
					</div>
				</div> */}

				<div
					className="flex items-end  justify-center mt-6"
					onClick={(e) => handleSubmitCustomer(e)}
				>
					<button
						disabled={!customerId}
						className={classNames(
							" font-semibold rounded-full bg-[#343434]   text-white flex rtl:flex-row-reverse justify-center items-center py-5 px-20 group hover:bg-[#EDAA00]  transition-all duration-200 disabled:bg-[#999999] w-full group-hover:text-[#ed0000]"
						)}
					>
						{SendIcon}
						<span className="group-hover:text-primary">??????????</span>
					</button>
				</div>
			</div>
		</section>
	);
};
export default AddCustomerForm;

const Check = (
	<svg
		width="11"
		height="9"
		viewBox="0 0 11 9"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M10 1L3.8125 7.75L1 4.68182"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);
const SearchIcon = (
	<svg
		width="25"
		height="24"
		viewBox="0 0 25 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M11.5 20C16.4706 20 20.5 15.9706 20.5 11C20.5 6.02944 16.4706 2 11.5 2C6.52944 2 2.5 6.02944 2.5 11C2.5 15.9706 6.52944 20 11.5 20Z"
			stroke="black"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M22.5 22L18.5 18"
			stroke="black"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);
const SendIcon = (
	<svg
		className="mr-4"
		width="25"
		height="25"
		viewBox="0 0 25 25"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M2.22669 12.827C1.39894 12.5087 1.36449 11.3503 2.17186 10.9833L20.9068 2.46743C21.748 2.08508 22.6133 2.95043 22.2309 3.7916L13.7151 22.5265C13.3481 23.3339 12.1897 23.2994 11.8714 22.4717L9.35183 15.9209C9.25026 15.6568 9.04156 15.4481 8.77746 15.3466L2.22669 12.827Z"
			stroke="#FCFCFC"
			strokeWidth="2"
		/>
	</svg>
);
