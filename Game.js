class Game {
    constructor() {
      //botao reiniciar
      this.resetTitle = createElement("h2");
      this.resetButton = createButton("");
      
      this.leaderboardTitle = createElement("h2");
      this.leader1 = createElement("h2");
      this.leader2 = createElement("h2");

      //testar se o carro está em movimento
      this.playerMoving = false;

      this.leftKeyActive = false;

      this.blast = false;
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

      car1.addImage("blast",blastImg);
      car2.addImage("blast",blastImg);

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


    //adiciona os sprites de combustível e moeda de forma aleatória.
    addSprites(spriteGroup,numberOfSprites,spriteImage,spriteScale,positions=[]){
      var x, y;
      
      for(var i=0;i<numberOfSprites;i++){
       

       if(positions.length>0){
        x = positions[i].x;
        y = positions[i].y;
        spriteImage = positions[i].image;
       }else{
        x = random(width/2+150,width/2-150);
       y = random(-height*4.5,height-400);
       }

       var item = createSprite(x,y);
       item.addImage("item",spriteImage);
       item.scale = spriteScale;
       spriteGroup.add(item);
      }
    }
    
    
    handleElements(){
      form.hide();
      form.titleImg.position(40,50);
      form.titleImg.class("gameTitleAfterEffects");
      //botao reiniciar
      this.resetTitle.html("Reiniciar o jogo");
      this.resetTitle.class("resetText");
      this.resetTitle.position(width/2+200,40);
      this.resetButton.class("resetButton");
      this.resetButton.position(width/2+230,100);

      this.leaderboardTitle.html("Placar");
      this.leaderboardTitle.class("resetText");
      this.leaderboardTitle.position(width/3-60,40);
      this.leader1.class("leadersText");
      this.leader1.position(width/3-50,80);
      this.leader2.class("leadersText");
      this.leader2.position(width/3-50,130);
      
    }

    play(){
      //chamar função para esconder os elementos
      this.handleElements();
      this.handleResetButton();
      
      
      Player.getPlayersInfo();
      player.getCarsAtEnd();

      if(allPlayers!==undefined){
        image(track,0,-height*5,width,height*6);
        this.showLeaderboard();
        this.showLife();
        this.showFuelBar();
        
        var index = 0;
        for(var p in allPlayers){
          var x = allPlayers[p].positionX;
          var y = height - allPlayers[p].positionY;
          
          var currentLife = allPlayers[p].life;

          if(currentLife <= 0){
            cars[index].changeImage("blast");
            cars[index].scale = 0.3;
            this.blast = true;
            this.playerMoving = false;
          }

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

            this.handleObstacleCollision(index);

            //inserir uma camera na visão do jogo
            camera.position.x = cars[index].position.x;
            camera.position.y = cars[index].position.y;

          }

          index = index +1;
        }//fim do for
        
        
        //controle dos movimentos do carro: frente, esquerda e direita
        this.handlePlayerControls();
      
        const finishLine = height*6-100;

        if(player.positionY > finishLine){
          this.updateState(2);
          this.getState();
          player.rank +=1;
          Player.updateCarsAtEnd(player.rank);
          player.update();
          this.playerMoving = false;
          this.showRank();
        }

      //chamar função para exibir sprites
      drawSprites();
    }
  }

  handleObstacleCollision(index){
    if(cars[index].collide(obstacles) || cars[index].collide(obstacles2)){
      if(this.leftKeyActive){
        player.positionX += 50;
      }else{
        player.positionX -= 50;
      }
      if(player.life > 0){
        player.life -= 20;
       
      }
      
      if(player.life <= 0){
        player.life = 0;
        //this.updateState(2);
        //this.getState();
        this.gameOver();
      }
      player.update();
    }
  }

  handleFuel(index){
    cars[index].overlap(fuel,function(collector,collected){
      player.fuel +=25;
      collected.remove();
    });

    //faz perder o combustível
    if (player.fuel > 0 && this.playerMoving) {
      player.fuel -= 0.5;
    }
    
    //verifica se o combustível acabou antes de chegar na linha de chegada
    if (player.fuel < 0 ) {
      this.playerMoving = false;
      player.fuel = 0;
      //this.updateState(2);
      //this.getState();
      this.gameOver();
      
   
    }
  }//fim handleFuel

  //remove a moeda do cenario quando o carro toca e ganha dez pontos
  handleCoin(index){
    cars[index].overlap(coin,function(collector,collected){
      player.score+=10;
      player.update();
      collected.remove();
    });
  }

    //botao reiniciar
    handleResetButton(){
      this.resetButton.mousePressed(()=>{
       this.handleResetGame();
        
        //atualizar página
        window.location.reload();
      });
    }
    handleResetGame(){
      database.ref("/").set({
        playerCount:0,
        gameState:0,
        carsAtEnd:0,
        players:{}
      });
    }
    showLeaderboard(){
      var leader1, leader2;

      //Object values é um método que retorna um array com seus valores
      var players = Object.values(allPlayers);
      
      if((players[0].rank==0 && players[1].rank ==0) || players[0].rank == 1){
        leader1 = players[0].rank + "&emsp;" + players[0].name + "&emsp;" + players[0].score;
        leader2 = players[1].rank + "&emsp;" + players[1].name + "&emsp;" + players[1].score;
      }

      

      this.leader1.html(leader1);
      this.leader2.html(leader2);
    }
   

    handlePlayerControls(){
      //se pressionar espaço começa o jogo
      if(keyIsDown(32)){
        this.playerMoving = true;
        carSound.loop();
      }
     
      if(!this.blast){
        //IA faz o carro mover sozinho para frente
        if(this.playerMoving){
          player.positionY += 10;
          player.rank = 0;
          player.update();
        }


        //movimentar para cima
        /*if(keyIsDown(UP_ARROW)){
          this.playerMoving = true;
          player.positionY += 10;
          player.rank = 0;
          player.update();
        }*/
        if(this.playerMoving){
        //movimentar para esquerda
        if(keyIsDown(LEFT_ARROW) && player.positionX > width/3-50){
          this.leftKeyActive = true;
          this.playerMoving = true;
          player.positionX -=10;
          player.rank = 0;
          player.update();
        }

        //movimentar para direita
        if(keyIsDown(RIGHT_ARROW) && player.positionX < width/2+300){
          this.leftKeyActive = false;
          this.playerMoving = true;
          player.positionX +=10;
          player.rank = 0;
          player.update();
        }

    }
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

    end(){
      console.log("Fim de Jogo");
      
    }
   
  }//fim da classe Game
