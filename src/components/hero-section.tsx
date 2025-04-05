import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  FileText,
  Share2,
  Shield,
  Download,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextEffect } from "@/components/motion-primitives/text-effect";
import { AnimatedGroup } from "@/components/motion-primitives/animated-group";
import { HeroHeader } from "@/components/hero5-header";
import { createThirdwebClient } from "thirdweb";
import { ConnectButton } from "thirdweb/react";
import { inAppWallet, createWallet } from "thirdweb/wallets";

const client = createThirdwebClient({
  clientId: "....",
});

const wallets = [
  inAppWallet({
    auth: {
      options: ["google", "email", "phone"],
    },
  }),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
  createWallet("io.zerion.wallet"),
];

const menuItems = [
  { name: "Features", href: "#features" },
  { name: "About", href: "#about" },
];

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
};

const proofFeatures = [
  {
    title: "Transaction Certificates",
    description:
      "Generate professional PDF certificates verifying your blockchain transactions",
    icon: FileText,
  },
  {
    title: "One-Click Sharing",
    description:
      "Easily share transaction proofs via email, messaging apps, or social media",
    icon: Share2,
  },
  {
    title: "Tamper-Proof Verification",
    description:
      "Each document includes cryptographic signatures that prevent forgery",
    icon: Shield,
  },
  {
    title: "Instant Downloads",
    description:
      "Download transaction proof PDFs immediately after verification completes",
    icon: Download,
  },
];

export default function HeroSection() {
  return (
    <>
      <HeroHeader />
      <main className="overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 isolate hidden opacity-65 contain-strict lg:block"
        >
          <div className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
          <div className="h-320 absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
          <div className="h-320 -translate-y-87.5 absolute left-0 top-0 w-60 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
        </div>

        {/* Hero Section */}
        <section>
          <div className="relative pt-24 md:pt-36">
            <div className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]"></div>
            <div className="mx-auto max-w-7xl px-6">
              <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                <TextEffect
                  preset="fade-in-blur"
                  speedSegment={0.3}
                  as="h1"
                  className="mt-8 text-balance text-6xl md:text-7xl lg:mt-16 xl:text-[5.25rem]"
                >
                  Verifiable Transaction Proofs
                </TextEffect>
                <TextEffect
                  per="line"
                  preset="fade-in-blur"
                  speedSegment={0.3}
                  delay={0.5}
                  as="p"
                  className="mx-auto mt-8 max-w-2xl text-balance text-lg"
                >
                  Generate official-looking, tamper-proof PDF documents to
                  verify your blockchain transactions and share them with anyone
                  who needs proof of payment.
                </TextEffect>

                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Button size="lg" className="group rounded-full px-8">
                    Verify Transaction
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="group rounded-full px-8"
                  >
                    View Sample PDF
                    <FileText className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* How It Works Section */}
            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: {
                      staggerChildren: 0.05,
                      delayChildren: 0.75,
                    },
                  },
                },
                ...transitionVariants,
              }}
              className="mt-20"
            >
              <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-6xl overflow-hidden rounded-2xl border p-4 shadow-lg shadow-zinc-950/15 ring-1">
                <div className="p-6">
                  <h2 className="mb-8 text-center text-2xl font-bold">
                    How It Works
                  </h2>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="flex flex-col items-center rounded-lg p-6 text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <span className="text-xl font-bold">1</span>
                      </div>
                      <h3 className="mt-4 text-lg font-medium">
                        Connect Your Wallet
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Link your crypto wallet to verify your transaction
                        details securely
                      </p>
                    </div>
                    <div className="flex flex-col items-center rounded-lg p-6 text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <span className="text-xl font-bold">2</span>
                      </div>
                      <h3 className="mt-4 text-lg font-medium">
                        Select Transaction
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Choose the transaction you want to verify from your
                        history
                      </p>
                    </div>
                    <div className="flex flex-col items-center rounded-lg p-6 text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <span className="text-xl font-bold">3</span>
                      </div>
                      <h3 className="mt-4 text-lg font-medium">
                        Get Your PDF Proof
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Download and share your tamper-proof verification
                        certificate
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-8 p-6 md:grid-cols-2 lg:grid-cols-4">
                  {proofFeatures.map((feature, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center p-4 text-center transition-all duration-300 hover:scale-105"
                    >
                      <div className="mb-4 rounded-full bg-primary/10 p-3">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="mb-2 text-lg font-semibold">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedGroup>
          </div>
        </section>

        {/* Document Preview Section */}
        <section className="bg-background pb-16 pt-16 md:pb-32">
          <div className="relative m-auto max-w-5xl px-6">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold md:text-4xl">
                Your Transaction, Officially Verified
              </h2>
              <p className="mt-4 text-muted-foreground">
                Professional, shareable documents that prove transaction
                authenticity
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="flex flex-col justify-center">
                <h3 className="text-xl font-semibold">
                  Verification Document Includes:
                </h3>
                <ul className="mt-4 space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                    <span>Transaction hash and timestamp</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                    <span>Sender and recipient addresses</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                    <span>Transaction amount and currency</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                    <span>Network confirmation status</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                    <span>Digital signature and QR verification code</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                    <span>Online verification link</span>
                  </li>
                </ul>
                <Button className="mt-6 w-fit">Generate Your Proof Now</Button>
              </div>

              <div className="flex items-center justify-center">
                <div className="aspect-w-8 aspect-h-11 relative w-full max-w-md rounded-lg border bg-white p-8 shadow-lg">
                  <div className="mb-8 flex items-center justify-between">
                    <div className="h-12 w-32 rounded bg-gray-200"></div>
                    <div className="h-12 w-12 rounded-full bg-gray-200"></div>
                  </div>
                  <div className="mb-6 h-8 w-full rounded bg-gray-200"></div>
                  <div className="mb-10 h-4 w-2/3 rounded bg-gray-200"></div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <div className="h-4 w-1/3 rounded bg-gray-200"></div>
                      <div className="h-4 w-1/2 rounded bg-gray-200"></div>
                    </div>
                    <div className="flex justify-between">
                      <div className="h-4 w-1/4 rounded bg-gray-200"></div>
                      <div className="h-4 w-1/2 rounded bg-gray-200"></div>
                    </div>
                    <div className="flex justify-between">
                      <div className="h-4 w-2/5 rounded bg-gray-200"></div>
                      <div className="h-4 w-1/3 rounded bg-gray-200"></div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-between">
                    <div className="h-16 w-16 rounded bg-gray-200"></div>
                    <div className="h-8 w-24 rounded bg-gray-200"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
