// import ContractAbi from "../artifacts/contracts/DClips.sol/DClips.json";
import { ethers } from "ethers";
import { ChainId } from "@biconomy/core-types";
import ContractAbi from "../artifacts/contracts/DClips.sol/DClips.json";

import SmartAccount from "@biconomy/smart-account";

export default async function getContract() {
  // Creating a new provider
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  // Getting the signer
  const signer = provider.getSigner();
  // console.log("Signer address", signer.address);

  // let options = {
  //   activeNetworkId: ChainId.POLYGON_MUMBAI,
  //   supportedNetworksIds: [
  //     ChainId.GOERLI,
  //     ChainId.POLYGON_MAINNET,
  //     ChainId.POLYGON_MUMBAI,
  //   ],
  //   networkConfig: [
  //     {
  //       chainId: ChainId.POLYGON_MUMBAI,
  //       dappAPIKey: "59fRCMXvk.8a1652f0-b522-4ea7-b296-98628499aee3",
  //       // check in the beginning of the page to play around with testnet common keys
  //       // customPaymasterAPI: <IPaymaster Instance of your own Paymaster>
  //     },
  //   ],
  // };

  // let smartAccount = new SmartAccount(provider, options);
  // smartAccount = await smartAccount.init();

  // return smartAccount;

  // Normal contract fetching
  // Creating a new contract factory with the signer, address and ABI
  let contract = new ethers.Contract(
    "0x7946FB38d16862FC7215Faf46F9b98e5184476e3",
    ContractAbi.abi,
    signer
  );
  return contract;
}
