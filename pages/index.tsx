import { Badge, Button, Flex, Heading, Image, Stack, Text } from "@chakra-ui/react";

import Link from "next/link";
import { parseAddress } from "../utils/functions";
import { useAppContext } from "../context/appContext";
import useContract from "../hooks/useContract";
import useRandomImage from "../hooks/useRandomImage";
import { useState } from "react";

export default function Home() {
  const { account, nfts } = useAppContext();
  const [isMinting, setIsMinting] = useState(false);
  const contract = useContract();
  const image = useRandomImage(nfts.length, account);

  const mint = async () => {
    setIsMinting(true);
    try {
      const tx = await contract.mint();
      console.log(tx);
    } catch (err) {
      console.log(err);
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
        <Image src={image ? image : "https://avataaars.io/"} alt="avatar" />

        {account ? (
          <>
            <Flex mt={2}>
              <Badge>
                Next ID:
                <Badge ml={1} colorScheme="green">
                  {nfts.length}
                </Badge>
              </Badge>
              <Badge ml={2}>
                Address:
                <Badge ml={1} colorScheme="green">
                  {parseAddress(account)}
                </Badge>
              </Badge>
            </Flex>
            {/* <Button
              // onClick={getPlatziPunksData}
              mt={4}
              size="xs"
              colorScheme="green"
            >
              Actualizar
            </Button> */}
          </>
        ) : (
          <Badge mt={2}>Wallet desconectada</Badge>
        )}
      </Stack>
    </Stack>
  );
}
