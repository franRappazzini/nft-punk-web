import { Button, Stack, Text } from "@chakra-ui/react";

import Error from "../Error/Error";
import Head from "next/head";
import Link from "next/link";
import { parseAddress } from "../../utils/functions";
import style from "./Layout.module.scss";
import { useAppContext } from "../../context/appContext";

interface Props {
  children: JSX.Element;
  title?: string;
}

const Layout = ({ children, title = "NFT Punk" }: Props) => {
  const { account, connectWallet, switchNetwork, error, removeError } = useAppContext();

  const handleClick = async () => {
    try {
      if (error.code === 3) {
        const res = await connectWallet();
        if (res?.code) return;
      } else if (error.code === 2) {
        window.open("https://metamask.io/", "_blank");
      } else if (error.code === 1) {
        const res = await switchNetwork();
        if (res?.code) return;
        else removeError();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <header className={style.layout_header}>
        <nav>
          <h1>
            <Link href="/">NFT Punk</Link>
          </h1>

          <Stack direction="row" spacing={4} align="center">
            <Link href="/">
              <Button colorScheme="green" size="sm" variant="ghost">
                Inicio
              </Button>
            </Link>
            <Link href="/nfts">
              <Button colorScheme="green" size="sm" variant="ghost">
                NFTs
              </Button>
            </Link>
          </Stack>
        </nav>

        {account ? (
          <Text
            onClick={() => navigator.clipboard.writeText(account)}
            fontWeight={600}
            cursor="pointer"
          >
            {parseAddress(account)}
          </Text>
        ) : (
          <Button size="sm" colorScheme="green" onClick={connectWallet}>
            MetaMask
          </Button>
        )}
      </header>

      <main>
        {children}
        {error.error && <Error error={error} onClick={handleClick} />}
      </main>

      <footer></footer>
    </>
  );
};

export default Layout;
