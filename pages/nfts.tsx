import { Grid, SkeletonText } from "@chakra-ui/react";

import NftCard from "../components/NftCard/NftCard";
import { useAppContext } from "../context/appContext";

const Nfts = () => {
  const { nfts } = useAppContext();

  const skeletons = [
    <SkeletonText mt="4" noOfLines={10} spacing="4" skeletonHeight="4" key={1} />,
    <SkeletonText mt="4" noOfLines={10} spacing="4" skeletonHeight="4" key={2} />,
    <SkeletonText mt="4" noOfLines={10} spacing="4" skeletonHeight="4" key={3} />,
    <SkeletonText mt="4" noOfLines={10} spacing="4" skeletonHeight="4" key={4} />,
    <SkeletonText mt="4" noOfLines={10} spacing="4" skeletonHeight="4" key={5} />,
    <SkeletonText mt="4" noOfLines={10} spacing="4" skeletonHeight="4" key={6} />,
    <SkeletonText mt="4" noOfLines={10} spacing="4" skeletonHeight="4" key={7} />,
    <SkeletonText mt="4" noOfLines={10} spacing="4" skeletonHeight="4" key={8} />,
  ];

  return (
    <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6} p={6}>
      {nfts.loading
        ? skeletons.map((s) => s)
        : nfts.length > 0
        ? nfts.data.map((nft) => <NftCard key={nft.token_id} {...nft} />)
        : "No hay"}
    </Grid>
  );
};

export default Nfts;
