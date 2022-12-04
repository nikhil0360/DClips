import React, { useState, useRef } from "react";
import { BiCloud, BiPlus } from "react-icons/bi";
import axios from "axios";
import getContract from "../../utils/getContract";
import { ethers } from "ethers";
import contractAbi from "../../artifacts/contracts/DClips.sol/DClips.json";

export default function Upload() {
  // Creating state for the input field
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [video, setVideo] = useState("");

  //  Creating a ref for thumbnail and video
  const thumbnailRef = useRef();
  const videoRef = useRef();

  // function for handle generate 
  const handleGenerate = async () => {

    const options = {
      method: "POST",
      url: "https://api.openai.com/v1/completions",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer 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",
      },
      data: {
        "model": "text-davinci-003",
        "prompt": `Write a long description for this video titled ${title}`,
        "temperature": 0.4,
        "max_tokens": 64,
        "top_p": 1,
        "frequency_penalty": 0,
        "presence_penalty": 0
      },
    };

    axios
      .request(options)
      .then(function (response) {
        console.log(response.data.choices[0].text);
        setDescription(response.data.choices[0].text.trim());
      })
      .catch(function (error) {
        console.log("Error generating description: ", error);
      });
    
  };

  // When user clicks on the upload button
  const handleSubmit = async () => {
    // Checking if user has filled all the fields
    if (
      title === "" ||
      description === "" ||
      category === "" ||
      location === "" ||
      thumbnail === "" ||
      video === ""
    ) {
      // If user has not filled all the fields, throw an error
      alert("Please fill all the fields");
      return;
    }
    // If user has filled all the fields, upload the thumbnail to IPFS
    uploadThumbnail(thumbnail);
  };

  const uploadThumbnail = async (thumbnail) => {
    const form = new FormData();
    form.append("file", thumbnail);

    const options = {
      method: "POST",
      url: "https://api.nftport.xyz/v0/files",
      headers: {
        "Content-Type": "multipart/form-data;",
        Authorization: "6305fa4f-2e7f-404c-a721-298f591b595b",
      },
      data: form,
    };

    axios
      .request(options)
      .then(function (response) {
        console.log(response.data.ipfs_url);
        uploadVideo(response.data.ipfs_url);
      })
      .catch(function (error) {
        console.log(thumbnail);
        console.log("Error uploading file: ", error);
      });
  };

  const uploadVideo = async (thumbnail) => {
    const form = new FormData();
    form.append("file", video);

    // var options = {
    //   method: "post",
    //   url: "https://api.web3.storage/upload",
    //   headers: {
    //     "Content-Type": "multipart/form-data;",
    //     Authorization:
    //       "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDZBOTc2OGE3ZTI2YmM0RTMyZDU1NDEzRTZBNERDM2UyNENDMUU4QmYiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NzAwNjk4ODI4NjcsIm5hbWUiOiJldGhpbmRpYTIyIn0.oAPlLbzJZLbQiTr2bCcuo1JfwvAUkRhC8gMVt5Yh1ic",
    //   },
    //   data: form,
    // };

    const options = {
      method: "POST",
      url: "https://api.nftport.xyz/v0/files",
      headers: {
        "Content-Type": "multipart/form-data;",
        Authorization: "6305fa4f-2e7f-404c-a721-298f591b595b",
      },
      data: form,
    };

    axios
      .request(options)
      .then(function (response) {
        console.log(response.data)
        saveVideo(response.data.ipfs_url, thumbnail);
      })
      .catch(function (error) {
        console.log("Error uploading file: ", error);
      });
  };

  const saveVideo = async (video, thumbnail) => {
    // // Get the contract from the getContract function
    let contract = await getContract();
    // Get todays date
    let UploadedDate = String(new Date());
    // Upload the video to the contract
    await contract.uploadVideo(
      video,
      title,
      description,
      location,
      category,
      thumbnail,
      UploadedDate
    );

    // error handle here when transaction is rejected/canceled

    // // Biconomy Integration
    // const smartAccount = await getContract();
    // let UploadedDate = String(new Date());
    // const contractInterface = new ethers.utils.Interface(contractAbi.abi);
    // const data = contractInterface.encodeFunctionData("uploadVideo", [
    //   video,
    //   title,
    //   description,
    //   location,
    //   category,
    //   thumbnail,
    //   UploadedDate,
    // ]);

    // const tx1 = {
    //   to: "0x7946FB38d16862FC7215Faf46F9b98e5184476e3",
    //   data,
    // };

    // smartAccount.on("txHashGenerated", (response) => {
    //   console.log("txHashGenerated event received via emitter", response);
    //   // showSuccessMessage(`Transaction sent: ${response.hash}`);
    // });

    // smartAccount.on("txMined", (response) => {
    //   console.log("txMined event received via emitter", response);
    //   // showSuccessMessage(`Transaction mined: ${response.hash}`);
    // });

    // smartAccount.on("error", (response) => {
    //   console.log("error event received via emitter", response);
    // });

    // const txResponse = await smartAccount.sendGasLessTransaction({
    //   transaction: tx1,
    // });

    // console.log(txResponse);
    window.location.href = "/home";
  };

  return (
    <div className="w-full h-screen bg-[#121212] flex flex-row upload-landing">
      <div className="flex-1 flex flex-col">
        <div className="mt-5 mr-10 flex  justify-end">
          <div className="flex items-center">
            <button
              onClick={() => {
                window.location.href = "/home";
              }}
              className="bg-transparent  text-[#9CA3AF] py-2 px-6 border rounded-lg  border-gray-600  mr-6"
            >
              Discard
            </button>
            <button
              onClick={() => {
                handleSubmit();
              }}
              className="bg-blue-500 hover:bg-blue-700 text-white  py-2  rounded-lg flex px-4 justify-between flex-row items-center"
            >
              <BiCloud />
              <p className="ml-2">Upload</p>
            </button>
          </div>
        </div>
        <div className="flex flex-col m-10     mt-5  lg:flex-row">
          <div className="flex lg:w-3/4 flex-col ">
            <label className="text-[#9CA3AF]  text-sm">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Rick Astley - Never Gonna Give You Up (Official Music Video)"
              className="w-[90%] text-white placeholder:text-gray-600  rounded-md mt-2 h-12 p-2 border  bg-[#1a1c1f] border-[#444752] focus:outline-none"
            />
            <label className="text-[#9CA3AF] mt-10">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write a description for this video, or click generate to auto-generate a description from title"
              className="w-[90%] text-white h-32 placeholder:text-gray-600  rounded-md mt-2 p-2 border  bg-[#1a1c1f] border-[#444752] focus:outline-none"
            />

            <button
              onClick={() => {
                handleGenerate();
              }}
              className="bg-green-500 hover:bg-green-700 text-white py-2 rounded-lg px-4 items-center w-[30%] mt-10"
            >
              Generate
            </button>

            <div className="flex flex-row mt-10 w-[90%]  justify-between">
              <div className="flex flex-col w-2/5    ">
                <label className="text-[#9CA3AF]  text-sm">Location</label>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  type="text"
                  placeholder="Bali - Indonesia"
                  className="w-[90%] text-white placeholder:text-gray-600  rounded-md mt-2 h-12 p-2 border  bg-[#1a1c1f] border-[#444752] focus:outline-none"
                />
              </div>
              <div className="flex flex-col w-2/5    ">
                <label className="text-[#9CA3AF]  text-sm">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-[90%] text-white placeholder:text-gray-600  rounded-md mt-2 h-12 p-2 border  bg-[#1a1c1f] border-[#444752] focus:outline-none"
                >
                  <option>Select Category</option>
                  <option>Music</option>
                  <option>Sports</option>
                  <option>Gaming</option>
                  <option>News</option>
                  <option>Entertainment</option>
                  <option>Education</option>
                  <option>Science & Technology</option>
                  <option>Travel</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
            <label className="text-[#9CA3AF]  mt-10 text-sm">Thumbnail</label>

            <div
              onClick={() => {
                thumbnailRef.current.click();
              }}
              className="border-2 w-64 border-gray-600  border-dashed rounded-md mt-2 p-2  h-36 items-center justify-center flex"
            >
              {thumbnail ? (
                <img
                  onClick={() => {
                    thumbnailRef.current.click();
                  }}
                  src={URL.createObjectURL(thumbnail)}
                  alt="thumbnail"
                  className="h-full rounded-md"
                />
              ) : (
                <BiPlus size={40} color="gray" />
              )}
            </div>

            <input
              type="file"
              className="hidden"
              ref={thumbnailRef}
              onChange={(e) => {
                setThumbnail(e.target.files[0]);
              }}
            />
          </div>

          <div
            onClick={() => {
              videoRef.current.click();
            }}
            className={
              video
                ? " w-96   rounded-md  h-64 items-center justify-center flex"
                : "border-2 border-gray-600  w-96 border-dashed rounded-md mt-8   h-64 items-center justify-center flex"
            }
          >
            {video ? (
              <video
                controls
                src={URL.createObjectURL(video)}
                className="h-full rounded-md"
              />
            ) : (
              <p className="text-[#9CA3AF]">Upload Video</p>
            )}
          </div>
        </div>
        <input
          type="file"
          className="hidden"
          ref={videoRef}
          accept={"video/*"}
          onChange={(e) => {
            setVideo(e.target.files[0]);
            console.log(e.target.files[0]);
          }}
        />
      </div>
    </div>
  );
}