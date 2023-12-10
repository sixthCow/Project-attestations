"use client";

import { useState } from "react";

import sourceCreateSchema from "@/public/SourceMinter.json";
import Image from "next/image";

import { SchemaRegistry } from "@ethereum-attestation-service/eas-sdk";
import { SignerOrProvider } from "@ethereum-attestation-service/eas-sdk/dist/transaction";
import { useWeb3ModalSigner } from "@web3modal/ethers5/react";
import { ethers } from "ethers";

import pushLogo from "@/public/push-bell.webp";
import baseLogo from "@/public/Base_Symbol_Blue.svg";
import toast from "react-hot-toast";

export type IFieldType = {
  type: string;
  description: string;
};

const SchemaCreatePage = () => {
  const fieldTypes: IFieldType[] = [
    {
      type: "string",
      description: "A string can be any text of arbitrary length.",
    },
  ];
  const [field1, setField1] = useState<string>("");
  const [field2, setField2] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const { signer } = useWeb3ModalSigner();

  const handleCreateSchema = async (event: any) => {
    event?.preventDefault();
    try {
      setLoading(true);
      console.log("Start Creating Schema");

      const schemaRegistryContractAddress =
        "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0";
      const schemaRegistry = new SchemaRegistry(schemaRegistryContractAddress);
      schemaRegistry.connect(signer as unknown as SignerOrProvider);
      const schema = "string " + field1 + ", string " + field2;
      const resolverAddress = "0xB4Fb406b75db78D69c28E616Ef317f6ea6FE3497";
      const revocable = true;

      const transaction = await schemaRegistry.register({
        schema,
        resolverAddress,
        revocable,
      });

      const resolverAddressBase = "0xc5ed581f35741340b4804cef076adc5c9c46a872";
      const ccip = new ethers.Contract(
        "0x0e5b100a2890c43fab0c1b67183bf27399379692",
        new ethers.utils.Interface(sourceCreateSchema.abi),
        signer
      );
      const tx = await ccip.register(
        "5790810961207155433",
        "0x099ca1f3b90210735b880dba7bea82d88b3cb409",
        0,
        schema,
        resolverAddressBase,
        true
      );
      console.log(tx);

      const result = await transaction.wait();
      toast.success("Schema Created");
      console.log("Schema Created:", result);
      const result_ccip = await tx.wait();
      toast.success(
        "Schema sent to CCIP. This may take a while before is deployed on Base"
      );
      console.log("CCIP Created:", result_ccip);
      setField1("");
      setField2("");
    } catch (e) {
      console.error(e);
      toast.error("Ooops, something went wrong...");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-10 w-full space-y-4 flex flex-col">
      <h1 className="text-2xl">Create Schema</h1>
      <p className="text-neutral-content">Add the data structure of the attestation</p>
      <form
        className="flex flex-col gap-4 p-6 bg-neutral rounded-xl"
        onSubmit={(e) => handleCreateSchema(e)}
      >
        <div className="flex flex-row gap-4">
          <input
            type="text"
            placeholder="Field Name"
            required
            className="rounded-lg p-2 input grow"
            value={field1}
            onChange={(e) => setField1(e.target.value)}
          />
          <select className="select select-primary bg-primary">
            {fieldTypes.map((fieldType, index) => (
              <option key={index} value={fieldType.type}>
                {fieldType.type}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-row gap-4">
          <input
            type="text"
            placeholder="Field Name"
            required
            className="rounded-lg p-2 input grow"
            value={field2}
            onChange={(e) => setField2(e.target.value)}
          />
          <select className="select select-primary bg-primary">
            {fieldTypes.map((fieldType, index) => (
              <option key={index} value={fieldType.type}>
                {fieldType.type}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-row space-x-2 items-center">
          <input
            type="checkbox"
            className="toggle toggle-md toggle-success"
            checked
          />
          <p className="flex flex-row text-lg">
            Enable Push Notifications
            <Image
              src={pushLogo}
              width={25}
              height={25}
              alt="Push Protocol Bell"
            />
          </p>
        </div>

        <div className="flex flex-row space-x-2 items-center">
          <input
            type="checkbox"
            className="toggle toggle-md toggle-success"
            checked
          />
          <p className="flex flex-row text-lg space-x-1">
            <span>Deploy on Base</span>
            <Image src={baseLogo} width={25} height={25} alt="Base Logo" />
            <span className="text-xs">*Powered by Chainlink CCIP</span>
          </p>
        </div>

        <button type="submit" className="btn max-w-xs w-full self-center mt-8 border-primary hover:border-primary">
          {loading ? "Loading..." : "Create Schema"}
        </button>
      </form>
    </div>
  );
};

export default SchemaCreatePage;
