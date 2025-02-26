"use strict";

// Verzamel alle afbeeldingen uit de choise-menu
const images = Array.from(document.querySelectorAll(".choise-menu img")).map(
  (img) => img.src
);
const gameDivs = document.querySelectorAll(".choise-menu div");

// Achtergrondafbeeldingen voor elke game
const backgrounds = {
  pokemon: "assets/pokemonBackground.jpeg",
  magic: "assets/Magic-Background.jpeg",
  fifa: "assets/FIFA-Background.jpg",
  lego: "assets/yellow-lego-background.jpeg",
  fortnite: "assets/fortniteBackground2.jpeg",
  lotr: "assets/lordOfTheRingsbackground.jpeg",
};

// Selecteer het logo en de pijlen
const gameLogo = document.getElementById("game-logo");
const gameContainer = document.querySelector(".game");
const rightArrow = document.querySelector(".arrow-right");
const leftArrow = document.querySelector(".arrow-left");

// Startindex (begint met het huidige logo)
let currentIndex = 0;

// Functie om de actieve game visueel te markeren
function highlightActiveGame(index) {
  gameDivs.forEach((div) => {
    div.classList.remove("active");
    div.style.transform = "translateY(0) scale(1)";
    div.style.boxShadow = "none";
  });

  gameDivs[index].classList.add("active");
  gameDivs[index].style.transform = "translateY(-15px) scale(1.15)";
  gameDivs[index].style.boxShadow = "0 15px 30px rgba(0, 0, 0, 0.4)";
}

// Functie om het logo en achtergrond te updaten
function updateLogo(index) {
  const newSrc = images[index];
  gameLogo.src = newSrc;

  const allImages = document.querySelectorAll(".choise-menu img");

  if (index < 0 || index >= allImages.length) {
    console.error("Ongeldige index:", index);
    return;
  }

  const selectedGame = allImages[index].alt.toLowerCase().trim();

  if (backgrounds[selectedGame]) {
    document.body.style.backgroundImage = `url(${backgrounds[selectedGame]})`;
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundAttachment = "fixed";
  } else {
    document.body.style.backgroundImage = "none";
  }

  // Update de achtergrondkleur van de game-container
  const correspondingDiv = gameDivs[index];
  if (correspondingDiv) {
    const backgroundColor =
      window.getComputedStyle(correspondingDiv).backgroundColor;
    gameContainer.style.backgroundColor = backgroundColor;
  }

  // Actieve game highlighten
  highlightActiveGame(index);
}

// Event Listeners voor de pijlen
rightArrow.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % images.length;
  updateLogo(currentIndex);
});

leftArrow.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  updateLogo(currentIndex);
});

// Hover- en Click-effecten toevoegen
gameDivs.forEach((div, index) => {
  // Hover-effect
  div.addEventListener("mouseenter", () => {
    if (!div.classList.contains("active")) {
      div.style.transform = "translateY(-10px) scale(1.1)";
      div.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.3)";
    }
  });

  // Reset wanneer de muis weggaat
  div.addEventListener("mouseleave", () => {
    if (!div.classList.contains("active")) {
      div.style.transform = "translateY(0) scale(1)";
      div.style.boxShadow = "none";
    }
  });

  // Click-event om het actief te maken
  div.addEventListener("click", () => {
    currentIndex = index;
    updateLogo(currentIndex);
  });
});

// Initialiseer het eerste spel
updateLogo(currentIndex);
