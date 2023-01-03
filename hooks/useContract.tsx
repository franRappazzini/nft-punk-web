import { useEffect, useState } from "react";

import NFTPunk from "../contract/NFTPunk.json";
import { Signer } from "ethers/lib/ethers";
import { ethers } from "ethers";

const useContract = () => {
  const [signer, setSigner] = useState<Signer>();

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setSigner(provider.getSigner());
  }, []);

  return new ethers.Contract(NFTPunk.address, NFTPunk.abi, signer);
};

export default useContract;
