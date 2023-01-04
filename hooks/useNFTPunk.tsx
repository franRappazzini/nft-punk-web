import { useEffect, useState } from "react";

import { ICompleteNFT } from "../utils/interfaces";
import { ethers } from "ethers";
import useContract from "./useContract";

interface State {
  loading: boolean;
  data: ICompleteNFT;
}

const useNFTPunk = (tokenId: string | string[] | undefined) => {
  const [nft, setNft] = useState<State>({ loading: true, data: {} });
  const contract = useContract();

  useEffect(() => {
    if (window.ethereum && contract.signer && tokenId) {
      (async () => {
        try {
          // const randomDna = await contract.pseudoRandomDNA(tokenId, address);
          const tokenURI = await contract.tokenURI(tokenId);
          const dna = await contract.tokenDNA(tokenId);
          const owner = await contract.ownerOf(tokenId);

          const [
            // tokenURI,
            // dna,
            // owner,
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
            // contract.tokenURI(tokenId),
            // contract.tokenDNA(tokenId),
            // contract.ownerOf(tokenId),
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

          const responseMetadata = await fetch(tokenURI);
          const metadata = await responseMetadata.json();

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

          setNft({ loading: false, data });
        } catch (err) {
          console.log(err);
          setNft({ loading: false, data: {} });
          throw err;
        }
      })();
    }
  }, [contract.signer, tokenId]);

  return nft;
};

export default useNFTPunk;
