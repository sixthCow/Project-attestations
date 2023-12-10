"use client";
// ^ this file needs the "use client" pragma

import { ApolloLink, HttpLink } from "@apollo/client";
import {
  ApolloNextAppProvider,
  NextSSRInMemoryCache,
  NextSSRApolloClient,
  SSRMultipartLink,
} from "@apollo/experimental-nextjs-app-support/ssr";
import { useWeb3ModalSigner } from "@web3modal/ethers5/react";

// have a function to create a client for you
function makeClient() {
  const endpointSepolia = new HttpLink({
    uri: "https://sepolia.easscan.org/graphql",
    fetchOptions: { cache: "no-store" },
  });
  const endpointGoerli = new HttpLink({
    uri: "https://base-goerli-predeploy.easscan.org/graphql",
    fetchOptions: { cache: "no-store" },
  });

  return new NextSSRApolloClient({
    // use the `NextSSRInMemoryCache`, not the normal `InMemoryCache`
    cache: new NextSSRInMemoryCache(),
    link:
      /*typeof window === "undefined"
        ? ApolloLink.from([
            // in a SSR environment, if you use multipart features like
            // @defer, you need to decide how to handle these.
            // This strips all interfaces with a `@defer` directive from your queries.
            new SSRMultipartLink({
              stripDefer: true,
            }),
            endpointSepolia,
            endpointGoerli,
          ])
          // TODO dynamic endpoints
        : */
        ApolloLink.split(
          (operation) => operation.getContext().clientName === "sepolia",
          endpointSepolia,
          endpointGoerli,
        ),
  });
}

// you need to create a component to wrap your app in
export function ApolloWrapper({ children }: React.PropsWithChildren) {

  const { signer } = useWeb3ModalSigner()
  const customUrl = "https://sepolia.easscan.org/graphql";

  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}