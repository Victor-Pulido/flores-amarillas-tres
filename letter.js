// letter.js - Lógica de interacción para la Carta Romántica

document.addEventListener("DOMContentLoaded", () => {
  const letterBtn = document.getElementById("letter-btn");
  const letterOverlay = document.getElementById("letter-overlay");
  const envelopeWrapper = document.getElementById("envelope-wrapper");
  const closeLetterBtn = document.getElementById("close-letter-btn");
  const letterPaper = document.getElementById("letter-paper");
  const waxSeal = document.querySelector(".wax-seal");
  const currentDateEl = document.getElementById("current-date");

  // Mostrar la fecha de hoy de forma dinámica
  if (currentDateEl) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    currentDateEl.textContent = today.toLocaleDateString('es-ES', options);
  }

  // Estado para evitar clics múltiples durante las animaciones
  let isAnimating = false;

  // 1. Abrir el sobre y extraer la carta al hacer clic en el botón flotante
  letterBtn.addEventListener("click", () => {
    if (isAnimating) return;
    letterOverlay.classList.add("active");
    if (letterBtn.parentElement) {
      letterBtn.parentElement.classList.add("hidden");
    }
  });

  // 2. Abrir el sobre y extraer la carta al hacer clic en él
  envelopeWrapper.addEventListener("click", (e) => {
    e.stopPropagation();
    // Si ya está abierto o si estamos en transición, no hacer nada
    if (envelopeWrapper.classList.contains("open") || isAnimating) return;
    
    isAnimating = true;

    // ║ PASO 1: Sacudida del sobre (300ms) — "rumble" físico rápido y satisfactorio
    envelopeWrapper.classList.add("shaking");

    // ║ PASO 2: Al terminar la sacudida, romper el sello (sincronizado)
    setTimeout(() => {
      envelopeWrapper.classList.remove("shaking");

      // Animación del sello rompiéndose
      if (waxSeal) {
        waxSeal.classList.add("breaking");
        // Cuando termine la animación del sello, aplicar el estado final
        waxSeal.addEventListener("animationend", () => {
          waxSeal.classList.remove("breaking");
          waxSeal.style.opacity = "0";
          waxSeal.style.pointerEvents = "none";
          waxSeal.style.transform = "translate(-50%, -120%) scale(0.55)";
        }, { once: true });
      }

      // Abrir la solapa del sobre
      envelopeWrapper.classList.add("open");
    }, 300); // esperar la sacudida

    // ║ PASO 3: Transición a modo lectura (solapa + carta subiendo)
    setTimeout(() => {
      letterOverlay.classList.add("reading");
      letterPaper.classList.add("is-reading");
      isAnimating = false;
    }, 600); // 300ms sacudida + 300ms apertura solapa
  });

  // Evitar que el clic en el papel de la carta cierre el sobre al estar leyendo
  letterPaper.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  // 3. Función para cerrar la carta y devolverla al sobre
  const closeLetter = () => {
    if (isAnimating) return;
    isAnimating = true;

    // Desvanecer el overlay inmediatamente
    letterOverlay.classList.remove("active");
    if (letterBtn.parentElement) {
      letterBtn.parentElement.classList.remove("hidden");
    }

    // Esperar a que termine de desvanecerse el overlay (350ms) y resetear el estado interno
    setTimeout(() => {
      letterOverlay.classList.remove("reading");
      letterPaper.classList.remove("is-reading");
      envelopeWrapper.classList.remove("open");

      // Restaurar el sello de lacre
      if (waxSeal) {
        waxSeal.style.opacity = "";
        waxSeal.style.pointerEvents = "";
        waxSeal.style.transform = "";
      }
      
      isAnimating = false;
    }, 350);
  };

  // Cerrar al hacer clic en el botón de cerrar de la carta
  closeLetterBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    closeLetter();
  });

  // Cerrar al hacer clic en el fondo oscuro difuminado (overlay)
  letterOverlay.addEventListener("click", (e) => {
    // Solo cerrar si el clic fue directamente en el fondo del overlay
    if (e.target !== letterOverlay) return;

    // Solo cerrar si el sobre ya está abierto y se hace clic en el fondo
    if (letterOverlay.classList.contains("reading")) {
      closeLetter();
    } else if (!envelopeWrapper.classList.contains("open")) {
      // Si el sobre no se ha abierto, un clic en el fondo simplemente cierra el overlay
      letterOverlay.classList.remove("active");
      if (letterBtn.parentElement) {
        letterBtn.parentElement.classList.remove("hidden");
      }
    }
  });
});
