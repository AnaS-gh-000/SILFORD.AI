
// ================================================
// API CONFIGURATION
// ================================================

const LOCAL_SERVER_URL = "http://127.0.0.1:5000";

const LIVE_SERVER_URL = "https://your-production-backend-url.com";

// Change this when deploying
const USE_LIVE_SERVER = false;

const API_URL = USE_LIVE_SERVER
    ? LIVE_SERVER_URL
    : LOCAL_SERVER_URL;

// ================================================
// FUNCTIONS TO OPEN ONE VIEW WHILE CLOSING OTHERS
// ================================================


function showLanding() {
    document.getElementById("landing-view").style.display = "block";
    document.getElementById("prediction-view").style.display = "none";
    document.querySelector(".not-a-plant").style.display = "none";

    window.scrollTo(0, 0);
}

function showPredictionView() {
    document.getElementById("landing-view").style.display = "none";
    document.getElementById("prediction-view").style.display = "block";
    document.querySelector(".not-a-plant").style.display = "none";

    window.scrollTo(0, 0);
}

function showUnknownView() {
    document.getElementById("landing-view").style.display = "none";
    document.getElementById("prediction-view").style.display = "none";
    document.querySelector(".not-a-plant").style.display = "flex";

    window.scrollTo(0, 0);
}



// ================================================
// LOAD JSON PLANT INFO FILE & SHOW START PAGE
// ================================================

let plantDatabase = null;


async function loadPlantDatabase(){

    try{

        const response = await fetch("backend/plants.json");

        if(!response.ok){
            throw new Error("Database file missing");
        }

        plantDatabase = await response.json();

    }
    catch(error){

        console.error(
            "Plant database loading failed:",
            error
        );

    }

}


window.addEventListener("DOMContentLoaded", async ()=>{

    await loadPlantDatabase();

    showLanding();

});


// ================================================
// APPLY BACKGROUND IMAGES DYNAMICALLY
// ================================================

// Commonly mistaken for section
document.querySelectorAll(".mistake-thumb-card").forEach(card => {

    card.style.backgroundImage = `
        linear-gradient(to bottom, rgba(5,5,5,0.2), #050505),
        url('${card.dataset.image}')
    `;

});


// Feature analysis images
document.querySelectorAll(".img-holder").forEach(card => {

    card.style.backgroundImage = `
        url('${card.dataset.image}')
    `;

});

// ================================================
// MISTAKEN PLANTS HORIZONTAL SCROLL FUNCTIONALITY
// ================================================

const track = document.querySelector(".mistake-track");
const leftBtn = document.querySelector(".left-arrow");
const rightBtn = document.querySelector(".right-arrow");

let currentPosition = 0;
const scrollAmount = 300;


// Returns the maximum distance the track can scroll
function getMaxScroll(){
    if(!track){
        return 0;
    }

    return track.scrollWidth - track.parentElement.clientWidth;
}


// Enables/disables arrows
function updateButtons(){

    const maxScroll = getMaxScroll();

    leftBtn.disabled = currentPosition <= 0;

    rightBtn.disabled =
        maxScroll <= 0 || currentPosition >= maxScroll;

}



// Right arrow
if (rightBtn){
    rightBtn.addEventListener("click", ()=>{

        const maxScroll = getMaxScroll();

        currentPosition += scrollAmount;

        if(currentPosition > maxScroll){
            currentPosition = maxScroll;
        }

        track.style.transform =
            `translateX(-${currentPosition}px)`;

        updateButtons();

    });
}

// Left arrow
if (leftBtn){
    leftBtn.addEventListener("click", ()=>{

        currentPosition -= scrollAmount;

        if(currentPosition < 0){
            currentPosition = 0;
        }

        track.style.transform =
            `translateX(-${currentPosition}px)`;

        updateButtons();

    });
}


// Initial button state
if(track && leftBtn && rightBtn){
    updateButtons();
}


// ================================================
// IMAGE UPLOAD FUNCTIONALITY
// ================================================

const uploadButtons = document.querySelectorAll(".upload-btn");
const imageInput = document.getElementById("image-upload");


uploadButtons.forEach(button => {

    button.addEventListener("click", (e) => {

        e.preventDefault();

        imageInput.click();

    });

});


