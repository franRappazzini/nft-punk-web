import "../styles/globals.scss";

import AppContext from "../context/appContext";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import Layout from "../components/Layout/Layout";
import Moralis from "moralis";

declare global {
  interface Window {
    ethereum: any;
  }
}

// moralis initialization
Moralis.start({ apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <AppContext>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AppContext>
    </ChakraProvider>
  );
}
