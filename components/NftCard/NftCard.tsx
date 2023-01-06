import { Card, CardBody, Heading, Image, Stack } from "@chakra-ui/react";

import Link from "next/link";
import { useRouter } from "next/router";

interface Props {
  token_id?: string;
  metadata?: string;
  name?: string;
  image?: string;
}

const NftCard = ({ token_id, name, metadata, image }: Props) => {
  const img = image ? image : metadata ? JSON.parse(metadata).image : "";
  const nameId = name?.includes("#") ? name : name + " #" + token_id;
  const { push, pathname } = useRouter();

  const handleClick = () => pathname === "/nfts" && push(`/nft/${token_id}`);

  return (
    <Card maxW="sm" onClick={handleClick} cursor={pathname === "/nfts" ? "pointer" : "auto"}>
      <CardBody>
        <Stack>
          <Image src={img} alt={nameId} borderRadius="lg" />
        </Stack>
        <Heading size="md" textAlign="center" mt={6}>
          {nameId}
        </Heading>
      </CardBody>
    </Card>
  );
};

export default NftCard;
