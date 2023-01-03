import { useEffect, useState } from "react";

import useContract from "./useContract";

const useRandomImage = (tokenId: number, address: string) => {
  const [image, setImage] = useState<string>("");
  const contract = useContract();

  useEffect(() => {
    if (window.ethereum && contract.signer) {
      (async () => {
        try {
          const randomDna = await contract.pseudoRandomDNA(tokenId, address);

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
            // contract.tokenURI(randomDna),
            // contract.tokenDNA(randomDna),
            // contract.ownerOf(randomDna),
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

          setImage(randomImg);
        } catch (err) {
          console.log(err);
        }
      })();
    }
  }, [address, contract, tokenId]);

  return image;
};

// // Plural
// const usePlatziPunksData = ({ owner = null } = {}) => {
//   const [punks, setPunks] = useState([]);
//   const { library } = useWeb3React();
//   const [loading, setLoading] = useState(true);
//   const platziPunks = usePlatziPunks();

//   const update = useCallback(async () => {
//     if (platziPunks) {
//       setLoading(true);

//       let tokenIds;

//       if (!library.utils.isAddress(owner)) {
//         const totalSupply = await platziPunks.methods.totalSupply().call();
//         tokenIds = new Array(Number(totalSupply)).fill().map((_, index) => index);
//       } else {
//         const balanceOf = await platziPunks.methods.balanceOf(owner).call();

//         const tokenIdsOfOwner = new Array(Number(balanceOf))
//           .fill()
//           .map((_, index) => platziPunks.methods.tokenOfOwnerByIndex(owner, index).call());

//         tokenIds = await Promise.all(tokenIdsOfOwner);
//       }

//       const punksPromise = tokenIds.map((tokenId) => getPunkData({ tokenId, platziPunks }));

//       const punks = await Promise.all(punksPromise);

//       setPunks(punks);
//       setLoading(false);
//     }
//   }, [platziPunks, owner, library?.utils]);

//   useEffect(() => {
//     update();
//   }, [update]);

//   return {
//     loading,
//     punks,
//     update,
//   };
// };

// Singular
// const useNFTPunkData = (tokenId: number) => {
//   const [punk, setPunk] = useState({});
//   const [loading, setLoading] = useState(true);
//   const contract = useContract();

//   const update = useCallback(async () => {
//     if (contract) {
//       setLoading(true);

//       const toSet = await GetPunkData(tokenId);
//       setPunk(toSet);

//       setLoading(false);
//     }
//   }, [contract, tokenId]);

//   useEffect(() => {
//     update();
//   }, [update]);

//   return {
//     loading,
//     punk,
//     update,
//   };
// };

export default useRandomImage;
