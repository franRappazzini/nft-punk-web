import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
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
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

import NftCard from "../../components/NftCard/NftCard";
import { useAppContext } from "../../context/appContext";
import useContract from "../../hooks/useContract";
import useNFTPunk from "../../hooks/useNFTPunk";
import { useRouter } from "next/router";

interface Ownership {
  isOwner: boolean;
  owner: string | undefined;
}

const NftDetail = () => {
  const { account, isCorrectNetwork, connectWallet, switchNetwork } = useAppContext();
  const [to, setTo] = useState<string>("");
  const [ownership, setOwnership] = useState<Ownership>();
  const [isTransfering, setIsTransfering] = useState(false);
  const { query } = useRouter();
  const { loading, data, limit } = useNFTPunk(query.id);
  const contract = useContract();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const initialRef = useRef(null);
  const finalRef = useRef(null);

  // set nft ownership
  useEffect(() => {
    setOwnership({
      isOwner: account.toLowerCase() === data.owner?.toLowerCase(),
      owner: data.owner,
    });

    // prevent change account before transfer
    if (!(account.toLowerCase() === data.owner?.toLowerCase())) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, data.owner]);

  // tranfer nft and update ownership
  const handleTransfer = async () => {
    if (!ownership?.isOwner) return;
    if (!/^0x[a-fA-F0-9]{40}$/g.test(to))
      return toast({
        title: "Atención",
        description: `La address de destino no es correcta. Debe tener un formato ejemplo: ${account}`,
        status: "warning",
        duration: 4000,
        isClosable: true,
      });

    setIsTransfering(true);
    try {
      const tx = await contract.transferFrom(account, to, query.id);

      toast({
        title: "Transacción pendiente",
        description: `En pocos segundos el ${data.name || "NFT"} se transferirá.
        Hash de transacción: ${tx.hash}`,
        status: "success",
        duration: 6000,
        isClosable: true,
      });

      setOwnership({ isOwner: false, owner: to });
      onClose();
      await tx.wait();

      toast({
        title: "Felicidades!",
        description: `El ${data.name || "NFT"} ha sido transferido exitosamente!`,
        status: "success",
        duration: 6000,
        isClosable: true,
      });
    } catch (err) {
      console.log(err);
      toast({
        title: "Error",
        description: "Lo sentimos, ocurrió un error inesperado. Vuelva a intentarlo nuevamente.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
    setIsTransfering(false);
  };

  if (!account || !isCorrectNetwork) {
    return (
      <Stack alignItems="center">
        <Alert status="error" w="fit-content">
          <AlertIcon />
          <AlertTitle>Error!</AlertTitle>
          <AlertDescription>
            {!account
              ? "Por favor conéctese con MetaMask."
              : "Por favor cambie a la red Polygon Mumbai Testnet para continuar."}
          </AlertDescription>

          <Button
            size="sm"
            ml={3}
            variant="solid"
            colorScheme="green"
            onClick={!account ? connectWallet : switchNetwork}
          >
            {!account ? "Conectarse con MetaMask" : "Cambiar de Red"}
          </Button>
        </Alert>
      </Stack>
    );
  }

  return (
    <Stack spacing={{ base: 8, md: 10 }} p={{ base: 5 }} direction={{ base: "column", md: "row" }}>
      {loading ? (
        <Stack alignItems="center" w="100%">
          <Spinner size="lg" />
        </Stack>
      ) : limit ? (
        <Text textAlign="center" w="100%">
          Lo sentimos, el NFT Punk solicitado no existe.
        </Text>
      ) : (
        <>
          <Stack>
            <Stack alignItems="center">
              <NftCard {...data} />
            </Stack>
            <Button
              onClick={ownership?.isOwner ? onOpen : console.log}
              disabled={!ownership?.isOwner}
              colorScheme={ownership?.isOwner ? "green" : "gray"}
              variant="outline"
            >
              {ownership?.isOwner ? "Transferir" : "No eres el dueño"}
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
              <Tag
                ml={2}
                colorScheme="green"
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
                {ownership?.owner}
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
          </Stack>

          <Modal
            initialFocusRef={initialRef}
            finalFocusRef={finalRef}
            isOpen={isOpen}
            onClose={onClose}
            isCentered
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Transferir {data.name || "NFT Punk"}</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <FormControl>
                  <FormLabel>Address de destino</FormLabel>
                  <Input
                    focusBorderColor="#2F855A"
                    ref={initialRef}
                    placeholder={account}
                    onChange={(e) => setTo(e.target.value)}
                    value={to}
                    isInvalid={!/^0x[a-fA-F0-9]{40}$/g.test(to)}
                    errorBorderColor="crimson"
                  />
                </FormControl>
              </ModalBody>

              <ModalFooter>
                <Button onClick={onClose} mr={3} variant="ghost">
                  Cancelar
                </Button>
                <Button
                  colorScheme="green"
                  variant="outline"
                  onClick={handleTransfer}
                  isLoading={isTransfering}
                >
                  Enviar
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )}
    </Stack>
  );
};

export default NftDetail;
