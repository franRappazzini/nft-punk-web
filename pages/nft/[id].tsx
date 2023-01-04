import {
  Button,
  Heading,
  Spinner,
  Stack,
  Table,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

import NftCard from "../../components/NftCard/NftCard";
import { useAppContext } from "../../context/appContext";
import useNFTPunk from "../../hooks/useNFTPunk";
import { useRouter } from "next/router";
import { useState } from "react";

const NftDetail = () => {
  const { account } = useAppContext();
  const { query } = useRouter();
  const { loading, data } = useNFTPunk(query.id);
  const [isLoading, setIsLoading] = useState(false);

  const isOwner = account === data.owner?.toLowerCase();

  return (
    <Stack spacing={{ base: 8, md: 10 }} p={{ base: 5 }} direction={{ base: "column", md: "row" }}>
      {loading ? (
        <Stack alignItems="center" w="100%">
          <Spinner size="lg" />
        </Stack>
      ) : (
        <>
          <Stack>
            <Stack alignItems="center">
              <NftCard {...data} />
            </Stack>
            <Button
              onClick={isOwner ? console.log : console.log}
              disabled={!isOwner}
              colorScheme={isOwner ? "green" : "gray"}
              variant="outline"
              // isLoading={transfering}
            >
              {isOwner ? "Transferir" : "No eres el dueño"}
            </Button>
          </Stack>
          <Stack width="100%" spacing={5}>
            <Heading>{data.name}</Heading>
            <Text fontSize="xl">{data.description}</Text>
            <Text fontWeight={600}>
              DNA:
              <Tag ml={2} colorScheme="green">
                {data.dna}
              </Tag>
            </Text>
            <Text fontWeight={600}>
              Owner:
              <Tag ml={2} colorScheme="green">
                {data.owner}
              </Tag>
            </Text>
            <Table size="sm" variant="simple">
              <Thead>
                <Tr>
                  <Th>Atributo</Th>
                  <Th>Valor</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.attributes &&
                  Object.entries(data.attributes).map(([key, value]) => (
                    <Tr key={key}>
                      <Td>{key}</Td>
                      <Td>
                        <Tag>{value}</Tag>
                      </Td>
                    </Tr>
                  ))}
              </Tbody>
            </Table>
          </Stack>{" "}
        </>
      )}
    </Stack>
  );
};

export default NftDetail;
