// Hora de Lima (24h) en cada [data-lima-time]; se refresca cada 15s.
const fmt = new Intl.DateTimeFormat("es-PE", {
  timeZone: "America/Lima",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

export function initLimaClock() {
  const els = document.querySelectorAll("[data-lima-time]");
  if (!els.length) return;
  const paint = () => {
    const now = new Date();
    const s = fmt.format(now);
    const iso = now.toISOString();
    els.forEach((el) => {
      if (el.textContent !== s) el.textContent = s;
      if (el instanceof HTMLTimeElement) el.dateTime = iso;
    });
  };
  paint();
  setInterval(paint, 15000);
}
