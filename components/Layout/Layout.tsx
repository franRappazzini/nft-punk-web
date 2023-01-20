import { Button, IconButton, Stack, Text, useColorMode, useToast } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { isMobileVersion, parseAddress } from "../../utils/functions";

import Error from "../Error/Error";
import Head from "next/head";
import Link from "next/link";
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
  const { colorMode, toggleColorMode } = useColorMode();

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
    if (isMobileVersion()) {
      toast({
        title: "Estás usando un dispositivo móvil",
        description:
          "Deberás tener instalado MetaMask y la red Polygon Mumbai Testnet para poder interactuar con la dApp",
        status: "warning",
        duration: 10000,
        isClosable: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={style.layout}>
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

        <Stack direction="row" alignItems="center">
          <IconButton
            aria-label="dark-mode"
            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            variant="ghost"
            mr={3}
          />

          {account ? (
            <Text
              onClick={() => {
                navigator.clipboard.writeText(account);
                toast({
                  position: "top",
                  variant: "subtle",
                  description: "Copiado!",
                  status: "success",
                  size: "xs",
                  duration: 1000,
                });
              }}
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
        </Stack>
      </header>

      <main>
        {children}
        {error.error && <Error error={error} onClick={handleClick} removeError={removeError} />}
      </main>

      <footer className={style.layout_footer}>
        <Text>
          © 2023 - Desarrollado por{" "}
          <a
            href="https://www.linkedin.com/in/francisco-rappazzini/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Francisco Rappazzini
          </a>
          .
        </Text>
      </footer>
    </div>
  );
};

export default Layout;
