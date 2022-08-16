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

      //adiciona os sprites aleatoriamente
      this.addSprites(fuel,4,fuelImage,0.02);
      this.addSprites(coin,6,coinImage,0.09);
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
  }