class Player {
    constructor() {
     this.name = null;
     this.index = null;
     this.positionX = 0;
     this.positionY = 0;
    }
    
    //pega a posição do jogador no Banco de Dados
    getDistance(){
      var playerDistanceRef = database.ref("players/player"+this.index);
      playerDistanceRef.on("value",data=>{
        var data = data.val();
        this.positionX = data.positionX;
        this.positionY = data.positionY;
      });
    }

    //adicionar os jogadores no Banco de Dados
    addPlayer(){
      var playerIndex = "players/player"+this.index;

      if(this.index == 1){
        this.positionX = width/2 - 100;
      }else{
        this.positionX = width/2 + 100;
      }

      database.ref(playerIndex).set({
        name:this.name,
        positionX:this.positionX,
        positionY:this.positionY
      });
    }
    
    getCount(){
      var playerCountRef = database.ref("playerCount");
      playerCountRef.on("value",(data)=>{
        playerCount = data.val();
      });
    }
    
    updateCount(count){
      database.ref("/").update({
        playerCount:count
      });
    }
    //atualiza as informações do Jogador
    update(){
      var playerIndex = "players/player"+this.index;
      database.ref(playerIndex).update({
        name:this.name,
        positionX:this.positionX,
        positionY:this.positionY
      });
    }

    static getPlayersInfo(){
      var playerInfoRef = database.ref("players");
      playerInfoRef.on("value",data=>{
        allPlayers = data.val();
      });
    }
  }