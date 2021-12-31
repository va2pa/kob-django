class AcGameMenu{
    constructor(root){
        this.root = root;
        this.$menu = $(`
<div class="ac-game-menu">
    <div class="ac-game-menu-field">
        <div class="ac-game-menu-field-item ac-game-menu-field-single_mode">
            单人模式
        </div>
        <br>
        <div class="ac-game-menu-field-item ac-game-menu-field-multi_mode">
            多人模式
        </div>
        <br>
        <div class="ac-game-menu-field-item ac-game-menu-field-settings">
            设置
        </div>
    </div>
</div>
        `);
        this.root.$ac_game.append(this.$menu);
        this.$single_mode = this.$menu.find('.ac-game-menu-field-single_mode');
        this.$multi_mode = this.$menu.find('.ac-game-menu-field-multi_mode');
        this.$settings = this.$menu.find('.ac-game-menu-field-settings');
        this.start();
    }
    start(){
        this.add_listening_events();
    }
    add_listening_events(){
        let outer = this;
        this.$single_mode.click(function(){
            outer.hide();
            outer.root.playground.show();
        });
        this.$multi_mode.click(function(){
            console.log("multi_mode");
        });
        this.$settings.click(function(){
            console.log("settings");
        });
    }
    show(){     //显示menu界面
        this.$menu.show();
    }
    hide(){     //关闭menu界面
        this.$menu.hide();
    }
}
let AC_GAME_OBJECTS = [];

class AcGameObject{
    constructor(){
        AC_GAME_OBJECTS.push(this);

        this.has_called_start = false;      //是否执行过start函数
        this.timedelta = 0;     //每一帧时间间隔
    }
    start(){        //只会在第一帧执行一次
    }
    update(){       //每一帧执行一次
    }
    on_destroy(){       //在被销毁前执行一次
    }
    destroy(){      //删除该物体
        this.on_destroy();

        for(let i = 0;i < AC_GAME_OBJECTS.length;i++){
            if(AC_GAME_OBJECTS[i] === this){
                AC_GAME_OBJECTS.splice(i,1);
                break;
            }
        }
    }
}

let last_timestamp;
let AC_GAME_ANIMATION = function(timestamp){
    for(let i = 0;i < AC_GAME_OBJECTS.length;i++){
        let obj = AC_GAME_OBJECTS[i];
        if(!obj.has_called_start){
            obj.start();
            obj.has_called_start = true;
        }else{
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }
    last_timestamp = timestamp;
    requestAnimationFrame(AC_GAME_ANIMATION);
}

requestAnimationFrame(AC_GAME_ANIMATION);
class GameMap extends AcGameObject{
    constructor(playground){
        super();
        this.playground = playground;
        this.$canvas = $(`<canvas></canvas>`);
        this.ctx = this.$canvas[0].getContext('2d');
        this.ctx.canvas.width = this.playground.width;
        this.ctx.canvas.height = this.playground.height;
        this.playground.$playground.append(this.$canvas);
    }
    start(){
    }
    update(){
        this.render();
    }
    render(){
        this.ctx.fillStyle = "rgba(0,0,0)";
        this.ctx.fillRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);
    }
}
class AcGamePlayground{
    constructor(root){
        this.root = root;
        this.$playground = $(`<div class="ac-game-playground"></div>`);
        //this.hide();
        this.root.$ac_game.append(this.$playground);
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.game_map = new GameMap(this);

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
export class AcGame{
    constructor(id){
        this.id = id;
        this.$ac_game = $('#' + id);
        //this.menu = new AcGameMenu(this);
        this.playground = new AcGamePlayground(this);
        this.start();
    }
    start(){

    }
}
