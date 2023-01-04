import { Card, CardBody, Heading, Image, Stack } from "@chakra-ui/react";

import Link from "next/link";

interface Props {
  token_id?: string;
  metadata?: string;
  name?: string;
  image?: string;
}

const NftCard = ({ token_id, name, metadata, image }: Props) => {
  const img = image ? image : metadata ? JSON.parse(metadata).image : "";
  const nameId = name?.includes("#") ? name : name + " #" + token_id;

  return (
    <Link href={`/nft/${token_id}`}>
      <Card maxW="sm">
        <CardBody>
          <Stack>
            <Image src={img} alt={nameId} borderRadius="lg" />
          </Stack>
          <Heading size="md" textAlign="center" mt={6}>
            {nameId}
          </Heading>
        </CardBody>
      </Card>
    </Link>
  );
};

export default NftCard;
