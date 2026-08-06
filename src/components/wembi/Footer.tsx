export function Footer() {
  return (
    <footer className="mt-8 border-t border-black/10 px-[clamp(1rem,4vw,5rem)] py-12">
      <div className="mx-auto grid max-w-[80rem] gap-10 md:grid-cols-2">
        <div>
          <p className="mb-3 text-sm opacity-50">Headquarter</p>
          <a
            href="https://maps.app.goo.gl/KidxgpAS2TgGTrXc7"
            target="_blank"
            rel="noopener noreferrer"
            className="w-ff-regular text-base leading-relaxed hover:underline md:text-lg"
          >
            Via Cotonificio, 45
            <br />
            33010 - Feletto Umberto
            <br />
            Udine - Italy
          </a>
        </div>
        <div className="md:text-right">
          <p className="mb-3 text-sm opacity-50">Contact</p>
          <div className="w-ff-regular flex flex-col gap-1 text-base md:items-end md:text-lg">
            <a href="tel:+393516097589" className="hover:underline">
              Phone - +39 351 609 7589
            </a>
            <a href="mailto:info@wembi.ai" className="hover:underline">
              Mail - info@wembi.ai
            </a>
            <span className="mt-2 opacity-70">P.IVA &amp; C.F. 03148630308</span>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-[80rem] flex-wrap items-center justify-between gap-4 text-xs opacity-50">
        <p>Wembi powered by Innoverse Group</p>
        <div className="flex gap-4">
          <a href="https://www.wembi.ai/" className="hover:underline">
            Cookie
          </a>
          <a href="https://www.wembi.ai/" className="hover:underline">
            Privacy
          </a>
          <a href="https://www.wembi.ai/" className="hover:underline">
            Credits
          </a>
        </div>
      </div>
    </footer>
  );
}
