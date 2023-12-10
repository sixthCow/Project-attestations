"use client";

import { ApolloWrapper } from "@/app/ApolloWrapper";
import { Web3ModalProvider } from "@/context/Web3Modal";
import { Toaster } from "react-hot-toast";
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

const AppWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
    <ProgressBar
        height="4px"
        color="#959FFF"
        options={{ 
          showSpinner: false,
          minimum: 0.2
         }}
        shallowRouting
        delay={200}
      />
      <Web3ModalProvider>
        <ApolloWrapper>{children}</ApolloWrapper>
      </Web3ModalProvider>
      <Toaster position="bottom-center" reverseOrder={false} gutter={8} toastOptions={
        {
          duration: 5000,

        }
      }/>
    </>
  );
};

export default AppWrapper;
