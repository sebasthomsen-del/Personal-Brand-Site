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
const sektioner = document.querySelectorAll("main section[id]");
const navLankar = document.querySelectorAll(".nav-lank");

function uppdateraAktivLank() {
    let aktuellSektionId = "";
    const scrollPos = window.scrollY + 180;

    sektioner.forEach(sektion => {
        const sektionTop = sektion.offsetTop;
        const sektionHeight = sektion.offsetHeight;
        if (scrollPos >= sektionTop && scrollPos < sektionTop + sektionHeight) {
            aktuellSektionId = sektion.getAttribute("id");
        }
    });

    // Om vi nått nära botten, markera sista sektionen
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 80) {
        if (sektioner.length > 0) {
            aktuellSektionId = sektioner[sektioner.length - 1].getAttribute("id");
        }
    }

    // Ta bort aktiv klass och flytta den gröna pricken
    let prickFlyttad = false;
    navLankar.forEach(lank => {
        const href = lank.getAttribute("href");
        if (href === `#${aktuellSektionId}`) {
            lank.classList.add("aktiv");
            // Se till att pricken ligger i den aktiva länken
            let prick = document.querySelector(".aktiv-prick");
            if (!prick) {
                prick = document.createElement("span");
                prick.className = "aktiv-prick";
                prick.setAttribute("aria-hidden", "true");
            }
            if (lank.firstChild !== prick) {
                lank.insertBefore(prick, lank.firstChild);
            }
            prickFlyttad = true;
        } else {
            lank.classList.remove("aktiv");
        }
    });

    // Om ingen sektion matchar (t.ex. i toppen/intro), markera Om mig som standard
    if (!prickFlyttad && navLankar.length > 0 && window.scrollY < 400) {
        const forstaLank = navLankar[0];
        forstaLank.classList.add("aktiv");
        let prick = document.querySelector(".aktiv-prick");
        if (!prick) {
            prick = document.createElement("span");
            prick.className = "aktiv-prick";
            prick.setAttribute("aria-hidden", "true");
        }
        if (forstaLank.firstChild !== prick) {
            forstaLank.insertBefore(prick, forstaLank.firstChild);
        }
    }
}

// ✦ Subtil futuristisk scroll-motor (Parallax, Entréer & Precision) ✦
const arMinskadRorelse = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// 1. Mjuka entréer via IntersectionObserver
function initScrollAvsloja() {
    const elementAttAvsloja = document.querySelectorAll(".avsloja, .avsloja-grupp");
    if (!("IntersectionObserver" in window) || arMinskadRorelse) {
        elementAttAvsloja.forEach(el => el.classList.add("synlig"));
        return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("synlig");
                obs.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
    });

    elementAttAvsloja.forEach(el => observer.observe(el));
}

// 2. Kontinuerlig scroll-precision (Parallax, Progress-laser, Scroll-ledtråd)
const sidhuvudElement = document.querySelector(".sidhuvud");
const scrollLaser = document.querySelector("#scroll-laser");
const scrollLedtrad = document.querySelector("#scroll-ledtrad");
const artCyan = document.querySelector(".art-ljus-cyan");
const artOrange = document.querySelector(".art-ljus-orange");
const artKorall = document.querySelector(".art-ljus-korall");
const artBla = document.querySelector(".art-ljus-bla");
const artLila = document.querySelector(".art-ljus-lila");
const artMagenta = document.querySelector(".art-ljus-magenta");
const artGrid = document.querySelector(".art-tech-grid");
const omBild = document.querySelector("#om-bild");
const omSektion = document.querySelector("#om");

let ticking = false;

