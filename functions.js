



//FOR APPLYING BACKGROUND IMAGE DYNAMICALLY TO ALL CARDS IN `COMMONLY MISTAKEN FOR` SECTION
document.querySelectorAll(".mistake-thumb-card").forEach(card => {
    card.style.backgroundImage = `
        linear-gradient(to bottom, rgba(5,5,5,0.3), #050505),
        url('${card.dataset.image}')
    `;
});

//FOR APPLYING BACKGROUND IMAGE DYNAMICALLY TO ALL CARDS IN `FEATURES IDENTIFIED BY MODEL` SECTION
document.querySelectorAll(".img-holder").forEach(card => {
    card.style.backgroundImage = `
        url('${card.dataset.image}')
    `;
});



//Adding functionality to `upload buttons`to be able to take file inputs
const uploadButtons = document.querySelectorAll(".upload-btn");
const imageInput = document.getElementById("image-upload");

uploadButtons.forEach(button=>{
    button.addEventListener("click", () =>{
        imageInput.click();
    });
})

imageInput.addEventListener("change", () => {

    const file = imageInput.files[0];

    if(file){
        const formData = new FormData();

        formData.append("image", file);

        fetch("http://127.0.0.1:5000/predict", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {console.log(data);});
    }
});


