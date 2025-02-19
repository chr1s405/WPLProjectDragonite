"use strict";

const images = Array.from(document.querySelectorAll(".choise-menu img")).map(
  (img) => img.src
);
const gameDivs = document.querySelectorAll(".choise-menu div");

const backgrounds = {
  pokemon: "assets/pokemonBackground.jpeg",
  magic: "assets/magicBackgroundColor.jpeg",
  fifa: "assets/FIFAbackground.jpeg",
  lego: "assets/legoBackground.jpeg",
  fortnite: "assets/fortniteBackground.jpeg",
  lotr: "assets/lordOfTheRingsbackground.jpeg",
};

const gameLogo = document.getElementById("game-logo");
const gameContainer = document.querySelector(".game");

const rightArrow = document.querySelector(".arrow-right");
const leftArrow = document.querySelector(".arrow-left");

let currentIndex = 0;

function updateLogo(index) {
  const newSrc = images[index];

  gameLogo.src = newSrc;

  const allImages = document.querySelectorAll(".choise-menu img");

  if (index < 0 || index >= allImages.length) {
    console.error("Ongeldige index:", index);
    return;
  }

  const selectedGame = allImages[index].alt.toLowerCase().trim();

  console.log("Index:", index);
  console.log("Geselecteerde game:", selectedGame);
  console.log("Achtergrond URL:", backgrounds[selectedGame] || "GEEN");

  if (backgrounds[selectedGame]) {
    document.body.style.backgroundImage = `url(${backgrounds[selectedGame]})`;
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundAttachment = "fixed";
  } else {
    console.warn(`Geen achtergrond gevonden voor: "${selectedGame}"`);
    document.body.style.backgroundImage = "none";
  }

  const correspondingDiv = gameDivs[index];
  if (correspondingDiv) {
    const backgroundColor =
      window.getComputedStyle(correspondingDiv).backgroundColor;
    gameContainer.style.backgroundColor = backgroundColor;
    console.log(`Achtergrondkleur van .game gezet naar: ${backgroundColor}`);
  }
}

rightArrow.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % images.length;
  updateLogo(currentIndex);
});

leftArrow.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  updateLogo(currentIndex);
});

updateLogo(currentIndex);
