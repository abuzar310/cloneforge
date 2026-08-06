import { WembiLogo } from "./WembiLogo";

export function Hero() {
  return (
    <section
      className="w-panel relative flex min-h-[min(1785px,155svh)] flex-col"
      style={{ background: "var(--c-placeholder)" }}
    >
      <div className="absolute inset-0">
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="/images/wembi/1_HEADER_WEMBI_42e842a611.jpg"
        >
          <source src="/videos/wembi/home.webm" type="video/webm" />
        </video>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgb(192 223 233 / 35%) 0%, rgb(192 223 233 / 15%) 40%, rgb(0 0 0 / 25%) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 flex flex-1 flex-col px-[clamp(1.5rem,3vw,2.5rem)] pb-16 pt-[clamp(1.5rem,3vw,2.5rem)]">
        <div className="flex justify-center pt-2 md:justify-start md:pt-4">
          <WembiLogo />
        </div>

        <div className="mt-auto max-w-[min(1116px,92%)] pb-8">
          <div className="w-mini" style={{ color: "var(--c-accent)" }}>
            <span>N°001</span>
            <span>Il Gemello Digitale di ogni cosa</span>
          </div>
          <p
            className="w-ff-regular w-fluid-xl whitespace-pre-line"
            style={{ color: "var(--c-accent)" }}
          >
            {`Wembi migliora
all'istante le performance
di qualsiasi dispositivo,
macchinario o apparato
digitale attraverso la
creazione della sua replica
virtuale.`}
          </p>
        </div>
      </div>
    </section>
  );
}
