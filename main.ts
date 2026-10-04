const CONTACT_EMAIL = "geoexpertpg@gmail.com";

function initMenu(): void {
  const btn = document.querySelector<HTMLButtonElement>(".menu-btn");
  const nav = document.querySelector<HTMLElement>("#nav");
  if (!btn || !nav) return;
  btn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", String(open));
  });
}

function initContactForm(): void {
  const form = document.querySelector<HTMLFormElement>("#contact-form");
  const status = document.querySelector<HTMLElement>("#form-status");
  if (!form || !status) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) {
      status.textContent = "Popunite sva polja prije slanja.";
      return;
    }
    const data = new FormData(form);
    const value = (key: string): string => String(data.get(key) ?? "").trim();
    const ime = value("ime");
    const prezime = value("prezime");
    const subject = `Upit sa sajta: ${ime} ${prezime}`;
    const body = `Ime i prezime: ${ime} ${prezime}\n\n${value("poruka")}`;
    window.location.href =
      `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    status.textContent = "Otvorili smo vaš program za e-poštu. Pošaljite poruku odatle.";
  });
}

const year = document.querySelector<HTMLElement>("#year");
if (year) year.textContent = String(new Date().getFullYear());
initMenu();
initContactForm();
