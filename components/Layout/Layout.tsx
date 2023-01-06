import { Button, Stack, Text, useToast } from "@chakra-ui/react";

import Error from "../Error/Error";
import Head from "next/head";
import Link from "next/link";
import PopoverCopy from "../PopoverCopy/PopoverCopy";
import { parseAddress } from "../../utils/functions";
import style from "./Layout.module.scss";
import { useAppContext } from "../../context/appContext";
import { useEffect } from "react";

interface Props {
  children: JSX.Element;
  title?: string;
}

const Layout = ({ children, title = "NFT Punk" }: Props) => {
  const { account, connectWallet, switchNetwork, error, removeError } = useAppContext();
  const toast = useToast();

  // modal error responses
  const handleClick = async () => {
    try {
      if (error.code === 3) {
        const res = await connectWallet();
        if (res?.code) return;
        else removeError();
      } else if (error.code === 2) {
        window.open("https://metamask.io/", "_blank");
        removeError();
      } else if (error.code === 1) {
        const res = await switchNetwork();
        if (res?.code) return;
        else removeError();
      }
    } catch (err) {
      console.log(err);
    }
  };

  // check if the connection is from a mobile
  useEffect(() => {
    const { userAgent } = navigator;
    if (
      userAgent &&
      (userAgent.match(/Android/i) ||
        userAgent.match(/webOS/i) ||
        userAgent.match(/iPhone/i) ||
        userAgent.match(/iPad/i) ||
        userAgent.match(/iPod/i) ||
        userAgent.match(/BlackBerry/i) ||
        userAgent.match(/Windows Phone/i))
    ) {
      toast({
        title: "Atención. Estás usando un dispositivo móvil",
        description:
          "No podrás utilizar ciertas funcionalidades como mintear o ver los detalles completos de un NFT Punk. conéctese desde una computadora para poder usar todas las funcionalidades",
        status: "warning",
        duration: 15000,
        isClosable: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          <PopoverCopy text={account}>
            <Text
              onClick={() => navigator.clipboard.writeText(account)}
              fontWeight={600}
              cursor="pointer"
            >
              {parseAddress(account)}
            </Text>
          </PopoverCopy>
        ) : (
          <Button size="sm" colorScheme="green" onClick={connectWallet}>
            MetaMask
          </Button>
        )}
      </header>

      <main>
        {children}
        {error.error && <Error error={error} onClick={handleClick} removeError={removeError} />}
      </main>

      <footer></footer>
    </>
  );
};

export default Layout;
