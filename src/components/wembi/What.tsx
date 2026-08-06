import { SectionHead } from "./SectionHead";

export function What() {
  return (
    <section className="px-[clamp(1rem,4vw,5rem)] py-8">
      <SectionHead index="001" title="WHAT" />
      <div className="mx-auto max-w-[70rem]">
        <div className="w-mini">
          <span>N°001</span>
          <span>Il Gemello Digitale di ogni cosa</span>
        </div>
        <p className="w-ff-regular w-fluid-xl">
          <span className="w-bullet" aria-hidden>
            <i />
            <i />
          </span>
          Un Digital Twin intelligente totalmente gestibile da remoto e in real
          time, che per il suo funzionamento individua predittivamente il
          migliore degli scenari futuribili.
        </p>
      </div>
      <div className="mx-auto mt-16 max-w-[48rem] overflow-hidden rounded-[0.65rem]">
        <video
          className="aspect-square w-full object-cover md:aspect-[4/5]"
          autoPlay
          muted
          loop
          playsInline
          poster="/images/wembi/2_HOW_WEMBI_32815ecf42.jpg"
        >
          <source src="/videos/wembi/pipeline.webm" type="video/webm" />
        </video>
      </div>
    </section>
  );
}
