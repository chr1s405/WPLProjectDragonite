const phoneLayout = window.matchMedia("(max-width: 450px)");
let activeIndex = 0;
const gameOptions = document.getElementsByClassName("game_option");
const background = document.getElementsByTagName("main")[0];
const mainBtn = document.getElementById("game_mainBtn");
const arrowBtns = document.getElementsByClassName("arrowBtn");
const images = [
    { background: "/assets/backgrounds/mtg_background.jpeg", logo: "/assets/logos/mtg_logo.jpeg", logoBgColor: "rgba(100, 100, 100, 0.8)" },
    { background: "/assets/backgrounds/lego_background.jpeg", logo: "/assets/logos/lego_logo.jpeg", logoBgColor: "rgba(100, 100, 100, 0.8)" },
    { background: "/assets/backgrounds/lotr_background.jpeg", logo: "/assets/logos/lotr_logo.jpeg", logoBgColor: "rgba(100, 100, 100, 0.8)" },
    { background: "/assets/backgrounds/fortnite_background.jpeg", logo: "/assets/logos/fortnite_logo.jpeg", logoBgColor: "rgba(100, 100, 100, 0.8)" },
    { background: "/assets/backgrounds/fifa_background.jpg", logo: "/assets/logos/fifa_logo.jpeg", logoBgColor: "rgba(100, 100, 100, 0.8)" },
    { background: "/assets/backgrounds/pokemon_background.jpeg", logo: "/assets/logos/pokemon_logo.jpeg", logoBgColor: "rgba(100, 100, 100, 0.8)" },
];

arrowBtns[0].addEventListener("click", () => {
    changeActive((activeIndex - 1 + gameOptions.length) % gameOptions.length)
});
arrowBtns[1].addEventListener("click", () => {
    changeActive((activeIndex + 1) % gameOptions.length)
});
mainBtn.style.backgroundColor = images[activeIndex].logoBgColor;
mainBtn.getElementsByTagName("img")[0].src = images[activeIndex].logo;
for (let i = 0; i < gameOptions.length; i++) {
    gameOptions[i].style.backgroundColor = images[i].logoBgColor;
    gameOptions[i].getElementsByTagName("img")[0].src = images[i].logo;
    gameOptions[i].addEventListener("click", () => {
        changeActive(i);
    })
}
mainBtn.addEventListener("click", () => {
    if (activeIndex === 5) {
        mainBtn.href = "/login";
    }
    else {
        alert("dit project is nog onder constructie. kies iets anders ( pokemon :) )")
    }
})
// phoneLayout.addEventListener("change", function () {
//     isPhoneLayout = phoneLayout.matches;
// });
function changeActive(index) {
    gameOptions[activeIndex].classList.remove("active");
    gameOptions[index].classList.add("active");
    activeIndex = index;
    background.style.backgroundImage = `url(${images[activeIndex].background}`;
    mainBtn.getElementsByTagName("img")[0].src = images[activeIndex].logo;
    mainBtn.style.backgroundColor = `${images[activeIndex].logoBgColor}`;
}