// fancybox-init.js
// Este archivo debe ir en src/scripts/fancybox-init.js

import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

// Función para inicializar Fancybox
function initFancybox() {
  // Destruir instancias previas si existen
  try {
    Fancybox.destroy();
  } catch (e) {
    // Error normal si no hay instancias previas
  }

  // Verificar si hay elementos con data-fancybox en la página
  const fancyboxElements = document.querySelectorAll("[data-fancybox]");

  if (fancyboxElements.length > 0) {
    // Inicializar Fancybox con configuración personalizada
    Fancybox.bind("[data-fancybox]", {
      // Configuración general
      contentClick: "toggleCover",
      dragToClose: true,

      // Configuración de imágenes
      Images: {
        Panzoom: {
          panMode: "mousemove",
          mouseMoveFactor: 1.1,
          mouseMoveFriction: 0.12,
        },
      },

      // Configuración de thumbnails
      Thumbs: {
        showOnStart: false,
        autoStart: true,
      },

      // Configuración de la barra de herramientas
      Toolbar: {
        display: {
          left: ["infobar"],
          middle: [
            "zoomIn",
            "zoomOut",
            "toggle1to1",
            "rotateCCW",
            "rotateCW",
            "flipX",
            "flipY",
          ],
          right: ["slideshow", "thumbs", "close"],
        },
      },

      // Configuración de la interfaz
      UI: {
        parentEl: null,
      },

      // Animaciones
      showClass: "fancybox-zoomInUp",
      hideClass: "fancybox-zoomOutDown",

      // Configuración de teclas
      Keyboard: {
        Escape: "close",
        Delete: "close",
        Backspace: "close",
        PageUp: "next",
        PageDown: "prev",
        ArrowRight: "next",
        ArrowLeft: "prev",
        ArrowUp: "prev",
        ArrowDown: "next",
      },

      // Configuración de autoplay para slideshows
      Slideshow: {
        autoStart: false,
        timeout: 3000,
      },
    });

    console.log(
      `Fancybox inicializado correctamente para ${fancyboxElements.length} elementos`,
    );
  } else {
    console.log("No se encontraron elementos con data-fancybox");
  }
}

// Función para manejar la inicialización en diferentes estados del DOM
function handleInit() {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initFancybox);
  } else {
    // DOM ya está listo, inicializar inmediatamente
    setTimeout(initFancybox, 100);
  }
}

// Función para reinicializar después de cambios en el DOM
function reinitFancybox() {
  setTimeout(initFancybox, 150);
}

// Inicializar
handleInit();

// Manejar navegación del lado del cliente (View Transitions de Astro)
document.addEventListener("astro:page-load", reinitFancybox);
document.addEventListener("astro:after-swap", reinitFancybox);

// También reinicializar cuando se agreguen nuevos elementos al DOM
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === "childList") {
      const addedNodes = Array.from(mutation.addedNodes);
      const hasFancyboxElements = addedNodes.some((node) => {
        if (node.nodeType === 1) {
          // Element node
          return node.querySelector && node.querySelector("[data-fancybox]");
        }
        return false;
      });

      if (hasFancyboxElements) {
        reinitFancybox();
      }
    }
  });
});

// Observar cambios en el DOM
observer.observe(document.body, {
  childList: true,
  subtree: true,
});

// Exportar funciones para uso manual si es necesario
export { initFancybox, reinitFancybox };
