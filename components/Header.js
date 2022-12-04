import React from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import EthubeLogo from "../public/logo.png";
import pushLogo from "../public/push.png";
import Image from "next/image";
import * as PushAPI from "@pushprotocol/restapi";
import { ethers } from "ethers";

async function getSigner() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  return signer;
}

// async function optIn() {
//   let _signer = await getSigner();
//   await PushAPI.channels.subscribe({
//     signer: _signer,
//     channelAddress: `eip155:5:0x0746836407abb3b89d00bd04041efd84c6b1eb98`, // channel address in CAIP
//     userAddress: `eip155:5:${_signer.address}`, // user address in CAIP
//     onSuccess: () => {
//       console.log("opt in success");
//     },
//     onError: () => {
//       console.error("opt in error");
//     },
//     env: "staging",
//   });
// }

export const Header = ({ search }) => {
  return (
    <header className="w-full flex justify-between h-20 items-center border-b p-8 border-[#BB86FC]">
      <div className=" w-2/8">
        <Image src={EthubeLogo} alt="Ethube Logo" width={50} height={50} />
      </div>
      <div className=" w-4/8 flex justify-center items-center">
        {search ? (
          <input
            type="text"
            onChange={(e) => search(e.target.value)}
            placeholder="Can't find? Search here"
            className=" border-0 bg-transparent focus:outline-none searchInput placeholder-gray-700"
          />
        ) : null}
      </div>
      <div className=" w-2/8 flex p-2">
        <AiOutlinePlusCircle
          onClick={() => {
            window.location.href = "/upload";
          }}
          size="30px"
          className="mr-8 fill-whiteIcons dark:fill-[#BB86FC] cursor-pointer uploadAdd"
        />
        <Image
          src={pushLogo}
          alt="Push Logo"
          width={30}
          height={30}
        //   onClick={optIn}
          className="subscribe cursor-pointer"
        />
      </div>
    </header>
  );
};
