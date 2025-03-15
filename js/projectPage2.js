let activeIndex = 0;
const gameOptions = document.getElementsByClassName("game_options");
const background = document.getElementsByTagName("main")[0];
const mainBtn = document.getElementById("game_mainBtn");
const arrowBtns = document.getElementsByClassName("arrowBtn");
const images = [
    {background: "../images/Magic-Background.jpeg", logo: "../images/magic.jpeg", logoBgColor: "rgba(0, 0, 0, 0.5)"},
    {background: "../images/yellow-lego-background.jpeg", logo: "../images/legoMasters.jpeg", logoBgColor: "rgba(0, 0, 0, 0.5)"},
    {background: "../images/lordOfTheRingsbackground.jpeg", logo: "../images/lordOfTheRings.jpeg", logoBgColor: "rgba(0, 0, 0, 0.5)"},
    {background: "../images/fortniteBackground2.jpeg", logo: "../images/fortnite.jpeg", logoBgColor: "rgba(0, 0, 0, 0.5)"},
    {background: "../images/FIFA-Background.jpg", logo: "../images/fifa.jpeg", logoBgColor: "rgba(0, 0, 0, 0.5)"},
    {background: "../images/pokemonBackground.jpeg", logo: "../images/pokempon-logo.jpeg", logoBgColor: "rgba(0, 0, 0, 0.5)"},
];

arrowBtns[0].addEventListener("click", () => {
    changeActive((activeIndex - 1 + gameOptions.length) % gameOptions.length)
});
arrowBtns[1].addEventListener("click", () => {
    changeActive((activeIndex + 1) % gameOptions.length)
});
for ( let i = 0; i < gameOptions.length; i++){
    gameOptions[i].style.backgroundColor = images[i].logoBgColor;
    gameOptions[i].addEventListener("click", ()=>{
        changeActive(i);
    })
}
mainBtn.addEventListener("click", () => {
    if (activeIndex === 5) {
        mainBtn.href = "../login.html";
        console.log(mainBtn.href)
    }
    else {
        alert("dit project is nog onder constructie. kies iets anders ( pokemon :) )")
    }
})

function changeActive(index) {
    gameOptions[activeIndex].classList.remove("active");
    gameOptions[index].classList.add("active");
    activeIndex = index;
    background.style.backgroundImage = `url(${images[activeIndex].background}`;
    mainBtn.style.backgroundImage = `url(${images[activeIndex].logo}`;
    mainBtn.style.backgroundColor = `${images[activeIndex].logoBgColor}`;
}