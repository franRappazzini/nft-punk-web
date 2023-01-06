import { useEffect, useState } from "react";

import useContract from "./useContract";

const useRandomImage = (tokenId: number, address: string) => {
  const [image, setImage] = useState({ loading: true, data: "" });
  const contract = useContract();

  // get next image
  useEffect(() => {
    if (window.ethereum && contract.signer && tokenId) {
      (async () => {
        try {
          // create random dna for get image
          const randomDna = await contract.pseudoRandomDNA(tokenId, address);

          const [
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
            contract.getAccesoriesType(randomDna),
            contract.getClotheColor(randomDna),
            contract.getClotheType(randomDna),
            contract.getEyeType(randomDna),
            contract.getEyeBrowType(randomDna),
            contract.getFacialHairColor(randomDna),
            contract.getFacialHairType(randomDna),
            contract.getHairColor(randomDna),
            contract.getHatColor(randomDna),
            contract.getGraphicType(randomDna),
            contract.getMouthType(randomDna),
            contract.getSkinColor(randomDna),
            contract.getTopType(randomDna),
          ]);

          const randomImg =
            "https://avataaars.io?accesoriesType=" +
            accessoriesType +
            "&clotheColor=" +
            clotheColor +
            "&clotheType=" +
            clotheType +
            "&eyeType=" +
            eyeType +
            "&eyebrowType=" +
            eyeBrowType +
            "&facialHairColor=" +
            facialHairColor +
            "&facialHairType=" +
            facialHairType +
            "&hairColor=" +
            hairColor +
            "&hatColor=" +
            hatColor +
            "&graphicType=" +
            graphicType +
            "&mouthType=" +
            mouthType +
            "&skinColor=" +
            skinColor +
            "&topType=" +
            topType;

          setImage({ loading: false, data: randomImg });
        } catch (err) {
          console.log(err);
          setImage({ loading: false, data: "" });
        }
      })();
    }
  }, [address, contract.signer, tokenId]);

  return image;
};

export default useRandomImage;
