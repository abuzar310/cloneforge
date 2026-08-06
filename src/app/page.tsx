import { Hero } from "@/components/wembi/Hero";
import { What } from "@/components/wembi/What";
import { How } from "@/components/wembi/How";
import { Steps } from "@/components/wembi/Steps";
import { Why } from "@/components/wembi/Why";
import { Where } from "@/components/wembi/Where";
import { Faq } from "@/components/wembi/Faq";
import { Contact } from "@/components/wembi/Contact";
import { Footer } from "@/components/wembi/Footer";

export default function Home() {
  return (
    <div className="w-page">
      <div className="w-panel bg-[var(--c-bg)]">
        <Hero />
        <What />
        <How />
        <Steps />
        <Why />
        <Where />
        <Faq />
        <Contact />
        <Footer />
      </div>
    </div>
  );
}
