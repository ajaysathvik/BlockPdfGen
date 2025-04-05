"use client";

import Image from "next/image";

import FooterSection from "@/components/footer";
import HeroSection from "@/components/hero-section";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <FooterSection />
    </main>
  );
}