function onScrollFrame() {
    const scrollY = window.scrollY;
    const maxScroll = (document.documentElement.scrollHeight - window.innerHeight) || 1;
    const scrollFraction = Math.min(Math.max(scrollY / maxScroll, 0), 1);

    // Uppdatera laserspår på headerns underkant
    if (scrollLaser) {
        scrollLaser.style.width = `${scrollFraction * 100}%`;
    }

    // Tona ut scroll-ledtråd i hero vid första scrollen
    if (scrollLedtrad) {
        if (scrollY > 35) {
            scrollLedtrad.classList.add("dold");
        } else {
            scrollLedtrad.classList.remove("dold");
        }
    }

    // Tona headerns frostat glas vid scroll
    if (sidhuvudElement) {
        if (scrollY > 15) {
            sidhuvudElement.classList.add("skrollad");
        } else {
            sidhuvudElement.classList.remove("skrollad");
        }
    }

    // Parallax på bakgrundens ljusfält (endast om användaren inte valt minskad rörelse)
    if (!arMinskadRorelse) {
        if (artCyan) artCyan.style.transform = `translate3d(${scrollY * 0.04}px, ${scrollY * -0.07}px, 0)`;
        if (artOrange) artOrange.style.transform = `translate3d(${scrollY * -0.05}px, ${scrollY * 0.06}px, 0)`;
        if (artKorall) artKorall.style.transform = `translate3d(${scrollY * 0.03}px, ${scrollY * -0.04}px, 0)`;
        if (artBla) artBla.style.transform = `translate3d(0, ${scrollY * -0.03}px, 0) scale(${1 + scrollFraction * 0.1})`;
        if (artLila) artLila.style.transform = `translate3d(${scrollY * -0.03}px, ${scrollY * -0.05}px, 0)`;
        if (artMagenta) artMagenta.style.transform = `translate3d(${scrollY * 0.04}px, ${scrollY * 0.03}px, 0)`;
        if (artGrid) artGrid.style.transform = `translate3d(0, ${scrollY * -0.08}px, 0)`;

        // Subtil kameraglid på profilbilden i "Om mig"
        if (omBild && omSektion) {
            const omRect = omSektion.getBoundingClientRect();
            if (omRect.top < window.innerHeight && omRect.bottom > 0) {
                const diff = (window.innerHeight / 2) - (omRect.top + omRect.height / 2);
                omBild.style.transform = `translate3d(0, ${diff * 0.05}px, 0) scale(1.03)`;
            }
        }
    }

    ticking = false;
}

function requestScrollUpdate() {
    if (!ticking) {
        requestAnimationFrame(onScrollFrame);
        ticking = true;
    }
}

window.addEventListener("scroll", () => {
    requestScrollUpdate();
    uppdateraAktivLank();
}, { passive: true });

window.addEventListener("DOMContentLoaded", () => {
    initScrollAvsloja();
    requestScrollUpdate();
    uppdateraAktivLank();
});

// ✦ Mjuk scroll till kontaktformuläret vid klick på CTA-knappar ✦
document.querySelectorAll('a[href="#kontakt"]').forEach(knapp => {
    knapp.addEventListener("click", (e) => {
        const kontaktSektion = document.querySelector("#kontakt");
        if (kontaktSektion) {
            e.preventDefault();
            kontaktSektion.scrollIntoView({ behavior: "smooth", block: "start" });
            const namnFalt = document.querySelector("#namn");
            if (namnFalt) {
                setTimeout(() => namnFalt.focus({ preventScroll: true }), 500);
            }
        }
    });
});

// ✦ Validering och inskickning av kontaktformuläret via HubSpot Forms API ✦
// HubSpot EU Portal ID: 149565900, Form GUID: 0479e3ce-1fde-4111-9abd-8a85aa624419
const kontaktForm = document.querySelector("#kontakt-form");

