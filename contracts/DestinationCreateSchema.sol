// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {SchemaRegistry} from "./SchemaRegistry.sol";


/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */
contract DestinationCreateSchema is CCIPReceiver {
    SchemaRegistry schemaRegistry;

    event SchemaCreateSuccessfull();

    constructor(address router, address schemaRegistryAddress) CCIPReceiver(router) {
        schemaRegistry = SchemaRegistry(schemaRegistryAddress);
    }

    function _ccipReceive(
        Client.Any2EVMMessage memory message
    ) internal override {
        (bool success, ) = address(schemaRegistry).call(message.data);
        require(success);
        emit SchemaCreateSuccessfull();
    }
}
