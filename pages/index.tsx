import {
  Badge,
  Button,
  Flex,
  Heading,
  Image,
  SkeletonText,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";

import Link from "next/link";
import defaultAvatar from "../public/assets/avataaars.svg";
import { parseAddress } from "../utils/functions";
import { useAppContext } from "../context/appContext";
import useContract from "../hooks/useContract";
import useRandomImage from "../hooks/useRandomImage";
import { useState } from "react";

export default function Home() {
  const { account, nfts, isCorrectNetwork, connectWallet, switchNetwork, setError, getAllNfts } =
    useAppContext();
  const [isMinting, setIsMinting] = useState(false);
  const contract = useContract();
  const image = useRandomImage(nfts.data.length, account);
  const toast = useToast();

  // mint nft  punk
  const mint = async () => {
    if (!account) {
      return setError({
        error: true,
        message: "Por favor conéctese con MetaMask",
        code: 3,
        btn: "Conectar",
      });
    } else if (!isCorrectNetwork) {
      return setError({
        error: true,
        message: `Por favor cambie a la red Polygon Mumbai Testnet`,
        code: 1,
        btn: "Cambiar de red",
      });
    }

    setIsMinting(true);
    try {
      const tx = await contract.mint();

      toast({
        title: "NFT Punk pendiente",
        description: `Pronto verás tu nuevo NFT Punk en la lista. Hash de transacción: ${tx.hash}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      await tx.wait();
      await getAllNfts();

      toast({
        title: "Felicidades",
        description: `Has minteado un NFT Punk exitosamente!`,
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    } catch (err) {
      console.log(err);
      toast({
        title: "Error",
        description: `Lo sentimos, ha ocurrido un error inesperado. Por favor, vuelva a intentarlo`,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
    setIsMinting(false);
  };

  return (
    <Stack
      align={"center"}
      spacing={{ base: 8, md: 10 }}
      p={{ base: 20, md: 4 }}
      direction={{ base: "column", md: "row" }}
    >
      <Stack flex={1} spacing={{ base: 5, md: 10 }}>
        <Heading lineHeight={1.1} fontWeight={600} fontSize={{ base: "3xl", sm: "4xl", lg: "6xl" }}>
          <Text as={"span"} position="relative">
            Crea tu NFT
          </Text>
        </Heading>
        <Text color={"gray.500"}>
          NFT Punk es una colección de Avatares randomizados cuya metadata es almacenada on-chain.
          Poseen características únicas y sólo hay 999 en existencia.
        </Text>
        <Text color={"green.500"}>
          Cada Platzi Punk se genera de forma secuencial basado en tu address, usa el
          previsualizador para averiguar cuál sería tu Platzi Punk si minteas en este momento
        </Text>
        <Stack spacing={{ base: 4, sm: 6 }} direction={{ base: "column", sm: "row" }}>
          <Button colorScheme="green" onClick={mint} isLoading={isMinting}>
            Obtén tu NFT Punk
          </Button>
          <Link href="/nfts">
            <Button colorScheme="green" variant="outline">
              Galería
            </Button>
          </Link>
        </Stack>
      </Stack>

      <Stack flex={1} direction="column" justify={"center"} align={"center"} position={"relative"}>
        <SkeletonText isLoaded={!image.loading} noOfLines={9} spacing="4" skeletonHeight="4">
          <Image
            src={
              !image.loading && image.data !== "" && account && isCorrectNetwork
                ? image.data
                : defaultAvatar.src
            }
            alt="avatar"
          />
        </SkeletonText>

        {!account ? (
          <Badge mt={2} onClick={connectWallet} cursor="pointer">
            Wallet desconectada
          </Badge>
        ) : !isCorrectNetwork ? (
          <Badge mt={2} onClick={switchNetwork} cursor="pointer">
            Red incorrecta
          </Badge>
        ) : (
          <>
            <Flex mt={2}>
              <Badge>
                Next ID:
                <Badge ml={1} colorScheme="green">
                  {nfts.data.length}
                </Badge>
              </Badge>
              <Badge
                ml={2}
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
                cursor="pointer"
              >
                Address:
                <Badge ml={1} colorScheme="green">
                  {parseAddress(account)}
                </Badge>
              </Badge>
            </Flex>
          </>
        )}
      </Stack>
    </Stack>
  );
}
