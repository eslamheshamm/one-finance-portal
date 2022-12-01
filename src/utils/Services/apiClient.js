import axios from "axios";
import { getSession } from "next-auth/react";

// working http
// http://prod.onefinance-eg.com:8081/

// https://test.onefinance-eg.com:8000

// new api https://192.168.100.2:8001/
const baseURL = `http://test.onefinance-eg.com:8002`;

const ApiClient = () => {
	const defaultOptions = {
		baseURL,
	};

	const instance = axios.create(defaultOptions);

	instance.interceptors.request.use(async (request) => {
		const session = await getSession();
		if (session) {
			request.headers.Authorization = `Bearer ${session.user.data.token}`;
			request.headers["Access-Control-Allow-Origin"] = `*`;
			request.headers["lang"] = `AR`;
		}
		return request;
	});
	instance.interceptors.response.use(
		(response) => {
			return response;
		},
		(error) => {
			console.log(`error`, error);
		}
	);
	return instance;
};

export default ApiClient();
