import React, { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import apiClient from "../../../services/apiClient";
import { useSession } from "next-auth/react";

export const FileUploader = ({
	fileName = "",
	EntityType,
	EntityID,
	TypeID,
	setUrl,
	isMandatory,
}) => {
	const { data: session } = useSession();
	// States
	const [response, setResponse] = useState({});
	const inputRef = useRef(null);
	const [file, setFile] = useState(null);
	const handleFileUpload = () => {
		const uploadingState = toast.loading("جاري إضافة الملف...");
		apiClient
			.post(
				EntityType === 1
					? "/api/Customer/UploadDocument"
					: "/api/Loan/UploadDocument",
				{
					EntityType: EntityType, // 1 for customer 2 for loan
					EntityID: EntityID, // customer id or loan id
					TypeID: TypeID, // 	 File ID (202 if IDNO)
					user: session.user.id,
					file: file,
				},
				{
					headers: {
						"content-type": "multipart/form-data",
					},
				}
			)
			.then((res) => {
				toast.dismiss(uploadingState);
				if (res) {
					const data = res.data;
					console.log(data, "daaaaaaaaaaa");
					if (res.data.isSuccess) {
						toast.success("لقد تم إضافة الملف..");
						setResponse(data);
						{
							setUrl && setUrl(data.url);
						}
						// setIsUploaded(true);
						// console.log(res);
					}
					if (!res.data.isSuccess) {
						toast.error("لقد حدث خطأ..");
						inputRef.current.value = "";
						setResponse(null);
						setFile(null);
					}
				}
			})
			.catch(() => {
				toast.dismiss(uploadingState);
				toast.error("لقد حدث خطأ..");
			});
	};

	const handleFileDelete = (e) => {
		e.preventDefault();
		const loading = toast.loading("جاري حذف الملف ..");
		apiClient
			.post(
				"/api/Customer/DeleteDocument",
				{
					EntityType: Number(EntityType),
					DocumentId: response.docuemntId,
					User: Number(session.user.id),
				},
				{
					headers: {
						"content-type": "multipart/form-data",
					},
				}
			)
			.then((res) => {
				toast.dismiss(loading);
				if (res.data.isSuccess) {
					toast.success("تم حذف الملف بنجاح");
					setResponse(null);
					setFile(null);
					// setIsUploaded(false);
					inputRef.current.value = null;
				}
				if (res.data.isSuccess === false) {
					toast.error("لقد حدث خطأ");
				}
			})
			.catch((error) => {
				console.error(error);
			});
	};
	useEffect(() => {
		if (file) {
			handleFileUpload();
		}
	}, [file]);
	return (
		<div>
			<Toaster position="bottom-center" />
			{fileName && (
				<p className="mb-2 text-gray-500">
					<span className="ml-1 font-semibold">{fileName}</span>
					{isMandatory && (
						<span className="">{isMandatory ? "(إجباري)" : "(إختياري)"}</span>
					)}
				</p>
			)}
			<div className=" relative">
				<label className="flex flex-col justify-center items-center py-12 px-16 mb-4 bg-[#FCFCFC] hover:bg-gray-50 transition-all duration-300 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer">
					<div className="flex flex-col justify-center items-center pt-5 pb-6">
						{FileUploadIcon}
						<p className="mb-2 text-sm  dark:text-gray-400 text-center">
							<span className="font-semibold text-[#00BAFF] mb-3">
								إضغط هنا لرفع مستند
							</span>
							<br />
						</p>
					</div>
					<input
						type="file"
						className="hidden"
						ref={inputRef}
						onChange={(e) => {
							e.preventDefault();
							setFile(e.target.files[0]);
						}}
						disabled={file ? true : false}
					/>
				</label>
				{response && response.url && (
					<div className=" absolute top-6 right-4 z-40">
						<a
							href={response.url}
							download={response.id}
							target="_blank"
							rel="noopener noreferrer"
						>
							{ViewIcon}
						</a>
					</div>
				)}
				{response && response.docuemntId && (
					<div
						onClick={(e) => {
							handleFileDelete(e);
						}}
						className=" absolute top-6 right-12 z-40"
					>
						{DeleteIcon}
					</div>
				)}
			</div>
		</div>
	);
};

const FileUploadIcon = (
	<svg
		width="56"
		height="57"
		viewBox="0 0 56 57"
		className="mb-4"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M41.6735 9.34839H33.4334C31.3817 9.36249 29.4332 8.45058 28.1305 6.86657L25.4174 3.11725C24.1371 1.51815 22.1886 0.600854 20.1396 0.632635H14.3158C3.85824 0.632635 2.62432e-06 6.76584 2.62432e-06 17.1968V28.4671C-0.0139968 29.7066 55.9865 29.7066 55.9893 28.4671V25.1934C56.0397 14.7625 52.2795 9.35119 41.6735 9.35119V9.34839Z"
			fill="#A0A3BD"
		/>
		<path
			opacity="0.1"
			fillRule="evenodd"
			clipRule="evenodd"
			d="M41.6735 9.34839H33.4334C31.3817 9.36249 29.4332 8.45058 28.1305 6.86657L25.4174 3.11725C24.1371 1.51815 22.1886 0.600854 20.1396 0.632635H14.3158C3.85824 0.632635 2.62432e-06 6.76584 2.62432e-06 17.1968V28.4671C-0.0139968 29.7066 55.9865 29.7066 55.9893 28.4671V25.1934C56.0397 14.7625 52.2795 9.35119 41.6735 9.35119V9.34839Z"
			fill="black"
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M52.7274 13.0363C53.6234 14.0856 54.315 15.2887 54.7714 16.5898C55.6617 19.2591 56.0733 22.0654 55.9893 24.8802V39.5781C55.9856 40.816 55.8939 42.0521 55.7149 43.277C55.3746 45.4397 54.6136 47.5148 53.475 49.3851C52.9512 50.2887 52.3152 51.1225 51.5823 51.8669C48.2623 54.9111 43.8578 56.4948 39.358 56.2625H16.6061C12.0994 56.4942 7.68762 54.9121 4.35662 51.8697C3.63237 51.123 3.00494 50.2882 2.4891 49.3851C1.35743 47.5161 0.612872 45.439 0.299588 43.277C0.100117 42.0551 -7.2115e-05 40.819 3.89446e-08 39.5809V24.883C3.89446e-08 23.6547 0.0671973 22.4292 0.198792 21.2093C0.226791 20.9938 0.268789 20.784 0.310787 20.5769C0.380784 20.2272 0.450782 19.8858 0.450782 19.5444C0.702771 18.0727 1.16195 16.6429 1.81713 15.2999C3.76025 11.1533 7.74168 9.04357 14.2654 9.04357H41.6483C45.3021 8.76098 48.928 9.86059 51.8063 12.1214C52.1395 12.4012 52.4475 12.7089 52.7302 13.0391L52.7274 13.0363ZM13.9154 38.5184H42.1466C42.7644 38.5448 43.3672 38.3236 43.821 37.9037C44.2747 37.4839 44.5418 36.9003 44.5629 36.2828C44.5975 35.7406 44.4187 35.2064 44.0645 34.7942C43.6571 34.2388 43.0121 33.9072 42.323 33.8989H13.9154C13.0704 33.8695 12.2768 34.3032 11.8456 35.0299C11.4144 35.7566 11.4144 36.6606 11.8456 37.3873C12.2768 38.1141 13.0704 38.5477 13.9154 38.5184Z"
			fill="#A0A3BD"
		/>
	</svg>
);
const ViewIcon = (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M1.33497 13.2561C0.888345 12.4782 0.888342 11.522 1.33497 10.7441C3.68496 6.65097 7.44378 4 11.6798 4C15.9158 4 19.6746 6.65094 22.0246 10.744C22.4712 11.5219 22.4712 12.4781 22.0246 13.256C19.6746 17.3491 15.9158 20 11.6798 20C7.44377 20 3.68497 17.3491 1.33497 13.2561Z"
			stroke="#999999"
			strokeWidth="2"
		/>
		<circle cx="11.6797" cy="12" r="3" stroke="#999999" strokeWidth="2" />
	</svg>
);
const DeleteIcon = (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M3.76124 19.1998L3.05125 5H20.9488L20.2388 19.1997C20.1323 21.3286 18.3752 23 16.2438 23H7.75625C5.62475 23 3.86768 21.3286 3.76124 19.1998Z"
			stroke="#999999"
			strokeWidth="2"
		/>
		<path
			d="M8 5H16V3C16 1.89543 15.1046 1 14 1H10C8.89543 1 8 1.89543 8 3V5Z"
			stroke="#999999"
			strokeWidth="2"
		/>
		<path d="M1 5H23" stroke="#999999" strokeWidth="2" strokeLinecap="round" />
		<path
			d="M15 11V16"
			stroke="#999999"
			strokeWidth="2"
			strokeLinecap="round"
		/>
		<path d="M9 11V16" stroke="#999999" strokeWidth="2" strokeLinecap="round" />
	</svg>
);
