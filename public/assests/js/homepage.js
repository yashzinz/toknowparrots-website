document.addEventListener("DOMContentLoaded", function () {
  const phrases = [
    "Hello! I'm Keshav!",
    "Want a cracker?",
    "Pretty bird!",
    "Don't touch my feathers!",
    "Keshav is watching you...",
  ];
  const talkBtn = document.getElementById("talk-btn");
  if (talkBtn) {
    talkBtn.addEventListener("click", function () {
      const phrase = phrases[Math.floor(Math.random() * phrases.length)];
      const utterance = new SpeechSynthesisUtterance(phrase);
      utterance.pitch = 1.7;
      utterance.rate = 1.3;

      speechSynthesis.speak(utterance);
    });
  }

  const user = JSON.parse(localStorage.getItem("user"));
  if (user && (user.username || user.email)) {
    document
      .querySelectorAll(".login-btn, .signup-btn")
      .forEach((el) => (el.style.display = "none"));
    const nav = document.querySelector("nav");
    if (nav && !document.querySelector(".nav-username")) {
      const userSpan = document.createElement("span");
      userSpan.className = "nav-username";
      userSpan.textContent = user.username || user.email.split("@")[0];
      userSpan.style.marginLeft = "1em";
      nav.appendChild(userSpan);
    }
    // Show logout button
    const logoutBtn = document.querySelector(".logout-btn");
    if (logoutBtn) logoutBtn.style.display = "inline-block";
  }
  // Logout functionality
  const logoutBtn = document.querySelector(".logout-btn");
  if (logoutBtn) {
    logoutBtn.onclick = function () {
      localStorage.removeItem("user");
      window.location.reload();
    };
  }
});

document.querySelector(".signup-btn").onclick = () =>
  (window.location.href = "signup.html");
document.querySelector(".login-btn").onclick = () =>
  (window.location.href = "login.html");
// Scroll Fade In Animation - Play every time you scroll into view
function isInViewport(el) {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight - 60 && rect.bottom > 40;
}

function revealOnScroll() {
  // Normal fade-in elements (header, hero, section)
  document.querySelectorAll(".fade-in:not(.step-card)").forEach((el) => {
    if (isInViewport(el)) {
      el.classList.add("visible");
    } else {
      el.classList.remove("visible");
    }
  });

  // Step cards: fade out immediately when out of view, fade in with 2s delay when in view
  document.querySelectorAll(".step-card.fade-in").forEach((card, idx) => {
    if (isInViewport(card)) {
      if (
        !card.classList.contains("visible") &&
        !card.classList.contains("pending-fade")
      ) {
        card.classList.add("pending-fade");
        setTimeout(() => {
          if (isInViewport(card)) {
            card.classList.remove("fading");
            card.classList.add("visible");
          }
          card.classList.remove("pending-fade");
        }, 500 + Number(card.dataset.fadeDelay || 0));
      }
    } else {
      card.classList.remove("visible");
      card.classList.add("fading");
      card.classList.remove("pending-fade");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  revealOnScroll();
  window.addEventListener("scroll", revealOnScroll);
});
document.querySelectorAll(".step-card").forEach((card) => {
  card.addEventListener("click", function () {
    const targetId = card.getAttribute("data-target");
    if (targetId) {
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  });
});
document.addEventListener("DOMContentLoaded", function () {
  function revealDailyLifeCards() {
    document.querySelectorAll(".daily-life-card").forEach(function (card) {
      const rect = card.getBoundingClientRect();
      if (rect.top < window.innerHeight / 2 && rect.bottom > 40) {
        card.classList.add("visible");
      } else {
        card.classList.remove("visible");
      }
    });
  }
  revealDailyLifeCards();
  window.addEventListener("scroll", revealDailyLifeCards);
});

document.querySelectorAll(".daily-life-img").forEach((imgDiv) => {
  imgDiv.addEventListener("click", function () {
    const alreadyZoomed = this.classList.contains("zoomed"); // <-- make sure this is here!
    // Remove zoom and video/iframe from all images
    document.querySelectorAll(".daily-life-img.zoomed").forEach((el) => {
      el.classList.remove("zoomed");
      const video = el.querySelector("video");
      const iframe = el.querySelector("iframe");
      const img = el.querySelector("img");
      if (video && img) {
        video.remove();
        img.style.display = "";
      }
      if (iframe && img) {
        iframe.remove();
        img.style.display = "";
      }
    });
    // If not already zoomed, zoom this one and show video/iframe
    if (!alreadyZoomed) {
      this.classList.add("zoomed");
      const videoSrc = this.getAttribute("data-video");
      const img = this.querySelector("img");
      if (videoSrc && img) {
        img.style.display = "none";
        if (videoSrc.includes("player.cloudinary.com")) {
          // Insert iframe for Cloudinary Player
          const iframe = document.createElement("iframe");
          iframe.src = videoSrc;
          iframe.width = "100%";
          iframe.height = "100%";
          iframe.style.border = "none";
          iframe.allow = "autoplay; fullscreen";
          iframe.allowFullscreen = true;
          iframe.style.borderRadius = "inherit";
          this.appendChild(iframe);
        } else {
          // Insert video for direct mp4
          const video = document.createElement("video");
          video.muted = true;
          video.setAttribute("muted", "");
          video.autoplay = true;
          video.loop = true;
          video.playsInline = true;
          video.removeAttribute("controls");
          video.style.width = "100%";
          video.style.height = "100%";
          video.style.borderRadius = "inherit";
          video.src = videoSrc;
          this.appendChild(video);
        }
      }
    }
    // If already zoomed, clicking again will zoom out and restore the image (handled above)
  });
});
