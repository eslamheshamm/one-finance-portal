module.exports = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
		"node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
	],
	theme: {
		extend: {
			fontFamily: {
				Poppins: ["Poppins", "sans-serif"],
				Cairo: ["Cairo", "sans-serif"],
			},
		},
	},
	plugins: [require("flowbite/plugin"), require("@tailwindcss/forms")],
};
