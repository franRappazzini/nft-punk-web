import { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from "react";
import { IError, INFTs } from "../utils/interfaces";

import Moralis from "moralis";
import NFTPunk from "../contract/NFTPunk.json";

interface Props {
  children: JSX.Element;
}

interface IAppContext {
  nfts: INFTs;
  getAllNfts: () => Promise<any>;
  connectWallet: () => Promise<any>;
  switchNetwork: () => Promise<any>;
  account: string;
  error: IError;
  setError: Dispatch<SetStateAction<IError>>;
  removeError: () => void;
  isCorrectNetwork: boolean;
}

const sampleAppContext: IAppContext = {
  nfts: { loading: true, data: [], length: 0 },
  getAllNfts: () => new Promise(() => {}),
  connectWallet: () => new Promise(() => {}),
  switchNetwork: () => new Promise(() => {}),
  account: "",
  error: { error: false, message: "", code: 0, btn: "" },
  setError() {},
  removeError() {},
  isCorrectNetwork: false,
};

const appContext = createContext<IAppContext>(sampleAppContext);
export const useAppContext = () => useContext(appContext);

const AppContext = ({ children }: Props) => {
  const [account, setAccount] = useState<string>(sampleAppContext.account);
  const [nfts, setNfts] = useState(sampleAppContext.nfts);
  const [error, setError] = useState(sampleAppContext.error);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(sampleAppContext.isCorrectNetwork);

  useEffect(() => {
    const { ethereum } = window;
    if (ethereum) {
      // listen for accounts change and chain change
      ethereum.on("accountsChanged", (accounts: string[]) => {
        accounts.length ? setAccount(accounts[0]) : window.location.reload();
      });
      ethereum.on("chainChanged", (chainId: string) => {
        if (chainId !== "0x13881") setIsCorrectNetwork(false);
        else setIsCorrectNetwork(true);
      });

      // dapp initialization
      (async () => {
        // verify if the netwoek is correct
        await ethereum.request({ method: "eth_chainId" }).then((chainId: string) => {
          if (chainId !== "0x13881") setIsCorrectNetwork(false);
          else setIsCorrectNetwork(true);
        });

        // verify if there is an account connected
        const accounts = await ethereum.request({ method: "eth_accounts" });
        accounts.length && setAccount(accounts[0]);
      })();
    }
  }, []);

  // switch network to Polygon Mumbai
  const switchNetwork = async () => {
    const { ethereum } = window;
    if (ethereum) {
      try {
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x13881" }],
        });
      } catch (err: any) {
        // if the chain is not added to MetaMask, is added
        if (err.code === 4902) {
          try {
            await ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0x13881",
                  chainName: "Mumbai Testnet",
                  nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
                  rpcUrls: ["https://rpc-mumbai.maticvigil.com"],
                  blockExplorerUrls: ["https://mumbai.polygonscan.com"],
                },
              ],
            });
          } catch (err) {
            console.log(err);
            return err;
          }
        }
        console.log(err);
        return err;
      }
    }
  };

  // connect to wallet
  const connectWallet = async () => {
    const { ethereum } = window;
    if (ethereum) {
      try {
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });

        // verify if the user is connected to the correct network
        const chainId = await ethereum.request({ method: "eth_chainId" });
        if (chainId !== "0x13881") {
          setError({
            error: true,
            message: `Por favor cambie a la red Polygon Mumbai Testnet`,
            code: 1,
            btn: "Cambiar de red",
          });
        }

        setAccount(accounts[0]);
      } catch (err) {
        console.log(err);
        return err;
      }
    } else {
      console.log("MetaMask is not installed. Please install MetaMask to continue");
      setError({
        error: true,
        message: "MetaMask no está instalada. Por favor instale MetaMask para continuar.",
        code: 2,
        btn: "Instalar MetaMask",
      });
      return { code: 2 };
    }
  };

  const removeError = () => setError({ error: false, message: "", code: 0, btn: "" });

  // get nft punks
  useEffect(() => {
    getAllNfts();
  }, []);

  const getAllNfts = async () => {
    try {
      const { raw } = await Moralis.EvmApi.nft.getContractNFTs({
        address: NFTPunk.address,
        chain: "0x13881", // polygon mumbai testnet
      });

      // order nfts by token id
      const data = raw.result?.sort((a, b) => parseInt(a.token_id) - parseInt(b.token_id));

      setNfts({ loading: false, data: data || [], length: raw.total || 0 });
    } catch (err) {
      console.log(err);
      setNfts(sampleAppContext.nfts);
    }
  };

  return (
    <appContext.Provider
      value={{
        account,
        nfts,
        getAllNfts,
        connectWallet,
        switchNetwork,
        error,
        setError,
        removeError,
        isCorrectNetwork,
      }}
    >
      {children}
    </appContext.Provider>
  );
};

export default AppContext;
