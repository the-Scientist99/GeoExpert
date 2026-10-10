"use strict";
// Contact form delivery: Web3Forms (https://web3forms.com) forwards each
// submission to the inbox its access key was created for. The key lives in
// kontakt.html (hidden "access_key" input); it is a public identifier, not a secret.
const FORM_TIMEOUT_MS = 15000;
const FORM_SENDING = "Šaljemo poruku…";
const FORM_SENT = "Poruka je poslata. Javićemo vam se.";
const FORM_FAILED = "Poruka nije poslata. Pokušajte ponovo ili nas pozovite.";
function initMenu() {
    const btn = document.querySelector(".menu-btn");
    const nav = document.querySelector("#nav");
    if (!btn || !nav)
        return;
    const setOpen = (open) => {
        nav.classList.toggle("open", open);
        btn.setAttribute("aria-expanded", String(open));
    };
    btn.addEventListener("click", () => setOpen(!nav.classList.contains("open")));
    document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape" || !nav.classList.contains("open"))
            return;
        setOpen(false);
        btn.focus();
    });
}
/** Collects the non-empty text fields of the form, trimmed. */
function readFields(form) {
    const fields = {};
    new FormData(form).forEach((value, key) => {
        if (typeof value === "string" && value.trim())
            fields[key] = value.trim();
    });
    return fields;
}
async function sendForm(endpoint, fields) {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), FORM_TIMEOUT_MS);
    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify(fields),
            signal: controller.signal,
        });
        const result = await response.json().catch(() => null);
        if (!response.ok || result?.success !== true) {
            throw new Error(`Form service rejected the message (HTTP ${response.status}).`);
        }
    }
    finally {
        window.clearTimeout(timer);
    }
}
function initContactForm() {
    const form = document.querySelector("#contact-form");
    const status = document.querySelector("#form-status");
    const button = form?.querySelector('button[type="submit"]');
    if (!form || !status || !button)
        return;
    const show = (message, state = "") => {
        status.textContent = message;
        status.dataset.state = state;
    };
    // The browser validates required fields before this event fires.
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const fields = readFields(form);
        // Honeypot: real visitors never see or tick this box. Drop the message quietly.
        if (fields.botcheck) {
            form.reset();
            show(FORM_SENT, "ok");
            return;
        }
        fields.subject = `Upit sa sajta: ${fields.Ime ?? ""} ${fields.Prezime ?? ""}`.trim();
        button.disabled = true;
        show(FORM_SENDING);
        try {
            if (!fields.access_key)
                throw new Error("Contact form has no access_key set in kontakt.html.");
            await sendForm(form.action, fields);
            form.reset();
            show(FORM_SENT, "ok");
        }
        catch (error) {
            console.error(error);
            show(FORM_FAILED, "error");
        }
        finally {
            button.disabled = false;
        }
    });
}
const year = document.querySelector("#year");
if (year)
    year.textContent = String(new Date().getFullYear());
initMenu();
initContactForm();
