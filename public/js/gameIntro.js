

intro();

async function intro() {
    const introPage = document.getElementById("gameIntro");
    let optionsDiv = introPage.getElementsByClassName("intro_selection")[0];
    let gameData = {};
    let character = await getIntroSelection2(optionsDiv)
    gameData.portrait = `/assets/characters/${character}Big.png`
    gameData.sprite = `/assets/characters/${character}.png`;
    optionsDiv = introPage.getElementsByClassName("intro_selection")[1];
    gameData.starterPokemon = await getIntroSelection2(optionsDiv);
    optionsDiv.style.display = "none";
    console.log( document.getElementById("tutorialOverlay"))
    document.getElementById("tutorialOverlay").style.display = "flex";
    await new Promise((resolve,rejet)=>{
        document.getElementById("closeTutorial").addEventListener("click",()=>{
        document.getElementById("tutorialOverlay").style.display = "none";
            resolve(true)
    })})

    fetch("", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gameData)
    })
    .then((res) => res.json())
    .then((data)=>{
        if(data.redirect){
            window.location.href = data.redirect;
        }
    })
}
async function getIntroSelection2(optionsDiv) {
    optionsDiv.style.display = "block";
    const options = optionsDiv.getElementsByClassName("intro_selectOption");
    return new Promise((resolve, reject) => {
        for (let i = 0; i < options.length; i++) {
            options[i].addEventListener("click", () => {
                optionsDiv.style.display = "none";
                optionsDiv.replaceWith(optionsDiv.cloneNode(true));
                resolve(options[i].value);
            })
        };
    })
}