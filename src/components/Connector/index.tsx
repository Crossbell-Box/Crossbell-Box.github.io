import React from "react";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import classNames from "classnames";
import { toast } from "react-toastify";
import { Contract } from "crossbell.js";

const web3Modal = new Web3Modal({
  network: "mainnet",
  cacheProvider: false,
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

export default function Connector() {
  const [loading, setLoading] = React.useState(false);
  const [address, setAddress] = React.useState(undefined);

  const handleConnect = async () => {
    if (loading || address) return;
    try {
      setLoading(true);
      const provider = await web3Modal.connect();
      console.log({ provider });
      window.contract = new Contract(provider);
      window.address = provider.selectedAddress;
      await window.contract.connect();
      console.log(
        await window.contract.getPrimaryProfileId(provider.selectedAddress)
      );
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
