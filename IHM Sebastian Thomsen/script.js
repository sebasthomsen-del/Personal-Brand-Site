// ✦ Mörkerläge med sparad inställning (localStorage) ✦
const temaknapp = document.querySelector("#tema");

function uppdateraTemaKnapp(arMorkt) {
    if (temaknapp) {
        temaknapp.setAttribute("aria-label", arMorkt ? "Byt till ljust läge" : "Byt till mörkt läge");
        temaknapp.setAttribute("title", arMorkt ? "Byt till ljust läge" : "Byt till mörkt läge");
    }
}

function initTema() {
    const sparadTema = localStorage.getItem("tema");
    if (sparadTema === "morkt" || (!sparadTema && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
        document.body.classList.add("morkt");
        uppdateraTemaKnapp(true);
    } else {
        document.body.classList.remove("morkt");
        uppdateraTemaKnapp(false);
    }
}

if (temaknapp) {
    temaknapp.addEventListener("click", () => {
        const arMorkt = document.body.classList.toggle("morkt");
        localStorage.setItem("tema", arMorkt ? "morkt" : "ljust");
        uppdateraTemaKnapp(arMorkt);
    });
}
initTema();

// ✦ Mobil hamburgermeny ✦
const mobilknapp = document.querySelector("#mobilmeny-knapp");
const huvudnav = document.querySelector(".huvudnav");

if (mobilknapp && huvudnav) {
    mobilknapp.addEventListener("click", () => {
        const arOppen = huvudnav.classList.toggle("oppen");
        mobilknapp.setAttribute("aria-expanded", arOppen ? "true" : "false");
    });

    // Stäng menyn när en länk klickas
    huvudnav.querySelectorAll(".nav-lank").forEach(lank => {
        lank.addEventListener("click", () => {
            huvudnav.classList.remove("oppen");
            mobilknapp.setAttribute("aria-expanded", "false");
        });
    });
}

// ✦ Aktiv sektion / Scroll-spy med grön prick ✦
const navLankar = document.querySelectorAll(".nav-lank");
const sektioner = [
    document.querySelector("#om"),
    document.querySelector("#tjanster"),
    document.querySelector("#projekt"),
    document.querySelector("#kontakt")
].filter(Boolean);

function uppdateraAktivLank() {
    const scrollY = window.scrollY + 140;

    let aktivId = "";
    sektioner.forEach(sektion => {
        const topp = sektion.offsetTop;
        const hojd = sektion.offsetHeight;
        if (scrollY >= topp && scrollY < topp + hojd) {
            aktivId = sektion.getAttribute("id");
        }
    });

    if (aktivId) {
        navLankar.forEach(lank => {
            const matchar = lank.getAttribute("href") === `#${aktivId}`;
            if (matchar) {
                if (!lank.classList.contains("aktiv")) {
                    navLankar.forEach(l => {
                        l.classList.remove("aktiv");
                        const prick = l.querySelector(".aktiv-prick");
                        if (prick) prick.remove();
                    });
                    lank.classList.add("aktiv");
                    const nyPrick = document.createElement("span");
                    nyPrick.className = "aktiv-prick";
                    nyPrick.setAttribute("aria-hidden", "true");
                    lank.prepend(nyPrick);
                }
            }
        });
    }
}

window.addEventListener("scroll", uppdateraAktivLank, { passive: true });
window.addEventListener("DOMContentLoaded", uppdateraAktivLank);

// ✦ Mjuk scroll till kontaktformuläret vid klick på CTA-knappar ✦
document.querySelectorAll('a[href="#kontakt"]').forEach(knapp => {
    knapp.addEventListener("click", (e) => {
        const kontaktSektion = document.querySelector("#kontakt");
        if (kontaktSektion) {
            e.preventDefault();
            kontaktSektion.scrollIntoView({ behavior: "smooth", block: "start" });
            const namnInput = document.querySelector("#kontakt-namn");
            if (namnInput) {
                setTimeout(() => namnInput.focus(), 650);
            }
        }
    });
});

// ✦ Validering och interaktiv hantering av kontaktformuläret ✦
const kontaktForm = document.querySelector("#kontakt-form");
const kontaktBekraftelse = document.querySelector("#kontakt-bekraftelse");
const skickaKnapp = document.querySelector("#kontakt-skicka");

if (kontaktForm) {
    kontaktForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const namn = document.querySelector("#kontakt-namn");
        const epost = document.querySelector("#kontakt-epost");
        const meddelande = document.querySelector("#kontakt-meddelande");

        let arGiltig = true;

        // Återställ felindikering
        document.querySelectorAll(".form-grupp").forEach(g => g.classList.remove("har-fel"));

        if (!namn || !namn.value.trim()) {
            const grupp = document.querySelector("#grupp-namn");
            if (grupp) grupp.classList.add("har-fel");
            const felSpan = document.querySelector("#namn-fel");
            if (felSpan) felSpan.textContent = "Vänligen ange ditt namn.";
            arGiltig = false;
        }

        const epostRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!epost || !epostRegex.test(epost.value.trim())) {
            const grupp = document.querySelector("#grupp-epost");
            if (grupp) grupp.classList.add("har-fel");
            const felSpan = document.querySelector("#epost-fel");
            if (felSpan) felSpan.textContent = "Vänligen ange en giltig e-postadress.";
            arGiltig = false;
        }

        if (!meddelande || !meddelande.value.trim()) {
            const grupp = document.querySelector("#grupp-meddelande");
            if (grupp) grupp.classList.add("har-fel");
            const felSpan = document.querySelector("#meddelande-fel");
            if (felSpan) felSpan.textContent = "Vänligen skriv ett meddelande.";
            arGiltig = false;
        }

        if (arGiltig && skickaKnapp) {
            const ursprungligKnappText = skickaKnapp.innerHTML;
            skickaKnapp.disabled = true;
            skickaKnapp.innerHTML = "<span>Skickar...</span>";

            setTimeout(() => {
                skickaKnapp.innerHTML = ursprungligKnappText;
                skickaKnapp.disabled = false;
                kontaktForm.reset();
                if (kontaktBekraftelse) {
                    kontaktBekraftelse.hidden = false;
                    kontaktBekraftelse.scrollIntoView({ behavior: "smooth", block: "nearest" });
                }
            }, 600);
        }
    });

    // Rensa fel när användaren börjar skriva
    kontaktForm.querySelectorAll("input, textarea").forEach(input => {
        input.addEventListener("input", () => {
            const grupp = input.closest(".form-grupp");
            if (grupp) grupp.classList.remove("har-fel");
        });
    });
}