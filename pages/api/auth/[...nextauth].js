import NextAuth from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import axios from "axios";

export default NextAuth({
	providers: [
		CredentialProvider({
			name: "credentials",
			credentials: {
				username: {
					label: "username",
					type: "text",
					placeholder: "username",
				},
				password: { label: "password", type: "password" },
			},
			authorize: async (credentials) => {
				// test: http://127.0.0.1:5001/api/Identity/Login
				// prod http://127.0.0.1:5000/api/Identity/Login
				// new test backend  https://192.168.100.2:8001/
				// new tst 127.0.0.1:5003
				try {
					const response = await axios
						.post("http://192.168.100.2:8002/api/User/UserLogin", {
							userName: credentials.username,
							password: credentials.password,
						})
						.then((res) => {
							console.log(res.data);
							return res.data;
						})
						.catch((err) => {
							console.log(err, "error");
						});
					const data = await response;
					console.log(data.isSuccess);
					if (data.isSuccess) {
						return {
							token: data.token,
							...data,
						};
					}
					return null;
				} catch (err) {
					// Handle Error Here
					console.error(err, "error");
					return null;
				}
			},
		}),
	],
	session: {
		maxAge: 60 * 60 * 7, // 7 houres
		keepAlive: 60 * 60 * 7,
	},
	callbacks: {
		jwt: async ({ token, user }) => {
			user && (token.user = user);
			return token;
		},
		session: async ({ session, token }) => {
			session.user = token.user; // Setting token in session
			return session;
		},
	},
	secret: "d7RtFvQoqZz1tWmqU5uwebjA3HQXCsXI5MgQ+J9GMMU=",
});
