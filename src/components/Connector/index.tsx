import React from "react";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import classNames from "classnames";
import { toast } from "react-toastify";
import { Contract } from "crossbell.js";
import BrowserOnly from "@docusaurus/BrowserOnly";

function getWeb3Modal() {
  const web3Modal = new Web3Modal({
    network: "mainnet",
    cacheProvider: false,
    disableInjectedProvider: false,
    providerOptions: {
      walletconnect: {
        package: WalletConnectProvider, // required
        options: {
          rpc: {
            3737: "https://rpc.crossbell.io",
          },
        },
      },
    },
  });

  return web3Modal;
}

export function MyConnector() {
  const [loading, setLoading] = React.useState(false);
  const [address, setAddress] = React.useState(undefined);

  const handleConnect = async () => {
    if (loading || address) return;
    try {
      setLoading(true);
      const provider = await getWeb3Modal().connect();
      console.log({ provider });
      window.contract = new Contract(provider);
      window.address = provider.selectedAddress;
      await window.contract.connect();
      console.log(await window.contract.getBalance(provider.selectedAddress));
      // toast("Connected", { type: "success" });
      setAddress(provider.selectedAddress);
    } catch (e) {
      console.log({ e });
      toast("Error: " + e.message, { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={classNames("btn break-all", {
        "btn-primary": !address,
        "btn-success": address,
        loading: loading,
      })}
      onClick={handleConnect}
    >
      {address ? "Connected: " + address : "Connect to Wallet"}
    </button>
  );
}

export default function BrowserOnlyConnector() {
  return <BrowserOnly>{() => <MyConnector />}</BrowserOnly>;
}
