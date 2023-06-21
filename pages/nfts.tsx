import { Grid, SkeletonText } from "@chakra-ui/react";

import NftCard from "../components/NftCard/NftCard";
import { useAppContext } from "../context/appContext";

const Nfts = () => {
  const { nfts } = useAppContext();

  const skeletons = new Array(8)
    .fill(0)
    .map((_, i) => <SkeletonText mt="4" noOfLines={10} spacing="4" skeletonHeight="4" key={i} />);

  return (
    <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6} p={6}>
      {nfts.loading
        ? skeletons.map((s) => s)
        : nfts.data?.length > 0
        ? nfts.data.map((nft) => <NftCard key={nft.token_id} {...nft} />)
        : "Ha ocurrido un error, vuelva a intentarlo por favor."}
    </Grid>
  );
};

export default Nfts;
