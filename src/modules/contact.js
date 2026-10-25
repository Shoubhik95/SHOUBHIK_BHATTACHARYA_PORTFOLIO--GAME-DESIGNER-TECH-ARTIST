// Contact form → Web3Forms. Same endpoint, access key and payload shape as the original integration
// (js/modules/modal.js). The access key is a public client-side key by design; the recipient address
// is configured in the Web3Forms dashboard for that key, not in this code.
import { web3forms } from "../data/profile.js";
import { $ } from "./util.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function initContact() {
  const form = $("#contact-form");
  if (!form) return;
  const send = $("#cf-send"), clear = $("#cf-clear"), status = $("#cf-status");
  const fields = ["name", "email", "subject", "message"].map((k) => form.elements[k]);
  let sending = false;

  const setStatus = (kind, text) => {
    status.className = `cf-status ${kind}`;
    status.textContent = text;
    status.hidden = !text;
  };
  const setError = (el, msg) => {
    const out = $(`#cf-${el.name}-err`);
    out.textContent = msg;
    el.setAttribute("aria-invalid", msg ? "true" : "false");
  };
  const check = (el) => {
    const v = el.value.trim();
    let msg = "";
    if (!v) msg = "This field is required.";
    else if (el.name === "email" && !EMAIL_RE.test(v)) msg = "Please enter a valid email address.";
    else if (el.name === "message" && v.length < 10) msg = "Please write at least a short sentence (10+ characters).";
    setError(el, msg);
    return !msg;
  };
  fields.forEach((el) => {
    el.addEventListener("blur", () => { if (el.value || el.getAttribute("aria-invalid") === "true") check(el); });
    el.addEventListener("input", () => { if (el.getAttribute("aria-invalid") === "true") check(el); });
  });

  clear.addEventListener("click", () => {
    if (sending) return;
    form.reset();
    fields.forEach((el) => setError(el, ""));
    setStatus("", "");
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (sending) return; // no duplicate submissions while a request is in flight
    const ok = fields.map(check).every(Boolean);
    if (!ok) {
      setStatus("error", "Please fix the highlighted fields and try again.");
      fields.find((el) => el.getAttribute("aria-invalid") === "true")?.focus();
      return;
    }

    sending = true;
    send.disabled = true; clear.disabled = true;
    send.textContent = "SENDING...";
    form.setAttribute("aria-busy", "true");
    setStatus("info", "Sending your message…");

    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 20000);
    try {
      const res = await fetch(web3forms.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        signal: ctrl.signal,
        body: JSON.stringify({
          access_key: web3forms.accessKey,
          from_name: web3forms.fromName,
          name: form.elements.name.value.trim(),
          email: form.elements.email.value.trim(),
          subject: `Portfolio Contact — ${form.elements.subject.value.trim()}`,
          message: form.elements.message.value.trim(),
          botcheck: form.elements.botcheck.checked, // honeypot: Web3Forms drops submissions where this is set
        }),
      });
      let data = null;
      try { data = await res.json(); } catch { /* non-JSON response */ }
      if (res.ok && data && data.success === true) {
        form.reset();
        fields.forEach((el) => setError(el, ""));
        setStatus("success", "Message sent successfully! Thank you for reaching out.");
      } else {
        console.error("[contact] Web3Forms rejected the submission:", res.status, data);
        setStatus("error", `Your message could not be sent${data?.message ? ` (${data.message})` : ""}. Your text is still here — please try again.`);
      }
    } catch (err) {
      console.error("[contact] request failed:", err);
      setStatus("error", err.name === "AbortError"
        ? "The request timed out. Your message is still here — please try again."
        : "Network error: couldn't reach the mail service. Your message is still here — please check your connection and try again.");
    } finally {
      clearTimeout(timer);
      sending = false;
      send.disabled = false; clear.disabled = false;
      send.textContent = "SEND MESSAGE";
      form.removeAttribute("aria-busy");
    }
  });
}
