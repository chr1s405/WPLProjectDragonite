
intro();

async function intro() {
    const introPage = document.getElementById("gameIntro");
    let optionsDiv;
    optionsDiv = introPage.getElementsByClassName("intro_selection")[0];
    let gameData = {};
    const starterCharacters = [
        { name: "Red", img: "/assets/characters/RedBig.webp", smallImg: "/assets/characters/Red.png", },
        { name: "Leaf", img: "/assets/characters/LeafBig.png", smallImg: "/assets/characters/leaf.png", },
        { name: "Lucas", img: "/assets/characters/LucasBig.webp", smallImg: "/assets/characters/lucas.webp", },
        { name: "Dawn", img: "/assets/characters/DawnBig.webp", smallImg: "/assets/characters/dawn.png", },
        { name: "Calem", img: "/assets/characters/CalemBig.webp", smallImg: "/assets/characters/calem.png", },
        { name: "Serena", img: "/assets/characters/SerenaBig.png", smallImg: "/assets/characters/serena.png", },
    ]
    createIntroOptions(optionsDiv, starterCharacters);
    const characterIndex = await getIntroSelection(optionsDiv)
    gameData.sprite = starterCharacters[characterIndex].smallImg;
    gameData.portrait = starterCharacters[characterIndex].img;
    
    optionsDiv = introPage.getElementsByClassName("intro_selection")[1];
    optionsDiv.style.display = "block";
    const starterPokemon = [
        { name: "caterpie", img: "", },
        { name: "squirtle", img: "", },
        { name: "charmander", img: "", },
    ]
    createIntroOptions(optionsDiv, starterPokemon)
    gameData.starterPokemon = starterPokemon[await getIntroSelection(optionsDiv)].name;
    optionsDiv.style.display = "none";
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

function createIntroOptions(optionsDiv, optionsList = undefined) {
    const options = optionsDiv.getElementsByClassName("intro_selectOptions")[0];
    optionsList.forEach((option) => {
        const div = document.createElement("div");
        div.classList.add("intro_selectOption")
        const img = document.createElement("img");
        img.src = option.img;
        const p = document.createElement("p");
        p.innerHTML = option.name;

        div.appendChild(img);
        div.appendChild(p);
        options.appendChild(div);
    });
}

async function getIntroSelection(optionsDiv) {
    optionsDiv.style.display = "block";
    const options = optionsDiv.getElementsByClassName("intro_selectOption");
    return new Promise((resolve, reject) => {
        for (let i = 0; i < options.length; i++) {
            options[i].addEventListener("click", () => {
                resolve(i);
                optionsDiv.style.display = "none";
                optionsDiv.replaceWith(optionsDiv.cloneNode(true));
            })
        };
    })
}