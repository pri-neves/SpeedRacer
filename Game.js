class Game {
    constructor() {
      this.resetTitle = createElement("h2");
      this.resetButton = createButton("");
    }
  
    //ler o estado do jogo no banco de dados
    getState(){
      var gameStateRef = database.ref("gameState");
      gameStateRef.on("value",function(data){
        gameState = data.val();
      });
    }

    //atualizar estado do Jogo no Banco de Dados
    updateState(state){
      database.ref("/").update({
        gameState:state
      });
    }

    //adiciona os sprites de combustível e moeda de forma aleatória.
    addSprites(spriteGroup,numberOfSprites,spriteImage,spriteScale){
      var x, y;
      
      for(var i=0;i<numberOfSprites;i++){
       x = random(width/2+150,width/2-150);
       y = random(-height*4.5,height-400);

       var item = createSprite(x,y);
       item.addImage("item",spriteImage);
       item.scale = spriteScale;
       spriteGroup.add(item);
      }
    }
    
    start(){
      //criar uma instância de Jogador
      player = new Player();

      //iniciar a variavel playerCount
      playerCount = player.getCount();

      form = new Form();
      form.display();

      car1 = createSprite(width/2-50,height-100);
      car1.addImage("car1",car1_img);
      car1.scale = 0.07;

      car2 = createSprite(width/2+100,height-100);
      car2.addImage("car2",car2_img);
      car2.scale = 0.07;

      //adicionar os objetos em um vetor
      cars = [car1,car2];

      //cria um grupo para os combustíveis
      fuel = new Group();
      //cria um grupo para as moedas
      coin = new Group();

      //cria um grupo de cones - obstaculo
      obstacles = new Group();

      //cria um grupo de pneus - obstaculo
      obstacles2 = new Group();

      var obstaclesPositions =[
        {x:width/2-150,y:height-1300,image:obstacleImg},
        {x:width/2+150,y:height-1800,image:obstacleImg},
        {x:width/2-180,y:height-3300,image:obstacleImg},
        {x:width/2-150,y:height-4300,image:obstacleImg},
        {x:width/2,y:height-5300,image:obstacleImg}
      ];

      var obstaclesPositions2 =[
        {x:width/2+250,y:height-800,image:obstacle2Img},
        {x:width/2-180,y:height-2300,image:obstacle2Img},
        {x:width/2,y:height-2800,image:obstacle2Img},
        {x:width/2+180,y:height-3300,image:obstacle2Img},
        {x:width/2+250,y:height-3800,image:obstacle2Img},
        {x:width/2+250,y:height-4800,image:obstacle2Img},
        {x:width/2-180,y:height-5500,image:obstacle2Img}
      ];

      //adiciona os sprites aleatoriamente
      this.addSprites(fuel,4,fuelImage,0.02);
      this.addSprites(coin,6,coinImage,0.09);

      //adiciona os sprites de obstaculos em lugares predeterminados
      this.addSprites(obstacles,obstaclesPositions.length,obstacleImg,0.04,obstaclesPositions);
      this.addSprites(obstacles2,obstaclesPositions2.length,obstacle2Img,0.04,obstaclesPositions2);
    
    }

    handleElements(){
      form.hide();
      form.titleImg.position(40,50);
      form.titleImg.class("gameTitleAfterEffects");
      this.resetTitle.html("Reiniciar o jogo");
      this.resetTitle.class("resetText");
      this.resetTitle.position(width/2+200,40);
      this.resetButton.class("resetButton");
      this.resetButton.position(width/2+230,100);

    }

    handleResetButton(){
      this.resetButton.mousePressed(()=>{
        database.ref("/").set({
          playerCount:0,
          gameState:0,
          players:{}
        });
        //atualizar página
        window.location.reload();
      });
    }
    handleFuel(index){
      cars[index].overlap(fuel,function(collector,collected){
        collected.remove();
      });
    }

    handleCoin(index){
      cars[index].overlap(coin,function(collector,collected){
        collected.remove();
      });
    }

    handlePlayerControls(){
      //movimentar para cima
      if(keyIsDown(UP_ARROW)){
        player.positionY += 10;
        player.update();
      }

      //movimentar para esquerda
      if(keyIsDown(LEFT_ARROW) && player.positionX > width/3-50){
        player.positionX -=10;
        player.update();
      }

      //movimentar para direita
      if(keyIsDown(RIGHT_ARROW) && player.positionX < width/2+300){
        player.positionX +=10;
        player.update();
      }
    }

    play(){
      //chamar função para esconder os elementos
      this.handleElements();
      this.handleResetButton();
      Player.getPlayersInfo();
      if(allPlayers!==undefined){
        image(track,0,-height*5,width,height*6);

        var index = 0;
        for(var p in allPlayers){
          var x = allPlayers[p].positionX;
          var y = height - allPlayers[p].positionY;

          //posicao no vetor que começa com 0
          cars[index].position.x= x;
          cars[index].position.y = y;

          //comparando a posição do jogador no banco de dados (1 ou 2)
         if(index + 1 == player.index){
            stroke(10);
            fill("red");
            ellipse(x,y,60,60);
         
            //remover os itens da tela
            this.handleFuel(index);
            this.handleCoin(index);

            //inserir uma camera na visão do jogo
            camera.position.x = cars[index].position.x;
            camera.position.y = cars[index].position.y;

          }

          index = index +1;
        }//fim do for
     
        //controle dos movimentos do carro: frente, esquerda e direita
        this.handlePlayerControls();

      //chamar função para exibir sprites
      drawSprites();
    }
  }
    
    showRank(){
      swal({
        title:`Incrível!${"\n"}Rank${"\n"}${player.rank}`,
        text: "Você alcançou a linha de chegada com sucesso!",
        imageUrl: "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
        confirmButtonText: "OK"

      });
    }
    //exibir barra de vida
    showLife(){
      push();
      image(lifeImage,width/2-130,height-player.positionY-100,20,20);
      fill("white");
      rect(width/2-100,height-player.positionY-100,100,20);
      fill("#f50057");
      rect(width/2-100,height-player.positionY-100,player.life,20);
      noStroke();
      pop();
    }//fim do showLife
    
    //exibir barra de combustível
    showFuelBar(){
      push();
      image(fuelImage,width/2-130,height-player.positionY-130,20,20);
      fill("white");
      rect(width/2-100,height-player.positionY-130,200,20);
      fill("#ffc400");
      rect(width/2-100,height-player.positionY-130,player.fuel,20);
      noStroke();
      pop();
    }//fim de showFuelBar
    
    
     gameOver(){
      swal({
            title:`Fim de Jogo!`,
            text:"Ops, você perdeu a corrida!!!",
            imageUrl:"https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
            confirmButtonText:"Obrigada por Jogar"
      });
    }
  }
