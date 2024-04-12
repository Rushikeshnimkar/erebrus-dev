import Head from "next/head";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Features from "../components/Features";
import Howto from "../components/Howto";
import DepinCarousel from "../components/DepinCarousel";
import Pricing from "../components/Pricing";
import { motion } from "framer-motion";
import { useAddress } from "@thirdweb-dev/react";
import Link from 'next/link';

export default function Home() {
  const address = useAddress();

  return (
    <div>
      <Head>
        <meta charset="UTF-8"></meta>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
        <meta name="description" content="Where decentralization meets VPN for ultimate internet security.
Anonymous Virtual Private Network for accessing internet in stealth mode bypassing filewalls and filters."></meta>
        <meta name="keywords" content="Erebrus, vpn, decentralized, mint, 111, nft, clients, netsepio, apt, aptos"></meta>
        <title>Erebrus</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

<div className="min-h-screen" style={{ backgroundImage: `url('/landingtop.png')`, 
                        backgroundColor:"black", 
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat"}}>
      <div className="container mx-auto pt-20 md:w-[80%] lg:w-[80%]">
        <div className="flex flex-col items-center justify-start lg:h-full md:mt-16 mt-8 mb-36">
          <motion.h1
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { duration: 1 } }}
            className="text-6xl font-smeibold text-white mb-6 mr-auto w-3/5"
          >
            Building a Resilient Decentralized Network 
          </motion.h1>
          <motion.h1
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { duration: 1 } }}
            className="text-xl text-white mb-8 w-3/5 mr-auto"
          >
            <p>
            Get on board with Erebrus DEPIN for a stable, decentralized internet.
Earn rewards and enhance your connectivity
            </p>
          </motion.h1>
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { duration: 1 } }}
            className="text-black font-bold py-3 px-14 rounded-full mr-auto" style={{backgroundColor:'#E3EEFF'}}
            // style={{backgroundImage: 'linear-gradient(#FFFFFF00, #0099FF)'}}
          >
            <Link href="/plans">
              Get Started
            </Link>
          </motion.div>
        </div>
      </div>
      </div>

      <div style={{backgroundImage: 'radial-gradient(ellipse at top left, #040819 20%, #0162FF 40% , #1D73FF, #5696FF, #8EB9FF, #AACBFF)'}} className="py-10">

      <Features />
      <DepinCarousel />
      </div>

      <Pricing />
      <Howto />

      <div className="container mx-auto py-20 w-4/5 mb-20 rounded-3xl" style={{backgroundColor:'#202333'}}>
        <div className="flex flex-col items-center justify-start lg:h-full mt-10 lg:ml-0 lg:mr-0 md:ml-0 md:mr-0 ml-4 mr-4 mb-36 lg:mb-0 ">
          <motion.h1
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { duration: 1 } }}
            className="text-5xl font-bold text-gray-300 mb-16 lg:text-center md:text-center md:w-[80%]"
          >
            Where Decentralization meets <br></br> VPN for ultimate internet security
          </motion.h1>
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { duration: 1 } }}
            className="text-black font-bold py-4 px-14 rounded-full bg-white" 
            // style={{backgroundImage: 'linear-gradient(#FFFFFF00, #0099FF)'}}
          >
            <Link href="/plans">
              Subscribe Now
            </Link>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