imageInput.addEventListener("change", () => {

    const file = imageInput.files[0];

    if(file){

        const formData = new FormData();
        formData.append("image", file);


        fetch(`${API_URL}/predict`, {

            method: "POST",
            body: formData

        })

        .then(response => {

            if(!response.ok){
                throw new Error(
                    "Server error: " + response.status
                );
            }

            return response.json();

        })


        .then(data => {

            showPrediction(data);

        })


        .catch(error => {

            console.error(
                "Prediction failed:",
                error
            );

        });

    }

});

// ================================================
// UPDATE STATIC HTML WITH JSON STORED DATA
// ================================================

function updatePredictionPage(data){

    //basic info
    document.querySelector(".plant-name-title").textContent=
        data.common_name.toUpperCase();

    document.querySelector("#plant-scientific").textContent=
        data.scientific_name;
    
    document.querySelector("#plant-family").textContent =
        data.family_name;

    //toxicity information
    document.querySelector(".toxicity-level-text").textContent =
        data.toxicity.level;

    document.querySelector(".toxicity-subtext").textContent =
        data.toxicity.severity;
    
    document.querySelector(".summary-disclaimer-text").textContent=
        data.toxicity.summary_warning;

        //hero-image change
    const heroImage = document.querySelector(".predict-bg-hero");

    heroImage.style.backgroundImage =
    `
        linear-gradient(
        rgba(0,0,0,0.3),
        rgba(0,0,0,0.8)
        ),
        url('img-assets/${data.hero_image}')
    `;

    //apply toxicity theme color
    const predictionView = document.getElementById("prediction-view");

    // remove previous theme
    predictionView.classList.remove(
        "tox-high",
        "tox-mid",
        "tox-low"
    );

    // decide new theme
    const toxicity = data.toxicity.level.toLowerCase();


    if(
        toxicity.includes("high") ||
        toxicity.includes("severe") ||
        toxicity.includes("fatal") ||
        toxicity.includes("extremely") ||
        toxicity.includes("highly")
    ){

        predictionView.classList.add("tox-high");

    }
    else if(
    toxicity.includes("medium") ||
    toxicity.includes("moderate") ||
    toxicity.includes("mildly") ||
    toxicity.includes("mild")
    ){

        predictionView.classList.add("tox-mid");

    }

    else{

        predictionView.classList.add("tox-low");

    }


    //systems affected
    const systems = document.querySelector(".affected-systems-list");

    systems.innerHTML = "";

    data.toxicity.systems_affected.forEach(system => {
        systems.innerHTML += `<li>${system}</li>`;
    });


    //key constituents
    const constituents = document.querySelector(".constituents-list");

    constituents.innerHTML = "";

    data.key_constituents.forEach(item =>{
        constituents.innerHTML += `<li>${item}</li>`;
    });

    //effects on body
    const effectsBox = document.querySelector(".effects-box");

    effectsBox.innerHTML = "";

    Object.entries(data.effects).forEach(([category, effects])=>{

        effectsBox.innerHTML += `
            <h4 class="effect-heading">
                ${category} Effects
            </h4>

            <ul class="effects-list">
                ${effects.map(effect =>`
                    <li>
                        <strong>${effect.name}</strong>
                        ${effect.description}
                    </li>
                `).join("")}
            </ul>
        `;
    });


    //toxic parts
    const toxicParts = document.querySelector(".toxic-parts-wrapper");

    toxicParts.innerHTML = `
        <h2>Toxic Parts:</h2>
    `;

    data.toxic_parts.forEach(part=>{
        toxicParts.innerHTML += `
            <div class="part-entry">
                <h3 class="part-title">
                    ${part.part}
                </h3>
                <p>
                    ${part.description}
                </p>
            </div>
        `;
    });

    toxicParts.innerHTML += `
        <div class="danger-banner-note">

            All parts of the 
            <em>${data.common_name} (${data.scientific_name})</em>
            plant are 
            <span class="danger-text-highlight">
                toxic
            </span>
            and should be handled carefully.

        </div>
    `;

    //handling safety
    const safety = document.querySelector(".safety-steps-list");

    safety.innerHTML = "";

    data.handling_safety.forEach(step=>{
        safety.innerHTML += `
            <li>
                ${step}
            </li>
        `;
    });

    //commonly mistaken plants
    const mistakeTrack = document.querySelector(".mistake-track");

    mistakeTrack.innerHTML = "";

    data.commonly_mistaken_for.forEach(plant=>{


        mistakeTrack.innerHTML += `
            <div class="mistake-thumb-card" data-image="img-assets/${plant.image}">

                <span class="badge ${
                    plant.toxicity.toLowerCase().includes("high") 
                    ? "badge-high" 
                    : plant.toxicity.toLowerCase().includes("mild")
                    ? "badge-mid"
                    : "badge-low"
                }">

                    ${plant.toxicity}
                </span>

                <div class="mistake-texts">
                    <h3>
                        ${plant.name}
                    </h3>

                    <p>
                        ${plant.description}
                    </p>
                </div>
            </div>
        `;
    });
        // Reapply images after creating cards
    document.querySelectorAll(".mistake-thumb-card")
    .forEach(card=>{
        card.style.backgroundImage = `
            linear-gradient(
                to bottom,
                rgba(5,5,5,0.2),
                #050505
            ),
            url('${card.dataset.image}')
        `;
    });

    setTimeout(() => {
        currentPosition = 0;
        mistakeTrack.style.transform = "translateX(0px)";
        updateButtons();
    }, 100);


    //Medicinal uses
    const medicinal = document.querySelector(".uses-columns");

    medicinal.innerHTML = "";

    data.medicinal_uses.forEach(use=>{
        medicinal.innerHTML += `
            <div class="use-block">
                <h3>
                    ${use.condition}
                </h3>

                <p>
                    ${use.description}
                </p>
            </div>
        `;
    });

    //Features detected
    const featureGrid = document.querySelector(".features-text-grid");

    featureGrid.innerHTML = "";

    Object.entries(data.features_detected)
    .forEach(([key,value])=>{
        featureGrid.innerHTML += `
            <div class="feature-box">
                <h4 class="feature-accent-heading">
                    ${key.replaceAll("_"," ")}
                </h4>

                <p>
                    ${value}
                </p>
            </div>
        `;
    });

    //Features detected
    const imageRow = document.querySelector(".feature-images-row");

    imageRow.innerHTML = "";

    data.feature_images.forEach(image=>{

        imageRow.innerHTML += `
            <div class="img-square-card">

                <div 
                class="img-holder"
                data-image="img-assets/${image.image}">
                </div>

                <p>
                    ${image.caption}
                </p>

            </div>
        `;
    });

    document.querySelectorAll(".img-holder")
    .forEach(img=>{

        img.style.backgroundImage =
        `url('${img.dataset.image}')`;

    });

    //Emergency section
    const emergencyCols = document.querySelectorAll(".emergency-col");

    emergencyCols[0].querySelector("ul").innerHTML =
        data.emergency.ingestion
        .map(item=>`<li>${item}</li>`)
        .join("");

    emergencyCols[1].querySelector("ul").innerHTML =
        data.emergency.contact
        .map(item=>`<li>${item}</li>`)
        .join("");

    emergencyCols[2].querySelector("ul").innerHTML =
        data.emergency.pets
        .map(item=>`<li>${item}</li>`)
        .join("");

}



// ================================================
// UPDATE WEBSITE WITH MODEL RESULT
// ================================================

function showPrediction(data){

    if(!plantDatabase){
        alert("Plant database could not load.");
        return;
    }

    if(data.plant === "unknown"){
        showUnknownView();
        return;
    }

    const plantData = plantDatabase[data.plant];



    if(!plantData){
        console.error("Plant not found in database");
        showUnknownView()
        return;
    }


    updatePredictionPage(plantData);
    
    showPredictionView();

}

//BACK HOME BUTTON
const backHome = document.getElementById("back-home");

if (backHome){
    backHome.addEventListener("click", ()=>{
        showLanding();
    });
}



//CAMERA FEATURE LATER ADDITION
const cameraButtons = document.querySelectorAll(".btn-light-green");

cameraButtons.forEach(button => {
    button.addEventListener("click", () => {
        alert("Camera feature coming soon!");
    });
});