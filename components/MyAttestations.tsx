"use client";

import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import { gql } from "@apollo/client";
import { useWeb3ModalSigner } from "@web3modal/ethers5/react";
import { useEffect, useState } from "react";


const GET_MY_ATTESTATIONS = gql`
  query Attestations($resolverAddress: String!){
    attestations(
      where: {
        schema: {
          is: {
            resolver: { equals: $resolverAddress }
          }
        }
      }
    ) {
      attester
      id
      revocable
      timeCreated
      schema {
        resolver
      }
    }
  }
`;

const MyAttestations = () => {
  const { signer } = useWeb3ModalSigner()
  const sepoliaResolver = "0xB4Fb406b75db78D69c28E616Ef317f6ea6FE3497"
  const goerliResolver = "0xc5ed581f35741340B4804CEf076Adc5C9C46A872"
  const variables = { resolverAddress: sepoliaResolver }
  const [clientName, setClientName] = useState("sepolia")

  useEffect(() => {
    signer?.getChainId().then((chainId) => {
      // sepolia === 11155111
      if (chainId !== 11155111) {
        variables.resolverAddress = goerliResolver;
        setClientName("base")
      } else {
        variables.resolverAddress = sepoliaResolver;
        setClientName("sepolia")
      }
    });
  }, [signer])

  const { loading, error, data } = useQuery(GET_MY_ATTESTATIONS, {variables, context: { clientName: clientName }});
  console.log(loading, error, data);


  if (!!error) return <p>Error :(</p>;
  if (loading) return <p>Loading...</p>;
  if (!data) return <p>No data</p>;

  return (
    <table className="table table-zebra">
      <thead>
        <tr>
          <th>Attestation ID</th>
          <th>Attester</th>
          <th>Time Created</th>
          <th>Revocable?</th>
          <th>Schema Resolver</th>
        </tr>
        </thead>
        <tbody>
      {data.attestations.map((attestation: any, index: number) => (
        <tr key={index}>
          <td>{attestation.id.length > 10 ? attestation.id.slice(0, 10)+'...' : attestation.id}</td>
          <td>{attestation.attester.length > 10 ? attestation.attester.slice(0, 10)+'...' : attestation.attester}</td>
          <td>{new Date(attestation.timeCreated*1000).toLocaleString()}</td>
          <td>{attestation.revocable ? 'true' : 'false'}</td>
          <td>{attestation.schema.resolver.length > 10 ? attestation.schema.resolver.slice(0, 10)+'...' : attestation.schema.resolver}</td>
        </tr>
      ))}
      </tbody>
    </table>
  )
}
export default MyAttestations;