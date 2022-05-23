import React, { useCallback } from "react";
import { toast } from "react-toastify";
import classNames from "classnames";
import debounce from "lodash.debounce";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import Link from "@docusaurus/Link";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";
import BrowserOnly from "@docusaurus/BrowserOnly";

export default function ProfileCreator() {
  const { width, height } = useWindowSize();

  const [loading, setLoading] = React.useState(false);
  const [handle, setHandle] = React.useState("");
  const [handleExists, setHandleExists] = React.useState(false);
  const [profileId, setProfileId] = React.useState(undefined);
  const [txHash, setTxHash] = React.useState(undefined);

  const checkIfHandleExists = useCallback(
    debounce(async (handle) => {
      try {
        const { data: exists } = await window.contract.existsProfileForHandle(
          handle
        );

        console.log({ exists, handle });
        if (exists) {
          setHandleExists(true);
        } else {
          setHandleExists(false);
        }
      } catch (e) {
        toast(`Error: ${e.message}`, { type: "error" });
      }
    }, 500),
    []
  );

  const handleCreate = async () => {
    if (txHash) {
      window.open(`https://etherscan.io/tx/${txHash}`, "_blank");
      return;
    }

    if (!window.address || !window.contract) {
      toast("Please complete Step 1 first.", { type: "error" });
      return;
    }

    if (handle.length < 3) {
      toast("Handle must be at least 3 characters.", { type: "error" });
    }

    try {
      setLoading(true);
      const result = await window.contract.createProfile(
        window.address,
        handle,
        ""
      );
      toast(`Profile created! (tx: ${result.transactionHash})`, {
        type: "success",
      });
      setProfileId(result.data);
      setTxHash(result.transactionHash);
      console.log({ result });
    } catch (e) {
      console.error(e);
      toast(`Error: ${e.message}`, { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = async (e) => {
    const value = e.target.value;
    setHandle(value);

    if (!window.address || !window.contract || txHash) {
      return;
    }

    if (value.length >= 3) {
      checkIfHandleExists(value);
    } else {
      setHandleExists(false);
    }
  };

  const isValidRegex = /^[a-z0-9\-\_]+$/.test(handle);
  const isValidLength =
    handle.length === 0 || (handle.length >= 3 && handle.length <= 31);
  const isValidHandle =
    handle.length > 0 && !handleExists && isValidLength && isValidRegex;

  return (
    <BrowserOnly>
      {() => (
        <div>
          <p>
            A profile contains many properties (e.g., handle, name, bio,
            avatars, etc). Here we will create one with the only required
            property being the <strong>handle</strong>.
          </p>

          <p>
            You may consider a handle as <u>a unique identifier</u> on Crossbell
            for your profile.
          </p>

          <p>Let's give it a good one! (You can change it later on.)</p>

          <div className="form-control w-full max-w-xs">
            <div>
              <label className="label">
                <span className="label-text">
                  What is your ideal profile handle?
                </span>
                <span className="label-text-alt">{handle.length}/31</span>
              </label>

              <input
                type="text"
                placeholder="Type a handle here"
                className={classNames("input input-bordered w-full max-w-xs", {
                  "input-error": handle.length > 0 && !isValidHandle,
                })}
                onInput={handleChange}
                maxLength={31}
                minLength={3}
              />

              <label className="label">
                <span className="label-text-alt text-error">
                  {handleExists && <>Handle already exists. </>}
                  {!isValidLength && (
                    <>Handle must be between 3 and 31 characters. </>
                  )}
                  {handle.length > 0 && !isValidRegex && (
                    <>
                      Handle must only contain alphanumeric or numeric
                      characters, or special character _ or -.{" "}
                    </>
                  )}
                </span>
              </label>
            </div>

            <button
              className={classNames("btn btn-primary", {
                loading: loading,
                "btn-success": profileId,
              })}
              onClick={handleCreate}
              disabled={!isValidHandle}
            >
              {profileId
                ? `Profile created! (ID: ${profileId})`
                : loading
                ? "Minting..."
                : "Create profile"}
            </button>
          </div>

          {txHash && (
            <div className="alert alert-success shadow-lg break-all mt-5">
              <div className="z-50 fixed top-0 bottom-0 left-0 right-0 pointer-events-none">
                <Confetti
                  width={width}
                  height={height}
                  numberOfPieces={300}
                  recycle={false}
                />
              </div>

              <div>
                <FontAwesomeIcon icon={solid("circle-check")} />
                <span>
                  <div className="font-bold text-xl">Congratulations!!</div>
                  You have created your profile (ProfileID: {profileId}). <br />
                  You can check this transaction on{" "}
                  <Link href={`https://scan.crossbell.io/tx/${txHash}`}>
                    https://scan.crossbell.io/tx/{txHash}
                  </Link>
                  .
                </span>
              </div>
            </div>
          )}

          {txHash && (
            <>
              <p className="mt-5">
                As you see, a profile is an NFT on Crossbell. And more things
                like social linking (following and followers), articles,
                comments, likes, collections, ... could all be NFTs on
                Crossbell!
              </p>

              <p>
                That's what{" "}
                <strong className="text-primary">
                  Capitalizing Your Social Activities
                </strong>{" "}
                means!
              </p>
            </>
          )}
        </div>
      )}
    </BrowserOnly>
  );
}
