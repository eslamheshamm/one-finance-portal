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
				// new test backend  https://192.168.100.2:8002/
				// new test url https://test.onefinance-eg.com:8002/
				// new tst 127.0.0.1:5003
				try {
					const res = await axios.post(
						"https://test.onefinance-eg.com:8002/api/User/UserLogin",
						{
							userName: credentials.username,
							password: credentials.password,
						},
						{
							timeout: 2000000,
						}
					);
					if (res.data.isSuccess) {
						return {
							token: res.data.token,
							...res.data,
						};
					}
					return null;
				} catch (err) {
					console.error(err, "error");
					return null;
				}
			},
		}),
	],
	session: {
		maxAge: 60 * 60 * 7, // 7 houres
		keepAlive: 60 * 60 * 7, // 7 hours
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
