"use client";

import { useState } from "react";
import { SectionHead } from "./SectionHead";
import type { WhereItem } from "@/types/wembi";

const items: WhereItem[] = [
  {
    title: "Industrial",
    body: "Automazione, digitalizzazione ed integrazione con l'AI sono le sfide in cui gli apparati industriali si stanno imbattendo per garantire un funzionamento continuo e affidabile, spesso vincolato a lunghi cicli di vita e in ambienti mission critical.",
  },
  {
    title: "Energy",
    body: "Monitoraggio e ottimizzazione di infrastrutture energetiche attraverso Digital Twin per efficienza, predizione dei guasti e riduzione dell'impatto ambientale.",
  },
  {
    title: "Aerospace",
    body: "Simulazione e gestione remota di sistemi complessi ad alta affidabilità, con tracciabilità dei dati e scenari predittivi per la manutenzione.",
  },
  {
    title: "Medical",
    body: "Gemelli digitali per apparati biomedicali: controllo, analisi e interoperabilità in ambienti regolati, senza vendor lock-in.",
  },
];

export function Where() {
  const [open, setOpen] = useState(0);

  return (
    <section className="px-[clamp(1rem,4vw,5rem)] py-8">
      <SectionHead index="004" title="WHERE" />
      <div className="mx-auto max-w-[56rem]">
        <p className="w-ff-regular mb-10 text-center text-sm opacity-70 md:text-base">
          Campi di utilizzo
        </p>
        <ul className="divide-y divide-black/15 border-y border-black/15">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={item.title}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between py-6 text-left"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                >
                  <span className="w-ff-regular text-2xl md:text-4xl">
                    {item.title}
                  </span>
                  <span
                    className="flex size-8 items-center justify-center rounded-full text-lg"
                    style={{
                      background: isOpen ? "var(--c-accent)" : "#111",
                      color: isOpen ? "#111" : "var(--c-accent)",
                    }}
                    aria-hidden
                  >
                    {isOpen ? "–" : "+"}
                  </span>
                </button>
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr] pb-8" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="w-ff-regular max-w-xl text-base leading-relaxed opacity-80">
                      {item.body}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="mt-12 overflow-hidden rounded-[0.65rem]">
          <video
            className="aspect-video w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="/videos/wembi/field.webm" type="video/webm" />
          </video>
        </div>
      </div>
    </section>
  );
}
