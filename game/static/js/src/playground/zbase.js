class AcGamePlayground{
    constructor(root){
        this.root = root;
        this.$playground = $(`<div class="ac-game-playground">playground</div>`);
        //this.hide();
        this.root.$ac_game.append(this.$playground);
        this.start();
    }
    start(){

    }
    update(){

    }
    hide(){
        this.$playground.hide();
    }
    show(){
        this.$playground.show();
    }
}
