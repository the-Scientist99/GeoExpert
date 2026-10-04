"use strict";
const CONTACT_EMAIL = "geoexpertpg@gmail.com";
function initMenu() {
    const btn = document.querySelector(".menu-btn");
    const nav = document.querySelector("#nav");
    if (!btn || !nav) return;
    btn.addEventListener("click", () => {
        const open = nav.classList.toggle("open");
        btn.setAttribute("aria-expanded", String(open));
    });
}
function initContactForm() {
    const form = document.querySelector("#contact-form");
    const status = document.querySelector("#form-status");
    if (!form || !status) return;
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!form.reportValidity()) {
            status.textContent = "Popunite sva polja prije slanja.";
            return;
        }
        const data = new FormData(form);
        const value = (key) => String(data.get(key) ?? "").trim();
        const ime = value("ime");
        const prezime = value("prezime");
        const subject = `Upit sa sajta: ${ime} ${prezime}`;
        const body = `Ime i prezime: ${ime} ${prezime}\n\n${value("poruka")}`;
        window.location.href =
            `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        status.textContent = "Otvorili smo vaš program za e-poštu. Pošaljite poruku odatle.";
    });
}
const year = document.querySelector("#year");
if (year) year.textContent = String(new Date().getFullYear());
initMenu();
initContactForm();
