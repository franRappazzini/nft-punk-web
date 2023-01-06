import { useEffect, useState } from "react";

import NFTPunk from "../contract/NFTPunk.json";
import { Signer } from "ethers/lib/ethers";
import { ethers } from "ethers";
import { useAppContext } from "../context/appContext";

const useContract = () => {
  const { account, isCorrectNetwork } = useAppContext();
  const [signer, setSigner] = useState<Signer>();

  // contract initialization
  useEffect(() => {
    const { ethereum } = window;
    if (ethereum && isCorrectNetwork) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      setSigner(provider.getSigner());
    }
  }, [account, isCorrectNetwork]);

  return new ethers.Contract(NFTPunk.address, NFTPunk.abi, signer);
};

export default useContract;
