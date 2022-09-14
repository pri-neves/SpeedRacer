/*
1. O jogo começa quando tivermos 2 jogadores
2. Estados do Jogo:
  0 --> Espera (Exibe o formulário);
  1 --> Jogar;
  2 --> Fim (Exibe tabela de classificação);
*/


var database;
var canvas;
var backgroundImage,car1_img,car2_img,track;
var bgImg, car1, car2;
var form, player;
var playerCount,gameState;
var cars = [];
var allPlayers;
var fuelImage, coinImage, fuel, coin;
var lifeImage;
var obstacleImg, obstacle2Img, obstacles, obstacles2;
var blastImg;
var carSound;

function preload() {
  backgroundImage = loadImage("assets/background.png");
  car1_img = loadImage("assets/car1.png");
  car2_img = loadImage("assets/car2.png");
  track = loadImage("assets/track.jpg");
  fuelImage = loadImage("assets/fuel.png");
  coinImage = loadImage("assets/goldCoin.png");
  lifeImage = loadImage("assets/life.png");
  obstacleImg = loadImage("assets/obstacle1.png");
  obstacle2Img = loadImage("assets/obstacle2.png");
  blastImg = loadImage("assets/blast.png");
  carSound = loadSound("assets/CarSounds.mp3");
}

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    database = firebase.database();
    //console.log(database);
    game = new Game();
    game.getState();
    game.start();
}

function draw() {
    background(backgroundImage);

    //verifica o número de jogadores
    if(gameState == 0 && playerCount == 2){
      game.updateState(1);
      game.getState();
    }

    //verifica o estado do Jogo
    if(gameState == 1){
      game.play();
    }

    //verifica o estado do Jogo
    if(gameState == 2){
      carSound.stop();
      game.end();
      
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
  }

function showError() {
    console.log("Dados não recebidos do banco de dados");
}
