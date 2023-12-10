"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import ConnectButton from "@/components/ConnectButton";

import logoImg from "@/public/logo.webp";

const Navbar = () => {
  const pathname = usePathname();

  return (
    <>
      <nav className="flex max-w-6xl mx-auto items-center justify-between w-full h-[70px] py-12 px-16">
        <Link
          href="/"
          className="text-xl font-bold underline underline-p-4 hover:text-slate-300 transition ease-in-out"
        >
        
        </Link>

        <div role="tablist" className="tabs tabs-lg tabs-bordered">

          <Link href="/dapp/schema" role="tab" className={
                pathname == "/dapp/schema" ? "tab tab-active" : "tab"
              }>
            Schema
          </Link>
          <Link href="/dapp/attestation" role="tab"
              className={
                pathname == "/dapp/attestation" ? "tab tab-active" : "tab"
              }>
            Attestation
          </Link>
          <Link href="/dapp/history" role="tab"
              className={
                pathname == "/dapp/history" ? "tab tab-active" : "tab"
              }>
            History
          </Link>
        </div>
        <ConnectButton />
      </nav>
    </>
  );
};

export default Navbar;
