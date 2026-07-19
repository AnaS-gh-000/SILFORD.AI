window.onbeforeunload = function(e) {
    console.trace("WHO CAUSED RELOAD?");
};


// ================================================
// APPLY BACKGROUND IMAGES DYNAMICALLY
// ================================================

// Commonly mistaken for section
document.querySelectorAll(".mistake-thumb-card").forEach(card => {

    card.style.backgroundImage = `
        linear-gradient(to bottom, rgba(5,5,5,0.3), #050505),
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
// IMAGE UPLOAD FUNCTIONALITY
// ================================================

const uploadButtons = document.querySelectorAll(".upload-btn");
const imageInput = document.getElementById("image-upload");



uploadButtons.forEach(button => {

    button.addEventListener("click", (e) => {

        console.log("BUTTON ELEMENT:", e.target);

        e.preventDefault();
        e.stopImmediatePropagation();

        console.log("Upload button clicked");

        imageInput.click();

    });

});




imageInput.addEventListener("change", () => {

    const file = imageInput.files[0];

    if(file){

        console.log("Selected file:", file.name);


        const formData = new FormData();

        formData.append("image", file);



        fetch("http://127.0.0.1:5000/predict", {

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

            console.log("Prediction:", data);

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
// UPDATE WEBSITE WITH MODEL RESULT
// ================================================

function showPrediction(data){


    const plantName = data.plant;

    const confidence = data.confidence;



    console.log(
        "Plant:",
        plantName,
        "Confidence:",
        confidence
    );



    // Update plant title
    const title =
        document.querySelector(".plant-name-title");


    if(title){

        title.textContent =
            plantName.replaceAll("_", " ").toUpperCase();

    }



    // Example:
    // later this will trigger:
    // loadPlantInfo(plantName)

}
