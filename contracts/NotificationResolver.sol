// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import { SchemaResolver } from "./resolver/SchemaResolver.sol";

import { IEAS, Attestation } from "./IEAS.sol";

import "@openzeppelin/contracts/utils/Strings.sol";

interface IPUSHCommInterface {
    function sendNotification(address _channel, address _recipient, bytes calldata _identity) external;
}

contract NotificationResolver is SchemaResolver {

    constructor(IEAS eas) SchemaResolver(eas) {}
    
    function onAttest(Attestation calldata attestation, uint256 /*value*/) internal override returns (bool) {
       bytes32 uid = attestation.uid;
       address recipient = attestation.recipient;
       IPUSHCommInterface(0x0C34d54a09CFe75BCcd878A469206Ae77E0fe6e7).sendNotification(
            0x0373770ec47B4d93C4457E683AA3250D44cE8CaC, // from channel
            address(recipient), // to recipient, put address(this) in case you want Broadcast or Subset. For Targeted put the address to which you want to send
            bytes(
                string(
                    // We are passing identity here: https://docs.epns.io/developers/developer-guides/sending-notifications/advanced/notification-payload-types/identity/payload-identity-implementations
                    abi.encodePacked(
                        "0", // this is notification identity: https://docs.epns.io/developers/developer-guides/sending-notifications/advanced/notification-payload-types/identity/payload-identity-implementations
                        "+", // segregator
                        "3", // this is payload type: https://docs.epns.io/developers/developer-guides/sending-notifications/advanced/notification-payload-types/payload (1, 3 or 4) = (Broadcast, targeted or subset)
                        "+", // segregator
                        "Attestation", // this is notification title
                        "+", // segregator
                        "New attestation is created!", // notification body
                        "The UID is ", // notification body
                        Strings.toHexString(uint256(uid)) // notification body
                    )
                )
            )
        );
       return true;
    }

    function onRevoke(Attestation calldata attestation, uint256 /*value*/) internal override returns (bool) {
        bytes32 uid = attestation.uid;
        address recipient = attestation.recipient;
        IPUSHCommInterface(0x0C34d54a09CFe75BCcd878A469206Ae77E0fe6e7).sendNotification(
            0x0373770ec47B4d93C4457E683AA3250D44cE8CaC, // from channel
            address(recipient), // to recipient, put address(this) in case you want Broadcast or Subset. For Targeted put the address to which you want to send
            bytes(
                string(
                    // We are passing identity here: https://docs.epns.io/developers/developer-guides/sending-notifications/advanced/notification-payload-types/identity/payload-identity-implementations
                    abi.encodePacked(
                        "0", // this is notification identity: https://docs.epns.io/developers/developer-guides/sending-notifications/advanced/notification-payload-types/identity/payload-identity-implementations
                        "+", // segregator
                        "3", // this is payload type: https://docs.epns.io/developers/developer-guides/sending-notifications/advanced/notification-payload-types/payload (1, 3 or 4) = (Broadcast, targeted or subset)
                        "+", // segregator
                        "Attestation", // this is notificaiton title
                        "+", // segregator
                        "Attestation is revoked!", // notification body
                        "The UID is ", // notification body
                        Strings.toHexString(uint256(uid)) // notification body
                    )
                )
            )
        );
        return true;
    }

}


