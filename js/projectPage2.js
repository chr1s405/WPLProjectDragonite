let activeIndex = 0;
const gameOptions = document.getElementsByClassName("game_options");
const background = document.getElementsByTagName("main")[0];
const mainBtn = document.getElementById("game_mainBtn");
const arrowBtns = document.getElementsByClassName("arrowBtn");
const logos = Array.from(document.getElementsByClassName("game_options")).map(
    (selectionDiv) => selectionDiv.children[0].src
);
const backgroundUrls = [
    "../images/Magic-Background.jpeg",
    "../images/yellow-lego-background.jpeg",
    "../images/lordOfTheRingsbackground.jpeg",
    "../images/fortniteBackground2.jpeg",
    "../images/FIFA-Background.jpg",
    "../images/pokemonBackground.jpeg",
];

arrowBtns[0].addEventListener("click", () => {
    changeActive((activeIndex - 1 + gameOptions.length) % gameOptions.length)
});
arrowBtns[1].addEventListener("click", () => {
    changeActive((activeIndex + 1) % gameOptions.length)
});
for ( let i = 0; i < gameOptions.length; i++){
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
    background.style.backgroundImage = `url(${backgroundUrls[activeIndex]}`;
    mainBtn.style.backgroundImage = `url(${logos[activeIndex]}`;
}