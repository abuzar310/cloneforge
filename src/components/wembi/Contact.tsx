import { SectionHead } from "./SectionHead";

export function Contact() {
  return (
    <section className="px-[clamp(1rem,4vw,5rem)] py-8">
      <SectionHead index="006" title="CONTACT" />
      <h3 className="w-ff-regular w-fluid-xl mx-auto mb-12 max-w-[40rem] text-center">
        Il tuo cambiamento parte da qui. Contattaci.
      </h3>
      <ul className="mx-auto flex max-w-3xl flex-col gap-4 sm:flex-row sm:justify-center">
        <li className="flex-1">
          <a
            href="mailto:info@wembi.ai"
            className="w-ff-regular w-fluid-lg flex items-center justify-center rounded-full px-8 py-6 text-center transition-transform hover:scale-[1.02]"
            style={{ background: "#BEFF8B", color: "#000" }}
          >
            Mail
          </a>
        </li>
        <li className="flex-1">
          <a
            href="tel:+393516097589"
            className="w-ff-regular w-fluid-lg flex items-center justify-center rounded-full px-8 py-6 text-center transition-transform hover:scale-[1.02]"
            style={{ background: "#D5BAFB", color: "#000" }}
          >
            Phone
          </a>
        </li>
      </ul>
    </section>
  );
}
