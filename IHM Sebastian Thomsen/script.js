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
    document.querySelector("#projekt")
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