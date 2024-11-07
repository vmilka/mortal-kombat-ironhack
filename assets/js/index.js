document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 1024;
    canvas.height = 576;

    const startButton = document.getElementById('startButton');
    const instructionsButton = document.getElementById('instructionsButton');
    const soundButton = document.getElementById('soundButton');
    const cover = document.getElementById('cover');
    const instructions = document.getElementById('instructions');
    const closeInstructionsButton = document.getElementById('closeInstructionsButton'); 
    const redContainer = document.getElementById('redContainer');



    const game = new Game(ctx);
    redContainer.style.display = 'none';


    startButton.addEventListener('click', () => {
        cover.style.display = 'none';
        document.body.classList.remove('cover-active');
        redContainer.style.display = 'flex';
        game.start(); 
    });

    instructionsButton.addEventListener('click', () => {
        instructions.style.display = 'flex';
        redContainer.style.display = 'none';  
        document.body.classList.add('cover-active'); 
    });

    closeInstructionsButton.addEventListener('click', () => {
        instructions.style.display = 'none'; 
        document.body.classList.remove('cover-active');
    });

    let soundOn = true;
    soundButton.addEventListener('click', () => {
        soundOn = !soundOn; 
        soundButton.innerText = soundOn ? "Sonido: ON" : "Sonido: OFF"; 
        game.toggleSound(soundOn);
    });

    document.body.classList.add('cover-active');
});
