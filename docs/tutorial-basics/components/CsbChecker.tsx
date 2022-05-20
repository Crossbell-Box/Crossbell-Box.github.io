import classNames from "classnames";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import Link from "@docusaurus/Link";

const ZERO_CSB = ethers.utils.formatEther("0");

export default function Claim() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(undefined);

  const handleCheck = async () => {
    if (!window.address || !window.contract) {
      toast("Please complete Step 1 first.", { type: "error" });
      return;
    }

    try {
      setLoading(true);
      const { data } = await window.contract.getBalance(window.address);
      const csb = ethers.utils.formatEther(data);
      console.log({ csb });
      setBalance(csb);
      setAddress(window.address);
    } catch (e) {
      toast("Error: " + e.message, { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <button
        className={classNames("btn", {
          "btn-primary": !balance,
          "btn-success": balance && balance !== ZERO_CSB,
          "btn-error": balance && balance === ZERO_CSB,
          loading: loading,
        })}
        onClick={handleCheck}
      >
        {balance ? `Balance: ${balance} $CSB` : "Check Balance"}
      </button>

      {balance && balance === ZERO_CSB && (
        <div className="alert alert-error shadow-lg break-all">
          <div>
            <FontAwesomeIcon icon={solid("warning")} />
            <span>
              You don't have any $CSB. Let's{" "}
              <Link href={`https://faucet.crossbell.io/?address=${address}`}>
                claim some on the faucet
              </Link>
              . After you claim, you can come back and click the button above to
              check your balance again.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
