class Form {
    constructor() {
      this.input = createInput("").attribute("placeholder","Digite seu nome");
      this.playButton = createButton("Play");
      this.titleImg = createImg("./assets/title.png","Título do Jogo");
      this.greeting = createElement("h2");
    }

    setElementPosition(){
      this.input.position(width/2-110,height/2-80);
      this.playButton.position(width/2-90,height/2-20);
      this.titleImg.position(120,100);
      this.greeting.position(width/2-300,height/2-100);
    }

    setElementStyle(){
      this.titleImg.class("gameTitle");
      this.input.class("customInput");
      this.playButton.class("customButton");
      this.greeting.class("greeting");
    }

    hide(){
      this.input.hide();
      this.playButton.hide();
      this.greeting.hide();
    }
    handleMousePressed(){
      //usamos uma Arrow function ()=> é a mesma coisa que chamar uma function
      this.playButton.mousePressed(()=>{
        this.input.hide();
        this.playButton.hide();
        
        var message = `
        Olá ${this.input.value()}
        </br> Espere outro jogador entrar...
        `;
        this.greeting.html(message);

        playerCount+=1;
        player.name = this.input.value();
        player.index = playerCount;

        player.addPlayer();

        player.updateCount(playerCount);

        player.getDistance();

      });
    }

    display(){
      this.setElementPosition();
      this.setElementStyle();
      this.handleMousePressed();
    }
  
  }