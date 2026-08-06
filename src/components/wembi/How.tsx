import { SectionHead } from "./SectionHead";

const items = [
  { label: "Digital Twin", href: "#steps-01" },
  { label: "Functioning", href: "#steps-02" },
];

export function How() {
  return (
    <section className="px-[clamp(1rem,4vw,5rem)] py-8">
      <SectionHead index="002" title="HOW" />
      <ul className="mx-auto flex max-w-[40rem] flex-col gap-6 py-10">
        {items.map((item) => (
          <li key={item.label}>
            <a
              href={item.href}
              className="w-ff-regular w-fluid-lg block text-center transition-opacity hover:opacity-60"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
