"use client";

import { useState } from "react";
import { SectionHead } from "./SectionHead";
import type { FaqItem } from "@/types/wembi";

const faqs: FaqItem[] = [
  {
    id: "01",
    label: "N°01",
    question: "In sintesi che cos'è concretamente Wembi?",
    answer:
      "Wemby è una piattaforma Web che permette di visualizzare e gestire un qualsiasi apparato che espone un'interfaccia digitale o digitalizzabile all’interno di un unico cruscotto secondo le proprie esigenze, sia in chiave analitica che predittiva.",
  },
  {
    id: "02",
    label: "N°02",
    question: "Che tipo di apparati possono essere connessi a Wembi?",
    answer:
      "Qualsiasi macchinario, dispositivo fisico, sensore o asset che espone o è potenzialmente abilitato ad esporre un'interfaccia digitale dunque, ad oggi, praticamente qualsiasi dispositivo fisico che viene connesso a una presa di corrente (e non solo).",
  },
  {
    id: "03",
    label: "N°03",
    question: "Che tipo di vincoli ci sono una volta connesso l'apparato a Wembi?",
    answer:
      'Wembi è una piattaforma che si integra a un\'architettura OT-IT distribuita e interamente open source: non ci sono dunque altri vincoli o restrizioni legate al pagamento di costi di licenza, recurrent fees o a una qualche policy di vendor lock in. Effettuata dunque la prima integrazione per l\'attivazione del servizio l\'utente sarà abilitato all\'utilizzo del pannello con una formula al 100% "pay per use".',
  },
  {
    id: "04",
    label: "N°04",
    question: "Qual è l'effettivo valore aggiunto di Wembi?",
    answer:
      "Semplificazione dell'adozione della soluzione e dell'onboarding, dell'esperienza di utilizzo, dell'integrazione e dell'interoperabilità rispetto a qualsiasi altra piattaforma IoT EDGE ed EDGE AI esistente, efficientamento degli apparati a seguito della sua introduzione, risparmio economico consistente derivante dalla manutenzione predittiva, incremento dei cicli di produzione e riduzione dell'impatto ambientale.",
  },
  {
    id: "05",
    label: "N°05",
    question: "Perché dovrei voler creare il Digital Twin dei miei apparati?",
    answer:
      "La creazione della replica virtuale di un apparato fisico permette l'analisi e la completa gestione dei dispositivi che lo compongono, dei dati che circolano al suo interno e delle applicazioni in uso. Grazie a questo si è in grado di simulare il suo comportamento, lo stato e le prestazioni effettuando così un agevole monitoraggio, prevedendo eventuali problemi, ottimizzando e testando senza rischi, simulando scenari di incremento della produzione e di efficientamento energetico.",
  },
];

export function Faq() {
  const [active, setActive] = useState(0);
  const item = faqs[active];

  return (
    <section className="px-[clamp(1rem,4vw,5rem)] py-8">
      <SectionHead index="005" title="QUESTIONS" />
      <div className="mx-auto max-w-[48rem] text-center">
        <h3 className="w-ff-regular w-fluid-lg mb-6">FAQ</h3>
        <p className="w-ff-regular mx-auto mb-14 max-w-xl text-base leading-relaxed md:text-lg">
          <span className="w-bullet" aria-hidden>
            <i style={{ background: "var(--c-accent)" }} />
            <i style={{ background: "var(--c-accent)" }} />
          </span>
          Per rendere tutto più semplice, abbiamo raccolto qui le risposte alle
          domande più frequenti.
        </p>
      </div>

      <div className="mx-auto max-w-[52rem] rounded-[1rem] bg-white px-6 py-10 shadow-sm md:px-12 md:py-14">
        <div className="mb-10 flex flex-wrap justify-center gap-3 md:gap-5">
          {faqs.map((f, i) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setActive(i)}
              className={`w-ff-regular rounded-full px-4 py-2 text-sm transition-colors md:text-base ${
                i === active
                  ? "bg-black text-[var(--c-accent)]"
                  : "bg-transparent text-black/50 hover:text-black"
              }`}
            >
              <span
                className="mr-2 inline-block size-2 rounded-full"
                style={{
                  background: i === active ? "var(--c-accent)" : "#ccc",
                }}
              />
              {f.label}
            </button>
          ))}
        </div>

        <p className="mb-2 text-xs uppercase tracking-widest text-black/40">
          Domanda
        </p>
        <h4 className="w-ff-regular mb-8 whitespace-pre-line text-2xl md:text-4xl">
          {item.question}
        </h4>
        <div
          className="mb-6 h-1 w-full rounded-full"
          style={{ background: "var(--c-accent)" }}
        />
        <p className="w-ff-regular text-base leading-relaxed text-black/80 md:text-lg">
          {item.answer}
        </p>
      </div>
    </section>
  );
}
