document.addEventListener("DOMContentLoaded", () => {

  const MASTER_PIN = "2111";

  const DAYS = [
    "2026-01-01T09:00:00",
    "2026-01-15T21:09:00",
    "2026-01-20T21:09:00",
    "2026-01-23T21:09:00",
    "2026-01-24T21:09:00"
  ];

  const CODES = ["12", "2109", "K", "SI", ""];
  const TEXTS = [
    "Acceso restringido.",
    "Los números no están solos.",
    "Lo que se repite, importa.",
    "No todos llegan hasta aquí.",
    "—"
  ];

  const RIDDLES = [
    "",
    "No fue planeado.\nNo fue temprano.\nPasó más de una vez.\n\n—",
    "No tiene significado.\nPero tuvo una discusión.\n\n—",
    "Esto no es para pensar mucho.\n\n—",
    ""
  ];

  /* 🔹 PISTAS (NUEVO) */
  const HINTS = [
    "Todavía no.",
    "No está en esta página.",
    "No escribas todo.",
    "No lo pienses tanto.",
    "—"
  ];

  const timerEl  = document.getElementById("timer");
  const textEl   = document.getElementById("text");
  const riddleEl = document.getElementById("riddle");
  const gateEl   = document.getElementById("gate");
  const loaderEl = document.getElementById("loader");

  const pinGateEl = document.getElementById("pinGate");
  const pinInputs = document.querySelectorAll(".pin-inputs input");
  const pinBtn    = document.getElementById("pinBtn");

  /* 🔹 ELEMENTOS DE PISTA (NUEVO) */
  const hintBtn   = document.getElementById("hintBtn");
  const hintModal = document.getElementById("hintModal");
  const hintText  = document.getElementById("hintText");
  const closeHint = document.getElementById("closeHint");

  let currentDay = parseInt(localStorage.getItem("day") || "0");

  /* =========================
     PIN (SIEMPRE ACTIVO)
  ========================== */

  showPin();

  function showPin(){
    loaderEl.style.display = "none";
    timerEl.style.display = "none";
    gateEl.classList.add("hidden");
    riddleEl.classList.add("hidden");
    if (hintBtn) hintBtn.classList.add("hidden");

    pinGateEl.classList.remove("hidden");
    textEl.innerText = "Tu fecha de cumpleaños.";

    pinInputs.forEach((input, idx) => {
      input.value = "";
      input.addEventListener("input", () => {
        if (input.value && idx < pinInputs.length - 1) {
          pinInputs[idx + 1].focus();
        }
      });
    });

    pinBtn.onclick = checkPin;
  }

  function checkPin(){
    const value = [...pinInputs].map(i => i.value).join("");

    if (value === MASTER_PIN) {
      pinGateEl.classList.add("hidden");
      initGame();
    } else {
      pinGateEl.style.transform = "translateX(-6px)";
      setTimeout(()=>pinGateEl.style.transform="translateX(6px)",60);
      setTimeout(()=>pinGateEl.style.transform="translateX(0)",120);
    }
  }

  /* =========================
     JUEGO NORMAL
  ========================== */

  function initGame(){
    loaderEl.style.display = "block";
    timerEl.style.display = "block";

    textEl.innerText = TEXTS[currentDay];
    const targetTime = new Date(DAYS[currentDay]).getTime();
    // Mostrar botón de pista SIEMPRE en el juego
    if (hintBtn) hintBtn.classList.remove("hidden");

    function updateTimer(){
      const diff = targetTime - Date.now();

      if (diff <= 0) {
        timerEl.innerText = "00:00:00:00";
        loaderEl.style.opacity = "0";
        setTimeout(()=>loaderEl.style.display="none",400);

        textEl.innerText = "Continúa.";
        riddleEl.innerText = RIDDLES[currentDay];
        riddleEl.classList.remove("hidden");
        gateEl.classList.remove("hidden");

        /* 🔹 MOSTRAR BOTÓN DE PISTA */
        if (hintBtn) hintBtn.classList.remove("hidden");

        return;
      }

      const d = Math.floor(diff / 86400000);
      const h = Math.floor(diff / 3600000) % 24;
      const m = Math.floor(diff / 60000) % 60;
      const s = Math.floor(diff / 1000) % 60;

      timerEl.innerText =
        `${String(d).padStart(2,"0")}:`+
        `${String(h).padStart(2,"0")}:`+
        `${String(m).padStart(2,"0")}:`+
        `${String(s).padStart(2,"0")}`;
    }

    setInterval(updateTimer, 1000);
    updateTimer();
  }

  /* =========================
     MODAL DE PISTA (NUEVO)
  ========================== */

  if (hintBtn && hintModal && hintText && closeHint) {

    hintBtn.onclick = () => {
      hintText.innerText = HINTS[currentDay];
      hintModal.classList.remove("hidden");
    };

    closeHint.onclick = () => {
      hintModal.classList.add("hidden");
    };
/* =========================
   EASTER EGG – CTRL + ALT + K
========================= */
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "k") {
    e.preventDefault();

    const action = prompt(
      "Modo oculto:\n" +
      "1 → Ir a fase\n" +
      "2 → Mostrar pista\n\n" +
      "Escribe 1 o 2"
    );

    if (action === "1") {
      const day = prompt("Fase (0 a 4):");
      const d = parseInt(day);

      if (!isNaN(d) && d >= 0 && d <= 4) {
        localStorage.setItem("day", d);
        location.reload();
      } else {
        alert("Fase inválida.");
      }
    }

    if (action === "2") {
      const hintBtn = document.getElementById("hintBtn");
      if (hintBtn) {
        hintBtn.classList.remove("hidden");
        alert("Pista habilitada.");
      }
    }
  }
});

  }

});