if (kontaktForm) {
    const namnInput = document.querySelector("#namn");
    const epostInput = document.querySelector("#epost");
    const foretagInput = document.querySelector("#foretag");
    const meddelandeInput = document.querySelector("#meddelande");
    const skickaKnapp = kontaktForm.querySelector(".knapp-skicka");
    const tackRuta = document.querySelector("#form-tack");

    function valideraEpost(epost) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(epost);
    }

    function visaFel(inputEl, felId, meddelande) {
        const felEl = document.querySelector(`#${felId}`);
        const gruppEl = inputEl.closest(".form-grupp");
        if (felEl) felEl.textContent = meddelande;
        if (gruppEl) gruppEl.classList.add("har-fel");
        inputEl.setAttribute("aria-invalid", "true");
    }

    function rensaFel(inputEl, felId) {
        const felEl = document.querySelector(`#${felId}`);
        const gruppEl = inputEl.closest(".form-grupp");
        if (felEl) felEl.textContent = "";
        if (gruppEl) gruppEl.classList.remove("har-fel");
        inputEl.removeAttribute("aria-invalid");
    }

    [namnInput, epostInput, meddelandeInput].forEach(input => {
        if (!input) return;
        input.addEventListener("input", () => {
            rensaFel(input, `${input.id}-fel`);
        });
    });

    // Helper för att hämta HubSpot tracking cookie (_hubspotutk)
    function hamtaHubSpotCookie() {
        const match = document.cookie.match(/(?:^|;\s*)hubspotutk=([^;]*)/);
        return match ? match[1] : "";
    }

    kontaktForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        let harFel = false;

        if (!namnInput.value.trim()) {
            visaFel(namnInput, "namn-fel", "Vänligen ange ditt namn.");
            harFel = true;
        }

        if (!epostInput.value.trim()) {
            visaFel(epostInput, "epost-fel", "Vänligen ange din e-postadress.");
            harFel = true;
        } else if (!valideraEpost(epostInput.value.trim())) {
            visaFel(epostInput, "epost-fel", "Vänligen ange en giltig e-postadress.");
            harFel = true;
        }

        if (!meddelandeInput.value.trim()) {
            visaFel(meddelandeInput, "meddelande-fel", "Vänligen skriv ett meddelande.");
            harFel = true;
        }

        if (harFel) {
            const forstaFel = kontaktForm.querySelector(".har-fel input, .har-fel textarea");
            if (forstaFel) forstaFel.focus();
            return;
        }

        // Knappen sätts i laddningsläge
        const ursprungligKnappText = skickaKnapp.innerHTML;
        skickaKnapp.disabled = true;
        skickaKnapp.innerHTML = '<span>Skickar...</span>';

        // Bygg payload enligt HubSpot Forms v3 API för EU-portal
        const portalId = "149565900";
        const formGuid = "0479e3ce-1fde-4111-9abd-8a85aa624419";
        const endpoint = `https://api-eu1.hsforms.com/submissions/v3/integration/submit/${portalId}/${formGuid}`;

        const payload = {
            fields: [
                { name: "firstname", value: namnInput.value.trim() },
                { name: "email", value: epostInput.value.trim() },
                { name: "company", value: foretagInput ? foretagInput.value.trim() : "" },
                { name: "message", value: meddelandeInput.value.trim() }
            ],
            context: {
                hutk: hamtaHubSpotCookie(),
                pageUri: window.location.href,
                pageName: document.title
            }
        };

        try {
            const respons = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (respons.ok) {
                // Skicka event till Google Analytics / GTM vid lyckad konvertering
                if (window.dataLayer) {
                    window.dataLayer.push({
                        event: "form_submission",
                        form_name: "kontakt"
                    });
                }

                // Dölj formulärfälten och visa den eleganta bekräftelsen
                kontaktForm.reset();
                skickaKnapp.style.display = "none";
                document.querySelectorAll(".kontakt-formular > .form-rad, .kontakt-formular > .form-atgarder").forEach(el => {
                    el.style.display = "none";
                });
                if (tackRuta) {
                    tackRuta.hidden = false;
                    tackRuta.scrollIntoView({ behavior: "smooth", block: "nearest" });
                }
            } else {
                throw new Error(`HubSpot svarade med status ${respons.status}`);
            }
        } catch (fel) {
            console.error("Fel vid inskickning till HubSpot:", fel);
            alert("Något gick fel när meddelandet skulle skickas. Vänligen prova igen eller kontakta mig direkt via e-post.");
            skickaKnapp.disabled = false;
            skickaKnapp.innerHTML = ursprungligKnappText;
        }
    });
}
