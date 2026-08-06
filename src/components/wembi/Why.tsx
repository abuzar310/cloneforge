import { SectionHead } from "./SectionHead";

const words = ["Efficace", "Sostenibile", "Efficiente", "Libero"];

export function Why() {
  return (
    <section className="px-[clamp(1rem,4vw,5rem)] py-8">
      <SectionHead index="003" title="WHY" />
      <div className="mx-auto grid max-w-[80rem] items-center gap-12 lg:grid-cols-2">
        <ul className="flex flex-col gap-4 py-6">
          {words.map((w) => (
            <li key={w} className="w-ff-regular w-fluid-lg">
              {w}
            </li>
          ))}
        </ul>
        <div className="overflow-hidden rounded-[0.65rem]">
          <video
            className="aspect-square w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster="/images/wembi/5_WHY_WEMBI_704253f0b4.jpg"
          >
            <source src="/videos/wembi/why.webm" type="video/webm" />
          </video>
        </div>
      </div>
    </section>
  );
}
