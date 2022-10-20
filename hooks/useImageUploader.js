import { useSession } from "next-auth/react";
import { useEffect, useLayoutEffect, useState } from "react";
import apiClient from "../services/apiClient";

const useImageUploader = (apiEndPoind, EntityType, EntityID, TypeID, file) => {
	const { data: session } = useSession();

	const [response, setResponse] = useState({});
	const [progress, setProgress] = useState(0);
	const [uploaded, setUploaded] = useState(false);
	useEffect(() => {
		if (file && EntityID) {
			apiClient
				.post(
					apiEndPoind,
					{
						EntityType: EntityType, // 1 for customer 2 for loan
						EntityID: EntityID, // customer id or loan id
						TypeID: TypeID, //
						user: session.user.id,
						file: file,
					},
					{
						onUploadProgress: (progressEvent) => {
							let percentCompleted = Math.round(
								(progressEvent.loaded * 100) / progressEvent.total
							);
							setProgress(percentCompleted);
						},
						headers: {
							"content-type": "multipart/form-data",
						},
					}
				)
				.then((res) => {
					if (res) {
						const data = res.data;
						setResponse(data);
						setUploaded(true);
					}
				});
		}
	}, [file]);
	return { response, progress, uploaded };
};
export default useImageUploader;
