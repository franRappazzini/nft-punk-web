import { Button, Image, Stack, Text } from "@chakra-ui/react";

import avatar404 from "../public/assets/404avataaars.svg";
import { useRouter } from "next/router";

const Error404 = () => {
  const { push } = useRouter();

  return (
    <Stack flexDirection="column" alignItems="center" p={3}>
      <Text fontSize={32} fontWeight={600}>
        Error 404
      </Text>
      <Text fontSize={20}>Lo sentimos, la página solicitada no existe..</Text>
      <Button onClick={() => push("/")} variant="ghost" colorScheme="green">
        Volver al Inicio
      </Button>

      <Image src={avatar404.src} alt="avatar error 404" />
    </Stack>
  );
};

export default Error404;
