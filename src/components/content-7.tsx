import {
  FileCheck,
  FileText,
  Handshake,
  ArrowRightLeft,
  Clock,
  Shield,
} from "lucide-react";
import Image from "next/image";

export default function ContentSection() {
  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
        <h2 className="relative z-10 max-w-xl text-4xl font-medium lg:text-5xl">
          Verifiable transaction proofs between parties
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 md:gap-12 lg:gap-24">
          <div className="relative space-y-4">
            <p className="text-muted-foreground">
              Our platform creates{" "}
              <span className="text-accent-foreground font-bold">
                immutable proof of transactions
              </span>{" "}
              — generating verifiable PDFs that confirm whether transactions
              occurred between two parties.
            </p>
            <p className="text-muted-foreground">
              Connect your wallet to instantly generate blockchain-verified PDFs
              that serve as legal proof of transactions, settlements, and
              agreements between you and any counterparty.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-6 sm:gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <ArrowRightLeft className="size-4" />
                  <h3 className="text-sm font-medium">Transaction Proof</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  Generate PDFs that prove transactions occurred with
                  cryptographic verification.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FileCheck className="size-4" />
                  <h3 className="text-sm font-medium">Verification</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  Instantly verify if a transaction happened between specific
                  parties.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-3 sm:gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Handshake className="size-4" />
                  <h3 className="text-sm font-medium">Multi-Party</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  Support for two-party or multi-party transaction verification
                  and proofs.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="size-4" />
                  <h3 className="text-sm font-medium">Timestamps</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  Chronological proof with tamper-proof blockchain timestamps.
                </p>
              </div>
            </div>
          </div>
          <div className="relative mt-6 sm:mt-0">
            <div className="bg-linear-to-b aspect-67/34 relative rounded-2xl from-zinc-300 to-transparent p-px dark:from-zinc-700">
              <Image
                src="/transaction-proof-dark.png"
                className="hidden rounded-[15px] dark:block"
                alt="Transaction proof document dark"
                width={1206}
                height={612}
              />
              <Image
                src="/transaction-proof.png"
                className="rounded-[15px] shadow dark:hidden"
                alt="Transaction proof document light"
                width={1206}
                height={612}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
