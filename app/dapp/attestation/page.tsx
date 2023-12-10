"use client";

import { useState } from "react";

import {
  EAS,
  SchemaEncoder,
  SchemaRegistry,
} from "@ethereum-attestation-service/eas-sdk";
import { SignerOrProvider } from "@ethereum-attestation-service/eas-sdk/dist/transaction";
import { useWeb3ModalSigner } from "@web3modal/ethers5/react";

import toast from "react-hot-toast";

export type IFieldType = {
  type: string;
  description: string;
};

const SchemaCreatePage = () => {
  const [field1, setField1] = useState<string>("");
  const [field2, setField2] = useState<string>("");
  const [recipient, setRecipient] = useState<string>("");
  const [schema, setSchema] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const { signer } = useWeb3ModalSigner();

  const handleCreateSchema = async (event: any) => {
    event?.preventDefault();
    try {
      setLoading(true);
      console.log("Start Creating Schema");

      const schemaRegistryContractAddress =
        "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0"; // Sepolia 0.26
      const schemaRegistry = new SchemaRegistry(schemaRegistryContractAddress);
      schemaRegistry.connect(signer as unknown as SignerOrProvider);
      const schemaUID = schema;
      const schemaRecord = await schemaRegistry.getSchema({ uid: schemaUID });
      console.log(schemaRecord.schema);

      // Initialize the sdk with the address of the EAS Schema contract address
      const EASContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e"; // Sepolia v0.26
      const eas = new EAS(EASContractAddress);

      eas.connect(signer as unknown as SignerOrProvider);

      // Initialize SchemaEncoder with the schema string
      const schemaEncoder = new SchemaEncoder(schemaRecord.schema);
      const arr = schemaRecord.schema.split(" ");
      const updated_arr = arr.map((i) => i.replace(",", ""));
      console.log(updated_arr);
      const encodedData = schemaEncoder.encodeData([
        {
          name: updated_arr.at(1) || "",
          value: field1,
          type: updated_arr.at(0) || "",
        },
        {
          name: updated_arr.at(3) || "",
          value: 1,
          type: updated_arr.at(2) || "",
        },
      ]);

      const tx = await eas.attest({
        schema: schemaUID,
        data: {
          recipient: recipient,
          expirationTime: BigInt(0),
          revocable: true,
          data: encodedData,
        },
      });

      const newAttestationUID = await tx.wait();
      toast.success("Attestation created succesfully!");
      console.log("New attestation UID:", newAttestationUID);
      setField1("");
      setField2("");
      setRecipient("");
      setSchema("");
    } catch (e) {
      console.error(e);
      toast.error("Ooops, something went wrong...");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-10 w-full space-y-4 flex flex-col">
      <h1 className="text-2xl">Create Attestation</h1>
      <p className="text-neutral-content">Use the schema to make an attestation</p>
      <form
        className="flex flex-col gap-4 p-6 bg-neutral rounded-xl"
        onSubmit={(e) => handleCreateSchema(e)}
      >
        <div className="flex flex-col gap-1">
          <label>Schema</label>
          <input
            type="text"
            placeholder="Field Name"
            required
            className="rounded-lg p-2 input"
            value={schema}
            onChange={(e) => setSchema(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label>Recipient</label>
          <input
            type="text"
            placeholder="Field Name"
            required
            className="rounded-lg p-2 input"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label>First value</label>
          <input
            type="text"
            placeholder="Field Name"
            required
            className="rounded-lg p-2 input"
            value={field1}
            onChange={(e) => setField1(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label>Second value</label>
          <input
            type="text"
            placeholder="Field Name"
            required
            className="rounded-lg p-2 input"
            value={field2}
            onChange={(e) => setField2(e.target.value)}
          />
        </div>
        <button type="submit" className="btn max-w-xs w-full self-center mt-8 border-primary hover:border-primary">
          {loading ? "Loading..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default SchemaCreatePage;
