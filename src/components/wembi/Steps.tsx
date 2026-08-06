"use client";

import { useState } from "react";
import type { StepSection } from "@/types/wembi";

const sections: StepSection[] = [
  {
    number: "01",
    title: "Digital Twin",
    reverse: false,
    panels: [
      {
        label: "Data",
        body: "Acquisizione e normalizzazione dei dati provenienti dai dispositivi sul campo: raccolta, analisi e visualizzazione.",
        media: "/videos/wembi/stepper_1A.webm",
        mediaType: "video",
      },
      {
        label: "Device",
        body: "Gestione da remoto degli apparati fisici: controllo, manutenzione predittiva, ottimizzazione ed integrazione.",
        media: "/videos/wembi/stepper_1B.webm",
        mediaType: "video",
      },
      {
        label: "Application",
        body: "Regole e logiche di utilizzo: automazione, efficientamento, simulazione, predizione ed integrazione con l'AI.",
        media: "/videos/wembi/stepper_1C.webm",
        mediaType: "video",
      },
    ],
  },
  {
    number: "02",
    title: "Functioning",
    reverse: true,
    panels: [
      {
        label: "Acquisizione",
        body: "Trasformazione in tempo reale del comportamento fisico dell’apparato in dati e informazioni digitali utili.",
        media: "/videos/wembi/stepper_2A.webm",
        mediaType: "video",
      },
      {
        label: "Controllo",
        body: "Interpretazione e validazione dello stato di funzionamento dell'intero apparato al fine di poterlo gestire completamente.",
        media: "/videos/wembi/stepper_2B.webm",
        mediaType: "video",
      },
      {
        label: "Predizione",
        body: "Anticipare il futuro: cosa potrà succedere all'apparato al manifestarsi o meno di una certa eventualità.",
        media: "/videos/wembi/stepper_2C.webm",
        mediaType: "video",
      },
    ],
  },
];

export function Steps() {
  return (
    <>
      {sections.map((sec) => (
        <StepBlock key={sec.number} section={sec} />
      ))}
    </>
  );
}

function StepBlock({ section }: { section: StepSection }) {
  const [active, setActive] = useState(0);
  const panel = section.panels[active];
  const id = section.number === "01" ? "steps-01" : "steps-02";

  return (
    <section
      id={id}
      className="px-[clamp(1rem,4vw,5rem)] py-[clamp(3rem,8vw,6rem)]"
    >
      <div
        className={`mx-auto grid max-w-[80rem] items-center gap-10 lg:grid-cols-2 ${
          section.reverse ? "lg:[&>*:first-child]:order-2" : ""
        }`}
      >
        <div className="relative aspect-square overflow-hidden rounded-[0.65rem] bg-[var(--c-placeholder)]">
          <video
            key={panel.media}
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src={panel.media} type="video/webm" />
          </video>
        </div>

        <div>
          <p className="mb-4 text-sm uppercase tracking-wide opacity-60">
            {section.number}
          </p>
          <h2 className="w-ff-regular w-fluid-lg mb-8">{section.title}</h2>
          <ul className="mb-8 flex flex-col gap-3">
            {section.panels.map((p, i) => (
              <li key={p.label}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  className={`w-ff-regular text-left text-2xl transition-opacity md:text-3xl ${
                    i === active ? "opacity-100" : "opacity-35 hover:opacity-70"
                  }`}
                >
                  {p.label}
                </button>
              </li>
            ))}
          </ul>
          <p className="w-ff-regular max-w-md text-base leading-relaxed md:text-lg">
            {panel.body}
          </p>
        </div>
      </div>
    </section>
  );
}
