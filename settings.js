export const settings = {
	API_URL: "",
	LOGIN_URL: "",
};

if (process.env.NEXT_ENV == "development") {
	settings.API_URL = "https://test.onefinance-eg.com:8000";
	// settings.API_URL = "https://test.onefinance-eg.com:8000";
	settings.LOGIN_URL = "https://192.168.100.2:8000";
} else {
	settings.API_URL = "https://prod.onefinance-eg.com:8000";
	settings.LOGIN_URL = "http://192.168.100.3:8081";
}
