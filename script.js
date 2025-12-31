document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     CONFIG
  ========================== */

  const MASTER_PIN = "2111";

  const DAYS = [
    "2026-01-01T09:00:00",
    "2026-01-15T21:09:00",
    "2026-01-20T21:09:00",
    "2026-01-23T21:09:00",
    "2026-01-24T21:09:00"
  ];

  const TEXTS = [
    "Lee las instrucciones.\n⬇",
    "Ahora tendrás que pensar muejejeje.",
    "Presta atención.",
    "Analiza el entorno de esta ubicación en Mapas, ahí está la respuesta.",
    "Entra a tu cuarto."
  ];

  const RIDDLES = [
    "Después de responder, revisa la página cuando el contador llegue a 0",
    "Tendrás que derivar una indeterminación por l'Hopital para continuar, en la pista se te explica cómo se hace, tú puedes.",
    "Una de estas respuestas es correcta.\n\n—",
    "-.\n\n—",
    "—"
  ];

  const CODES = [
    "0930",
    "0",
    null, // quiz
    "RISE", // ⬅️ SOLO AQUÍ CAMBIO (fase mapas)
    "Sí"
  ];

  const QUIZ_PHASE = 2;

  const QUIZ = {
    question: "¿En qué carrera estoy?",
    options: [
      "Ciencias de la computación",
      "Ingeniería de sistemas",
      "Gastronomía"
    ],
    correct: 0
  };

  const HINTS = [
    "Espero que te gusten los acertijos, o al menos esto te entretenga.\nCon el paso de los días se irá desbloqueando cada fase, cuando el contador llegue a 0, la siguiente fase estará desbloqueada. Debes estar pendiente y prestar atención para resolver todas las fases, hasta que no lo resuelvas no se desbloqueará el contador.\n\nPISTA \nMira mi perfil de IG.",
    "Este es el límite a resolver: x→0 lim​x2x³/x.​\nEsto se llama una indeterminación, que es cuando el límite de 0 del númerador y denominador de una función da igual a 0. para comprobar que es una indeterminación reemplazas las x de la función por 0.\n Para una explicación de cómo se deriva, pídemela directamente, es sencillo.",
    "Si me escuchas, lo sabes.",
    "PISTA\n1. Mira a donde apunta la flecha.\n2. Elevar.",
    "—"
  ];

  // ⬅️ NUEVO (solo constante)
  const MAP_URL = "https://maps.app.goo.gl/PYeZdt7QVxLKYH6s8";

  /* =========================
     DOM
  ========================== */

  const timerEl  = document.getElementById("timer");
  const textEl   = document.getElementById("text");
  const riddleEl = document.getElementById("riddle");
  const gateEl   = document.getElementById("gate");

  const pinGateEl = document.getElementById("pinGate");
  const pinInputs = document.querySelectorAll(".pin-inputs input");
  const pinBtn    = document.getElementById("pinBtn");

  const hintBtn   = document.getElementById("hintBtn");
  const hintModal = document.getElementById("hintModal");
  const hintText  = document.getElementById("hintText");
  const closeHint = document.getElementById("closeHint");

  let currentDay = parseInt(localStorage.getItem("day") || "0");

  /* =========================
     HELPERS
  ========================== */

  function isAnswered(day){
    return localStorage.getItem("answered_" + day) === "1";
  }

  function markAnswered(day){
    localStorage.setItem("answered_" + day, "1");
  }

  /* =========================
     PIN
  ========================== */

  showPin();

  function showPin(){
    gateEl.classList.add("hidden");
    riddleEl.classList.add("hidden");
    hintBtn.classList.add("hidden");

    pinGateEl.classList.remove("hidden");
    textEl.innerText = "Tu fecha de cumpleaños.";

    pinInputs.forEach((input, idx) => {
      input.value = "";
      input.oninput = () => {
        if (input.value && idx < pinInputs.length - 1) {
          pinInputs[idx + 1].focus();
        }
      };
    });

    pinBtn.onclick = checkPin;
  }

  function checkPin(){
    const value = [...pinInputs].map(i => i.value).join("");
    if (value === MASTER_PIN) {
      pinGateEl.classList.add("hidden");
      initGame();
    } else {
      pinGateEl.classList.add("shake");
      setTimeout(()=>pinGateEl.classList.remove("shake"),300);
    }
  }

  /* =========================
     JUEGO
  ========================== */

  function initGame(){

    textEl.innerText = TEXTS[currentDay];
    hintBtn.classList.remove("hidden");

    const targetTime = new Date(DAYS[currentDay]).getTime();

    function updateTimer(){

      if (!isAnswered(currentDay)) {
        timerEl.innerText = "— — : — — : — — : — —";
        return;
      }

      const diff = targetTime - Date.now();

      if (diff <= 0) {
        timerEl.innerText = "00:00:00:00";

        if (currentDay < DAYS.length - 1) {
          localStorage.setItem("day", currentDay + 1);
          location.reload();
        }
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

    riddleEl.innerText = RIDDLES[currentDay];
    riddleEl.classList.remove("hidden");

    gateEl.classList.add("hidden");

    if (!isAnswered(currentDay)) {
      if (currentDay === QUIZ_PHASE) {
        renderQuiz();
      } else {
        gateEl.classList.remove("hidden");

        // ⬅️ SOLO PARA FASE MAPAS
        if (currentDay === 3) {
          addMapButton();
        }
      }
    }
  }

  /* =========================
     BOTÓN MAPAS (NUEVO)
  ========================== */

  function addMapButton(){
    if (document.getElementById("mapBtn")) return;

    const btn = document.createElement("button");
    btn.id = "mapBtn";
    btn.innerText = "Abrir ubicación";
    btn.style.marginBottom = "14px";

    btn.onclick = () => {
      window.open(MAP_URL, "_blank");
    };

    gateEl.prepend(btn);
  }

  /* =========================
     RESPUESTA NORMAL
  ========================== */

  document.getElementById("btn").onclick = () => {
    const value = document.getElementById("code").value.trim().toUpperCase();

    if (value === CODES[currentDay]) {
      markAnswered(currentDay);
      initGame();
    } else {
      gateEl.classList.add("shake");
      setTimeout(()=>gateEl.classList.remove("shake"),300);
    }
  };

  /* =========================
     QUIZ
  ========================== */

  function renderQuiz(){
    gateEl.classList.add("hidden");

    riddleEl.innerHTML = `
      ${RIDDLES[currentDay]}
      <div id="quiz">
        <p>${QUIZ.question}</p>
        ${QUIZ.options.map((opt,i)=>`
          <button class="quizBtn" data-i="${i}">${opt}</button>
        `).join("")}
      </div>
    `;

    document.querySelectorAll(".quizBtn").forEach(btn=>{
      btn.onclick = () => {
        const idx = parseInt(btn.dataset.i);
        if (idx === QUIZ.correct) {
          markAnswered(currentDay);
          initGame();
        } else {
          btn.style.opacity = ".4";
        }
      };
    });
  }

  /* =========================
     PISTAS
  ========================== */

  hintBtn.onclick = () => {
    hintText.innerText = HINTS[currentDay];
    hintModal.classList.remove("hidden");
  };

  closeHint.onclick = () => {
    hintModal.classList.add("hidden");
  };

  /* =========================
     CTRL + ALT + K
  ========================== */

  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "k") {
      e.preventDefault();
      const d = prompt("Fase (0–4):");
      if (d !== null) {
        localStorage.setItem("day", parseInt(d));
        location.reload();
      }
    }
  });

});
