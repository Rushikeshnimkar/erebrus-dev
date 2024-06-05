import Link from "next/link";
import { useState, useEffect, useContext } from "react";

import axios from "axios";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import { AuthContext } from "../AuthContext";
// import { useWallet } from "@aptos-labs/wallet-adapter-react";
// import { WalletConnector } from "@aptos-labs/wallet-adapter-mui-design";
import dynamic from "next/dynamic";
import { Network } from "@aptos-labs/ts-sdk";
import Button from "../components/Button";
import { useRouter } from "next/router";
import SingleSignerTransaction from "../components/transactionFlow/SingleSigner";
const REACT_APP_GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL;
const mynetwork = process.env.NEXT_PUBLIC_NETWORK;
const networkSui = process.env.NEXT_PUBLIC_SUI_NETWORK_SUI;
import { useAccount, useSignMessage } from "wagmi";
import {
  ConnectButton,
  useWallet,
  addressEllipsis,
} from "@suiet/wallet-kit";

import { useWallet as solUseWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { useAptosWallet } from "./Login/aptos";
import { useSuiWallet } from "./Login/suiwallet";
import { useEthWallet } from "./Login/ethereum";
import { useSolWallet } from "./Login/solana";

const networkSol = WalletAdapterNetwork.Devnet;

const variants = {
  open: { opacity: 1, x: 0, y: 0 },
  closed: { opacity: 0, y: 0 },
};

const WalletSelectorAntDesign = dynamic(
  () => import("../components/WalletSelectorAntDesign"),
  {
    suspense: false,
    ssr: false,
  }
);

// const isSendableNetwork = (connected, network) => {
//   return connected && network?.toLowerCase() === mynetwork.toLowerCase() || networkSui || networkSol;
// };

const Navbar = ({ isHome }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [signature, setSignature] = useState("");
  const [challengeId, setChallengeId] = useState("");
  // const [showsignbutton, setshowsignbutton] = useState(false);
  const [link, setlink] = useState("");
  const { isSignedIn, setIsSignedIn } = useContext(AuthContext);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [chainsym, setchainsym] = useState("");
  const [hidefilter, setHideFilter] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState("");
  const [sendable, setSendable] = useState(false);
  const [requiredNetwork, setRequiredNetwork] = useState(false);
  //--------------------------------gpt --------------------------------------------------------------------
  const { account: aptosAccount, connected: aptosConnected, onSignMessage: onSignMessage } = useAptosWallet();
  const {  handleSignMsg } = useSuiWallet();
  const { status, connected, connecting,disconnect, account, network, name } = useWallet();
  const { ethAddress, isConnected: ethConnected, onSignMessageEth } = useEthWallet();
  const { solconnected, solPublicKey, OnSignMessageSol } = useSolWallet();

  const [showsignbuttoneth, setshowsignbuttoneth] = useState(false);
  const [showsignbuttonaptos, setshowsignbuttonaptos] = useState(false);
  const [showsignbuttonsui, setshowsignbuttonsui] = useState(false);
  const [showsignbuttonsol, setshowsignbuttonsol] = useState(false);
  const solAccount = solPublicKey;
  
  console.log("sui connected", status == "connected")
  useEffect(() => {
    console
    if (aptosConnected) {
      setshowsignbuttonaptos(true);
    } else if(status == "connected"){
      setshowsignbuttonsui(true);
    }
    else if(solconnected)
    { setshowsignbuttonsol(true);
    }
    else if(ethConnected)
    { setshowsignbuttoneth(true);
    }
    else{
      setshowsignbuttoneth(false);
      setshowsignbuttonsol(false);
      setshowsignbuttonsui(false);
      setshowsignbuttonaptos(false);
    }
   
  }, [aptosConnected, status == "connected", ethConnected, solconnected]);
  console.log("sui connected", status == "connected")

  

  // const handleSignMessage = (chainsym) => {
  //   if (chainsym === "aptos") {
  //     onSignMessage(chainsym, setshowsignbutton);
  //   } else if (chainsym === "sui") {
  //     onSignMessageSui(chainsym, setshowsignbutton);
  //   } else if (chainsym === "eth") {
  //     onSignMessageEth(chainsym, setshowsignbutton);
  //   } else if (chainsym === "sol") {
  //     onSignMessageSol(chainsym, setshowsignbutton);
  //   }
  // };
  // //=------------------------------------------------------------------------
  const handleClick = () => {
    setHideFilter(!hidefilter);
  };


  


  const router = useRouter();
  const address = Cookies.get("erebrus_wallet");
  const token = Cookies.get("erebrus_token");

  

  useEffect(() => {
    if (solAccount) {
      // Update the cookie with the new address
      Cookies.set("erebrus_wallet", solAccount);
    

    }
  }, [solAccount]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setIsSignedIn(true);
    }

    let timeoutId = null;

    const getSignMessage = async () => {
      if (!address || address !== sessionStorage.getItem("address")) {
        if (timeoutId !== null) {
          clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
          signOut();
        }, 500);
      } else {
        if (timeoutId !== null) {
          clearTimeout(timeoutId);
        }

        const response = await axios.get("api/getChallengeId", {
          params: { walletAddress: address },
          headers: {
            "Content-Type": "application/json",
          },
        });

        setMessage(response.data.eula + response.data.challangeId);
        setChallengeId(response.data.challangeId);
      }
    };

    getSignMessage();

    return () => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    };
  }, [address, isSignedIn]);

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const getRandomNumber = () => Math.floor(Math.random() * 1000);
        const apiUrl = `https://api.multiavatar.com/${getRandomNumber()}`;

        const response = await axios.get(apiUrl);
        const svgDataUri = `data:image/svg+xml,${encodeURIComponent(
          response.data
        )}`;
        setAvatarUrl(svgDataUri);
      } catch (error) {
        console.error("Error fetching avatar:", error.message);
      }
    };

    fetchData();
  }, []);

  const signOut = () => {
    sessionStorage.removeItem("token");
    localStorage.removeItem("token");
    setMessage("");
    setSignature("");
    setChallengeId("");
    setIsSignedIn(false);
  };

  const handleDeleteCookie = () => {
    Cookies.remove("erebrus_wallet");
    Cookies.remove("erebrus_token");
    if(status=="connected"){
      disconnect();
    }
    window.location.href = "/";

  };

  return (
    <nav className="bg-transparent py-4">
      <div
        className={`container mx-auto px-10 flex items-center justify-between lg:mb-0 ${
          isHome && !isOpen ? "mb-24" : ""
        }`}
      >
        <div className="flex items-center">
          <Link href="/" scroll={false}>
            <div className="block">
              <img
                src="/Erebrus_logo_wordmark.png"
                alt="Logo"
                className="w-48"
              />
            </div>
          </Link>
          {/* <Link href="/" scroll={false}>
            <h1 className="text-xl font-bold text-white ml-2">EREBRUS</h1>
          </Link> */}
        </div>

        <div className="hidden lg:flex items-center">
          {link !== "explorer" ? (
            <Link
              href="/explorer"
              className="text-gray-300 mr-8"
              scroll={false}
              onClick={() => {
                setlink("explorer");
              }}
              style={{
                textDecoration: "none",
                position: "relative",
                borderBottom: router.pathname.includes("explorer")
                  ? "2px solid white"
                  : "",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.borderBottom = "1px solid #fff")
              }
              onMouseOut={(e) => (e.currentTarget.style.borderBottom = "none")}
            >
              Explorer
            </Link>
          ) : (
            <Link
              href="/explorer"
              className="text-gray-300 mr-8"
              scroll={false}
              style={{
                textDecoration: "none",
                position: "relative",
                borderBottom: "2px solid white",
              }}
            >
              Explorer
            </Link>
          )}

          {link !== "subscription" ? (
            <Link
              href="/subscription"
              className="text-gray-300 mr-8"
              scroll={false}
              onClick={() => {
                setlink("subscription");
              }}
              style={{
                textDecoration: "none",
                position: "relative",
                borderBottom: router.pathname.includes("subscription")
                  ? "2px solid white"
                  : "",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.borderBottom = "1px solid #fff")
              }
              onMouseOut={(e) => (e.currentTarget.style.borderBottom = "none")}
            >
              Subscription
            </Link>
          ) : (
            <Link
              href="/subscription"
              className="text-gray-300 mr-8"
              scroll={false}
              style={{
                textDecoration: "none",
                position: "relative",
                borderBottom: "2px solid white",
              }}
            >
              Subscription
            </Link>
          )}

          <Link
            href="https://docs.netsepio.com/erebrus/"
            target="_blank"
            className="text-gray-300 mr-8"
            onMouseOver={(e) =>
              (e.currentTarget.style.borderBottom = "1px solid #fff")
            }
            onMouseOut={(e) => (e.currentTarget.style.borderBottom = "none")}
          >
            Docs
          </Link>

          <>
          {!token ? (
            <div className="lg:mt-0 mt-4 z-50 rounded-xl text-white">
              {!aptosConnected && chainsym === "apt" && (
                <button>
                  <WalletSelectorAntDesign />
                </button>
              )}
              {chainsym === "evm" && (
                <button>
                  <w3m-button />
                </button>
              )}
              {chainsym === "sui" && (
                <button>
                  <ConnectButton />
                  
                </button>
              )}
              {chainsym === "sol" && (
                <button>
                  <WalletMultiButton />
                </button>
              )}
              {solconnected && showsignbuttonsol && (
                <Button
                  color={"blue"}
                  onClick={OnSignMessageSol}
                  disabled={false}
                  message={"Authenticate"}
                />
              )}
              {aptosConnected && showsignbuttonaptos && (
                <Button
                  color={"blue"}
                  onClick={onSignMessage}
                  disabled={false}
                  message={"Authenticate"}
                />
              )}
              {ethConnected && chainsym === "evm" && showsignbuttoneth && (
                <Button
                  color={"blue"}
                  onClick={onSignMessageEth}
                  disabled={false}
                  message={"Authenticate"}
                />
              )}
              {status == "connected" && chainsym === "sui" && showsignbuttonsui && (
                <Button
                  color={"blue"}
                  onClick={handleSignMsg}
                  disabled={false}
                  message={"Authenticate"}
                />
              )}
            </div>
          )  : (
              <div
                className="lg:mt-0 mt-4 z-50 rounded-xl flex gap-4"
                style={{ color: "#0162FF" }}
              >
                <button
                  onClick={handleDeleteCookie}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.borderBottom = "1px solid #0162FF")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.borderBottom = "none")
                  }
                  
                >
                  Log out
                </button>
                {avatarUrl && (
                  <img src={avatarUrl} alt="Avatar" className="w-10 ml-auto" />
                )}
              </div>
            )}
          </>

          <div>
            <button onClick={handleClick} className="text-white p-2 relative">
              {/* &#9776; */}

              <span
                className={`bg-gray-500 block transition-all duration-300 ease-out 
                    h-0.5 w-6 rounded-sm ${
                      hidefilter
                        ? "rotate-45 translate-y-1"
                        : "-translate-y-0.5"
                    }`}
              ></span>
              <span
                className={`bg-gray-500 block transition-all duration-300 ease-out 
                    h-0.5 w-6 rounded-sm my-0.5 ${
                      hidefilter ? "opacity-0" : "opacity-100"
                    }`}
              ></span>

              <span
                className={`bg-gray-500 block transition-all duration-300 ease-out 
                    h-0.5 w-6 rounded-sm ${
                      hidefilter
                        ? "-rotate-45 -translate-y-1"
                        : "translate-y-0.5"
                    }`}
              ></span>
            </button>

            {hidefilter && (
              <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50">
                <div className="p-8 rounded-3xl shadow-md text-white w-1/4" style={{backgroundColor:'#0162FF'}}>
                <div className="flex items-center justify-end rounded-t">
                              <button
                                onClick={() => setHideFilter(false)}
                                type="button"
                                className="text-white bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-800 dark:hover:text-white"
                              >
                                <svg
                                  className="w-3 h-3"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 14 14"
                                >
                                  <path
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                  />
                                </svg>
                                <span className="sr-only">Close modal</span>
                              </button>
                            </div>
                  <h2 className="text-2xl font-bold -mt-4 text-center">Choose a Chain</h2>
                  <ul className="space-y-4 mt-10">
                    <li className="flex items-center justify-between gap-64 p-2 rounded-full" style={{backgroundColor:'#202333'}}>
                      <button
                        onClick={() => {
                          setHideFilter(false);
                          Cookies.set("Chain_symbol", "evm");
                          setchainsym("evm");
                          setshowsignbuttoneth(false);
      setshowsignbuttonsol(false);
      setshowsignbuttonsui(false);
      setshowsignbuttonaptos(false);
                        }}
                        // className="mx-auto"
                      >
                        <div className="flex gap-2" style={{marginLeft:100}}>
                          <img src="/ethicon.png" className="w-6 h-6"/>
                          <div>Ethereum</div>
                        </div>
                      </button>
                    </li>
                    <li className="flex items-center justify-between p-2 rounded-full" style={{backgroundColor:'#202333'}}>
                      <button
                        onClick={() => {
                          setHideFilter(false);
                          Cookies.set("Chain_symbol", "apt");
                          setchainsym("apt");
                          setshowsignbuttoneth(false);
      setshowsignbuttonsol(false);
      setshowsignbuttonsui(false);
      setshowsignbuttonaptos(false);
                        }}
                        // className="mx-auto"
                      >
                         <div className="flex gap-2" style={{marginLeft:100}}>
                          <img src="/aptosicon.png" className="w-6 h-6"/>
                          <div>Aptos</div>
                        </div>
                      </button>
                    </li>
                    <li className="flex items-center justify-between p-2 rounded-full" style={{backgroundColor:'#202333'}}>
                      <button
                        onClick={() => {
                          setHideFilter(false);
                          Cookies.set("Chain_symbol", "sui");
                          setchainsym("sui");
                          setshowsignbuttoneth(false);
      setshowsignbuttonsol(false);
      setshowsignbuttonsui(false);
      setshowsignbuttonaptos(false);
                        }}
                        // className="mx-auto"
                      >
                         <div className="flex gap-2" style={{marginLeft:105}}>
                          <img src="/suiicon.png" className="w-4 h-5"/>
                          <div>Sui</div>
                        </div>
                      </button>
                    </li>
                    <li className="flex items-center justify-between p-2 rounded-full" style={{backgroundColor:'#202333'}}>
                      <button
                        onClick={() => {
                          setHideFilter(false);
                          Cookies.set("Chain_symbol", "sol");
                          setchainsym("sol");
                          setshowsignbuttoneth(false);
      setshowsignbuttonsol(false);
      setshowsignbuttonsui(false);
      setshowsignbuttonaptos(false);
                        }}
                        // className="mx-auto"
                      >
                         <div className="flex gap-2" style={{marginLeft:100}}>
                          <img src="/solanaicon.png" className="w-6 h-6"/>
                          <div>Solana</div>
                        </div>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="block lg:hidden">
          <button
            className="flex items-center px-3 py-2 rounded-full text-gray-300"
            onClick={toggleMenu}
          >
            <svg className="w-6 h-6" viewBox="0 0 20 20" fill="currentColor">
              {isOpen ? (
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      <motion.nav animate={isOpen ? "open" : "closed"} variants={variants}>
        {isOpen && (
          <div className="bg-transparent py-4">
            <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center lg:justify-between">
              <div className="flex flex-col lg:flex-row items-center">
                <Link
                  href="/explorer"
                  className="text-white font-bold block lg:inline-block mb-4 lg:mr-0 lg:mb-0"
                >
                  Explorer
                </Link>

                <Link
                  href="/subscription"
                  className="text-white font-bold block lg:inline-block mb-4 lg:mr-0 lg:mb-0"
                >
                  Subscription
                </Link>

                <Link
                  href="https://docs.netsepio.com/erebrus/"
                  target="_blank"
                  className="text-white font-bold block lg:inline-block mb-4 lg:mr-0 lg:mb-0"
                >
                  Docs
                </Link>

                {account?.address && (
                  <div
                    className="lg:mt-0 mt-4 lg:mr-4 z-50 rounded-xl flex gap-4"
                    style={{ color: "#0162FF" }}
                  >
                    {/* <div>
                {account?.address.slice(0, 4)}...{account?.address.slice(-4)}
              </div> */}
                    {address && (
                      <button
                        onClick={handleDeleteCookie}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.borderBottom =
                            "1px solid #0162FF")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.borderBottom = "none")
                        }
                      >
                        Log out
                      </button>
                    )}
                    {avatarUrl && (
                      <img
                        src={avatarUrl}
                        alt="Avatar"
                        className="w-10 ml-auto"
                      />
                    )}
                  </div>
                )}

                {!address && (
                  <div className="lg:mt-0 mt-4 z-50 rounded-xl text-white">
                    {!connected && (
                      <button
                      // onClick={connectWallet}
                      >
                        <WalletSelectorAntDesign />
                      </button>
                    )}
                    {connected && (
                      <SingleSignerTransaction
                        isSendableNetwork={isSendableNetwork}
                        chainsymbol={chainsym}
                      />
                    )}
                  </div>
                )}

                {address && (
                  <div
                    className="lg:mt-0 mt-4 lg:mr-20 z-50 rounded-xl flex gap-4"
                    style={{ color: "#0162FF" }}
                  >
                    {/* <div>
                {address.slice(0, 4)}...{address.slice(-4)}
              </div> */}
                    <button
                      onClick={handleDeleteCookie}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.borderBottom =
                          "1px solid #0162FF")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.borderBottom = "none")
                      }
                    >
                      Log out
                    </button>
                    {avatarUrl && (
                      <img
                        src={avatarUrl}
                        alt="Avatar"
                        className="w-10 ml-auto"
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </motion.nav>
    </nav>
  );
};

export default Navbar;
