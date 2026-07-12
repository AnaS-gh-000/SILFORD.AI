




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