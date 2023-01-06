import "../styles/globals.scss";
import "../styles/home.scss";

import AppContext from "../context/appContext";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import Layout from "../components/Layout/Layout";
import Moralis from "moralis";
import { extendTheme } from "@chakra-ui/react";

declare global {
  interface Window {
    ethereum: any;
  }
}

Moralis.start({ apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY });

const colors = {
  brand: {
    900: "#1a365d",
    800: "#153e75",
    700: "#2a69ac",
  },
};

const theme = extendTheme({ colors });

// TODO ver bug copy address en index
// TODO ver imagen de index cuando esta cargando

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <AppContext>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AppContext>
    </ChakraProvider>
  );
}
