import { useEffect, useState } from "react";

import { ICompleteNFT } from "../utils/interfaces";
import { ethers } from "ethers";
import { useAppContext } from "../context/appContext";
import useContract from "./useContract";

interface State {
  loading: boolean;
  data: ICompleteNFT;
  limit: boolean;
}

const useNFTPunk = (tokenId: string | string[] | undefined) => {
  const [nft, setNft] = useState<State>({ loading: true, data: {}, limit: false });
  const contract = useContract();
  const { account, isCorrectNetwork, nfts } = useAppContext();

  // check if tokenId is higher than length
  const limit =
    tokenId === "0"
      ? false
      : !nfts.loading
      ? nfts.length < (parseInt(typeof tokenId === "string" ? tokenId : "0") || Infinity)
      : null;

  // get nft punk data
  useEffect(() => {
    if (
      window.ethereum &&
      contract.signer &&
      tokenId &&
      isCorrectNetwork &&
      account &&
      limit === false
    ) {
      (async () => {
        try {
          const dna = await contract.tokenDNA(tokenId);

          const [
            tokenURI,
            owner,
            accessoriesType,
            clotheColor,
            clotheType,
            eyeType,
            eyeBrowType,
            facialHairColor,
            facialHairType,
            hairColor,
            hatColor,
            graphicType,
            mouthType,
            skinColor,
            topType,
          ] = await Promise.all([
            contract.tokenURI(tokenId),
            contract.ownerOf(tokenId),
            contract.getAccesoriesType(dna),
            contract.getClotheColor(dna),
            contract.getClotheType(dna),
            contract.getEyeType(dna),
            contract.getEyeBrowType(dna),
            contract.getFacialHairColor(dna),
            contract.getFacialHairType(dna),
            contract.getHairColor(dna),
            contract.getHatColor(dna),
            contract.getGraphicType(dna),
            contract.getMouthType(dna),
            contract.getSkinColor(dna),
            contract.getTopType(dna),
          ]);

          // get metadata
          const res = await fetch(tokenURI);
          const metadata = await res.json();

          const data = {
            tokenId,
            attributes: {
              accessoriesType,
              clotheColor,
              clotheType,
              eyeType,
              eyeBrowType,
              facialHairColor,
              facialHairType,
              hairColor,
              hatColor,
              graphicType,
              mouthType,
              skinColor,
              topType,
            },
            tokenURI,
            dna: ethers.utils.formatEther(dna),
            owner,
            ...metadata,
          };

          setNft({ loading: false, data, limit: false });
        } catch (err) {
          console.log(err);
          setNft({ loading: false, data: {}, limit: false });
          throw err;
        }
      })();
    } else if (limit) {
      setNft({ loading: false, data: {}, limit: true });
    }
  }, [account, contract.signer, isCorrectNetwork, limit, tokenId]);

  return nft;
};

export default useNFTPunk;
