export class AcGame{
    constructor(id,acos){
        this.id = id;
        this.$ac_game = $('#' + id);
        this.acos = acos;
        this.settings = new Settings(this);
        this.menu = new AcGameMenu(this);
        this.playground = new AcGamePlayground(this);
        this.start();
    }
    start(){

    }
}
