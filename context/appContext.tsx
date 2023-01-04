import { IError, INFTs } from "../utils/interfaces";
import { createContext, useContext, useEffect, useState } from "react";

import Moralis from "moralis";
import NFTPunk from "../contract/NFTPunk.json";

interface Props {
  children: JSX.Element;
}

interface IAppContext {
  nfts: INFTs;
  connectWallet: () => Promise<any>;
  switchNetwork: () => Promise<any>;
  account: string;
  error: IError;
  removeError: () => void;
}

const sampleAppContext: IAppContext = {
  nfts: { loading: true, data: [], length: 0 },
  connectWallet: () => new Promise(() => {}),
  switchNetwork: () => new Promise(() => {}),
  account: "",
  error: { error: false, message: "", code: 0, btn: "" },
  removeError: () => {},
};

const appContext = createContext<IAppContext>(sampleAppContext);
export const useAppContext = () => useContext(appContext);

const AppContext = ({ children }: Props) => {
  const [account, setAccount] = useState<string>(sampleAppContext.account);
  const [nfts, setNfts] = useState(sampleAppContext.nfts);
  const [error, setError] = useState(sampleAppContext.error);

  useEffect(() => {
    const { ethereum } = window;
    if (ethereum) {
      // listen for accounts change and chain change
      ethereum.on("accountsChanged", () => console.log()); //window.location.reload());
      ethereum.on("chainChanged", (chainId: string) => {
        if (chainId === "0x13881") removeError();
        else
          setError({
            error: true,
            message: `Por favor cambie a la red Polygon Mumbai Testnet`,
            code: 1,
            btn: "Cambiar de red",
          });
      });

      // verify if the user is connected to the correct network
      ethereum.request({ method: "eth_chainId" }).then((chainId: string) => {
        if (chainId !== "0x13881") {
          setError({
            error: true,
            message: `Por favor cambie a la red Polygon Mumbai Testnet`,
            code: 1,
            btn: "Cambiar de red",
          });
        }
      });

      // get user account
      (async () => {
        const accounts = await ethereum.request({ method: "eth_accounts" });
        if (accounts.length) setAccount(accounts[0]);
        else
          setError({
            error: true,
            message: "Por favor conéctese con MetaMask",
            code: 3,
            btn: "Conectar",
          });
      })();
    }
  }, []);

  useEffect(() => {
    if (!account?.length)
      setError({
        error: true,
        message: "Por favor conéctese con MetaMask",
        code: 3,
        btn: "Conectar",
      });
    else removeError();
  }, [account]);

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
    }
  };

  const removeError = () => setError({ error: false, message: "", code: 0, btn: "" });

  // get nft punks
  useEffect(() => {
    (async () => {
      try {
        const { raw } = await Moralis.EvmApi.nft.getContractNFTs({
          address: NFTPunk.address,
          chain: "0x13881", // polygon mumbai testnet
        });

        console.log(raw.result);

        setNfts({ loading: false, data: raw.result || [], length: raw.result?.length || 0 });
      } catch (err) {
        console.log(err);
        setNfts(sampleAppContext.nfts);
      }
    })();
  }, []);

  return (
    <appContext.Provider
      value={{ account, nfts, connectWallet, switchNetwork, error, removeError }}
    >
      {children}
    </appContext.Provider>
  );
};

export default AppContext;
