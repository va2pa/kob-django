class Player extends AcGameObject{
    constructor(playground, x, y, radius, color, speed, is_me){
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.vx = 0;    //x方向移动比例
        this.vy = 0;    //y方向移动比例
        this.damage_x = 0;
        this.damage_y = 0;
        this.damage_speed = 0;
        this.friction = 0.9;    //摩擦力
        this.move_length = 0;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.is_me = is_me;
        this.eps = 0.1;     //小于这个值就算0
        this.cur_skill = null;
        this.spent_time = 0;    //冷却期，npc大于这个时间才攻击
    }

    start(){
        if(this.is_me){
            this.add_listening_events();
        }else{
            let tx = Math.random() * this.playground.width;
            let ty = Math.random() * this.playground.height;
            this.move_to(tx, ty);
        }
    }
    add_listening_events(){
        let outer = this;
        this.playground.game_map.$canvas.on("contextmenu",function(){
            return false;
        });
        this.playground.game_map.$canvas.mousedown(function(e){
            if(e.which === 3){
                outer.move_to(e.clientX, e.clientY);
            }else if(e.which == 1){
                if(outer.cur_skill === "fireball"){
                    outer.shoot_fireball(e.clientX, e.clientY);
                }
                outer.cur_skill = null;
            }
        });
        $(window).keydown(function(e){
            if(e.which == 81){ //q
                outer.cur_skill = "fireball";
                return false;
            }
        });
    }
    shoot_fireball(tx, ty){
        let x = this.x, y = this.y;
        let radius = this.playground.height * 0.01;
        let angle = Math.atan2(ty - this.y, tx - this.x);
        let vx = Math.cos(angle), vy = Math.sin(angle);
        let color = "orange";
        let speed = this.playground.height * 0.5;
        let move_length = this.playground.height * 1;
        new Fireball(this.playground, this, x, y, radius, vx, vy, color, speed, move_length, this.playground.height * 0.01);
    }
    be_attacked(angle, damage){
        this.radius -= damage;
        if(this.radius < 10){
            this.destroy();
            return false;
        }
        this.damage_x = Math.cos(angle);
        this.damage_y = Math.sin(angle);
        this.damage_speed = damage * 80;
        this.speed *= 0.9;
        for(let i = 0;i < 20 + Math.random() * 10;i++){
            let x = this.x, y = this.y;
            let radius = this.radius * Math.random() * 0.1;
            let angle = Math.PI * 2 * Math.random();
            let vx = Math.cos(angle), vy = Math.sin(angle);
            let color = this.color;
            let speed = this.speed * 10;
            let move_length = this.radius * Math.random() * 5;
            new Particle(this.playground, x, y, radius, vx, vy, color, speed, move_length);
        }
    }
    get_dist(x1, y1, x2, y2){
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }
    move_to(tx, ty){
        this.move_length = this.get_dist(this.x, this.y, tx, ty);
        let angle = Math.atan2(ty - this.y, tx - this.x);
        this.vx = Math.cos(angle);
        this.vy = Math.sin(angle);
    }
    update(){
        this.spent_time += this.timedelta / 1000;
        if(!this.is_me && this.spent_time > 5 &&  Math.random() < 1 / 180){
            let count = this.playground.players.length;
            let player = this.playground.players[Math.floor(Math.random() * count)];
            this.shoot_fireball(player.x, player.y);
        }
        if(this.damage_speed > this.eps * 100){
            this.vx = this.vy = 0;
            this.move_length = 0;
            this.x += this.damage_x * this.damage_speed * this.timedelta / 1000;
            this.y += this.damage_y * this.damage_speed * this.timedelta / 1000;
            this.damage_speed *= this.friction;
        }else if(this.move_length < this.eps){
            this.move_length = 0;
            this.vx = this.xy = 0;
            if(!this.is_me){
                let tx = Math.random() * this.playground.width;
                let ty = Math.random() * this.playground.height;
                this.move_to(tx, ty);
            }
        }else{
            let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);     //真实移动距离
            this.move_length -= moved;
            this.x += this.vx * moved;
            this.y += this.vy * moved;
        }
        this.render();
    }

    render(){
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
}
