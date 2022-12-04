// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/utils/Strings.sol";

interface IPUSHCommInterface {
    function sendNotification(
        address _channel,
        address _recipient,
        bytes calldata _identity
    ) external;
}

contract DClips {
    // Declaring the videoCount 0 by default
    uint256 public videoCount = 0;
    // Name of your contract
    string public name = "DClips";
    // Creating a mapping of videoCount to Video
    mapping(uint256 => Video) public videos;

    // epns channel address for ethube
    address public EPNS_COMM_ADDRESS =
        0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa;

    function concatenate(string memory a,string memory b) public pure returns (string memory){
        return string(abi.encodePacked(a,' ',b));
    } 

    //  Create a struct called 'Video' with the following properties:
    struct Video {
        uint256 id;
        string hash;
        string title;
        string description;
        string location;
        string category;
        string thumbnailHash;
        string date;
        address author;
    }

    // Create a 'VideoUploaded' event that emits the properties of the video
    event VideoUploaded(
        uint256 id,
        string hash,
        string title,
        string description,
        string location,
        string category,
        string thumbnailHash,
        string date,
        address author
    );

    constructor() {}

    // Function to upload a video
    function uploadVideo(
        string memory _videoHash,
        string memory _title,
        string memory _description,
        string memory _location,
        string memory _category,
        string memory _thumbnailHash,
        string memory _date
    ) public {
        // Validating the video hash, title and author's address
        require(bytes(_videoHash).length > 0);
        require(bytes(_title).length > 0);
        require(msg.sender != address(0));

        // Incrementing the video count
        videoCount++;
        // Adding the video to the contract
        videos[videoCount] = Video(
            videoCount,
            _videoHash,
            _title,
            _description,
            _location,
            _category,
            _thumbnailHash,
            _date,
            msg.sender
        );

        // Trigger the push notification
        IPUSHCommInterface(EPNS_COMM_ADDRESS).sendNotification(
            address(0x0746836407Abb3B89D00bD04041efd84C6b1EB98), // from channel - recommended to set channel via dApp and put it's value -> then once contract is deployed, go back and add the contract address as delegate for your channel
            msg.sender, // to recipient, put address(this) in case you want Broadcast or Subset. For Targetted put the address to which you want to send
            bytes(
                string(
                    // We are passing identity here: https://docs.epns.io/developers/developer-guides/sending-notifications/advanced/notification-payload-types/identity/payload-identity-implementations
                    abi.encodePacked(
                        "0", // this is notification identity: https://docs.epns.io/developers/developer-guides/sending-notifications/advanced/notification-payload-types/identity/payload-identity-implementations
                        "+", // segregator
                        "1", // this is payload type: https://docs.epns.io/developers/developer-guides/sending-notifications/advanced/notification-payload-types/payload (1, 3 or 4) = (Broadcast, targetted or subset)
                        "+", // segregator
                        concatenate("New Video Uploaded:", _title), // this is notificaiton title
                        "+", // segregator
                        concatenate(_description, concatenate("Video Number:", Strings.toString(videoCount))) // notification body
                    )
                )
            )
        );

        // Triggering the event
        emit VideoUploaded(
            videoCount,
            _videoHash,
            _title,
            _description,
            _location,
            _category,
            _thumbnailHash,
            _date,
            msg.sender
        );
    }
}
