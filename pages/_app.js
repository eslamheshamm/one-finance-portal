import { useState } from "react";
import "../src/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import {
	Hydrate,
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
function MyApp({ Component, pageProps: { session, ...pageProps } }) {
	const [queryClient] = useState(() => new QueryClient());

	return (
		<QueryClientProvider client={queryClient}>
			<ReactQueryDevtools />
			<SessionProvider session={session}>
				<Component {...pageProps} />
			</SessionProvider>{" "}
		</QueryClientProvider>
	);
}

export default MyApp;
