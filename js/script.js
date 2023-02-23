const canvas =  document.getElementById('game-canvas');
const ctx = canvas.getContext("2d");
const gameContainer = document.getElementById('game-container');

const flappyImg = new Image();
flappyImg.src = 'Assets/flappy.png';

var flappySound = new Audio('Assets/audio/plim.mp3');
var gameMusic = new Audio('Assets/audio/music.mp3')
var endSound = new Audio('Assets/audio/end.mp3')
var jumpSound = new Audio('Assets/audio/jump.mp3')

const FLAP_SPEED = -5;
const BIRD_WIDTH =  69;
const BIRD_HEIGHT = 19;
const PIPE_WIDTH = 47;
const PIPE_GAP = 120;
const MIN_SCORE_TO_INCREASE_SPEED = 5;



let birdX = 50;
let birdY = 50;
let birdVelocity = 0;
let birdAcceleration = 0.1;

let pipeX = 400;
let pipeY = canvas.height - 200;
let pipeSpeed = 1.5;


let scoreDiv = document.getElementById('score-display');
let score = 0;
let highScore = 0;

let scored = false;

function jump() {
    birdVelocity = FLAP_SPEED;
    jumpSound.play();
  }
  
  document.addEventListener("keydown", function(e) {
    if (e.code == "Space" || e.key == "w" || e.key == "W") {
      jump();
    }
  });
  
  document.addEventListener("touchstart", function(e) {
    jump();
  });
  

document.getElementById('restart-button').addEventListener('click', function(){
    hideEndMenu();
    resetGame();
    loop();
    endSound.pause()
})



function increaseScore() {
    if (birdX > pipeX + PIPE_WIDTH &&
        (birdY < pipeY + PIPE_GAP || 
            birdY + BIRD_HEIGHT >pipeY + PIPE_GAP)&&
            !scored) {
                score++;
                scoreDiv.innerHTML = score;
                scored = true;
                flappySound.play();
                
                if (score >= MIN_SCORE_TO_INCREASE_SPEED) {
                    pipeSpeed *= 1.1; // Multiplicador de velocidade
                }
    }

    if (birdX < pipeX + PIPE_WIDTH) {
        scored = false;
    }
}



function collisionCheck() {
    const birdBox = {
        x: birdX,
        y: birdY,
        width: BIRD_WIDTH,
        height: BIRD_HEIGHT
    }

    const topPipeBox = {
        x: pipeX,
        y: pipeY - PIPE_GAP + BIRD_HEIGHT,
        width: PIPE_WIDTH,
        height: pipeY
    }

    const bottomPipeBox = {
        x: pipeX,
        y: pipeY + PIPE_GAP + BIRD_HEIGHT,
        width: PIPE_WIDTH,
        height: canvas.height + pipeY - PIPE_GAP
    }

    if (birdBox.x + birdBox.width > topPipeBox.x &&
        birdBox.x < topPipeBox.x + topPipeBox.width &&
        birdBox.y < topPipeBox.y) {
            return true;

    }

    if (birdBox.x + birdBox.width > bottomPipeBox.x &&
        birdBox.x < bottomPipeBox.x + bottomPipeBox.width &&
        birdBox.y + birdBox.height > bottomPipeBox.y) {
            return true;
    }

    if(birdY < 0 || birdY + BIRD_HEIGHT > canvas.height){
        return true;
    }

    return false;


}

function hideEndMenu(){
    document.getElementById('end-menu').style.display = 'none';
    gameContainer.classList.remove('backdrop-blur');
}


function showEndMenu(){
    gameMusic.pause();
    document.getElementById('end-menu').style.display = 'block';
    gameContainer.classList.add('backdrop-blur');
    document.getElementById('end-score').innerHTML = score;
    if (highScore < score) {
        highScore = score;
    }
    document.getElementById('best-score').innerHTML = highScore;
}

function resetGame() { 
    birdX = 50;
    birdY = 50;
    birdVelocity = 0;
    birdAcceleration = 0.1;
    pipeX = 400;
    pipeY = canvas.height - 200;
    pipeSpeed = 1.5; // adiciona esta linha para resetar a velocidade do obstáculo

    score = 0;
}


function endGame() {
    showEndMenu();
    endSound.play();
    gameMusic.pause();
}

function loop () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(flappyImg, birdX, birdY);

    ctx.fillStyle = '#333';
    ctx.fillRect(pipeX, -100, PIPE_WIDTH, pipeY);
    ctx.fillRect(pipeX, pipeY + PIPE_GAP, PIPE_WIDTH, canvas.height - pipeY);


    if (collisionCheck()) {
        endGame();
        return;
    }

    pipeX -= pipeSpeed; // Usa a nova variável de velocidade
/*     if (pipeX < -50) {
        pipeX = 400;
        pipeY = Math.random() * (canvas.height - PIPE_GAP) + PIPE_WIDTH;
    } */
    if (pipeX < -PIPE_WIDTH) {
        pipeX = canvas.width;
        // Calcula um valor randômico para a posição do gap, dentro de uma faixa central
        const minGapY = canvas.height * 0.25;
        const maxGapY = canvas.height * 0.75;
        const gapY = Math.random() * (maxGapY - minGapY) + minGapY;
    
        pipeY = gapY - PIPE_GAP / 2;
      }

    birdVelocity += birdAcceleration;
    birdY += birdVelocity;

    increaseScore();
    requestAnimationFrame(loop);
}


loop();
