/**
 * Created by Jonas on 13.12.2014.
 */
function pyt(n1, n2){
    return Math.sqrt(Math.pow(n1,2)+Math.pow(n2,2));
}

function Tanks(_x, _y, kleft, kright, kup, kdown, kshoot, _color, _name){
    this.controls = {left:kleft, right:kright, up:kup, down:kdown, shoot:kshoot};
    this.position = {x:_x, y:_y, rot:0, vel:2, degClimb:1.26};
    this.size = {x:20, y:10};
    this.color = {tanks:_color, turret:"#000000"};
    this.turret = {rot:0, vel:Math.PI/60, size:2, length:12};
    this.stats = {name:_name, power:0, charging:false, chargeSpeed:1, fuel:100, fuelUsage:1, health:100, bulletType:0, nBullets:5};
    this.shooting = false;
    this.bullets = [];
    this.bullet = {x:0, y:0, vx:0, vy:0, r:0, type:0};//typer: 0:vanlig, 1:lag land, 2:spread, 3:cluster
    this.bulletChanged = false;
    this.draw = function(){
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.position.rot);
        ctx.fillStyle = this.color.tanks;
        ctx.fillRect(-this.size.x/2, -this.size.y, this.size.x, this.size.y);
        ctx.translate(0, -this.size.y);
        ctx.beginPath();
        ctx.arc(0,0,this.size.x/4,0,Math.PI*2);
        ctx.fill();
        ctx.closePath();
        ctx.rotate(this.turret.rot-this.position.rot);
        ctx.lineWidth = this.turret.size;
        ctx.strokeStyle = this.color.turret;
        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.lineTo(this.turret.length, 0);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
        for (var i = 0; i < this.bullets.length; i++){
            ctx.beginPath();
            ctx.fillStyle = "#222222";
            ctx.arc(this.bullets[i].x,this.bullets[i].y,2,0,Math.PI*2);
            ctx.fill();
            ctx.closePath();
        }
    };
    this.update = function(){
        var x = Math.floor(this.position.x/(canvas.width/map.resolution.x));
        var y = Math.floor((this.position.y)/(canvas.height/map.resolution.y));
        //if (map.map[x+1].indexOf(1))
        this.position.rot = Math.atan2(Math.floor(this.size.x/(canvas.width/map.resolution.x)), (y - map.closestPlane(x+Math.floor(this.size.x/(2*canvas.width/map.resolution.x)), y)) - (y - map.closestPlane(x-Math.floor(this.size.x/(2*canvas.width/map.resolution.x)), y))) - Math.PI/2;//Math.atan2(4, (y - map.firstSolid(x+2)) - (y - map.firstSolid(x-2))) - Math.PI/2;
        //if (this.position.rot > this.position.degClimb || this.position.rot < -this.position.degClimb)alert(map.closestPlane(x+2, y) + " " + map.closestPlane(x-2, y));
        if (map.map[x][y] == 0 && map.map[x][y+1] == 0){
            this.position.y += canvas.height/map.resolution.y;
        }
        else if (map.map[x][y] == 0 && map.map[x][y+1] != 0){
            if (tanks.indexOf(this) == player) {
                if (this.shooting) {
                    this.shooting = this.bullets.length != 0;
                    for (var i = 0; i < this.bullets.length; i++) {
                        this.bullets[i].x += this.bullets[i].vx;
                        this.bullets[i].vy += 0.1;
                        this.bullets[i].y += this.bullets[i].vy;

                        var bx = Math.floor(this.bullets[i].x / (canvas.width / map.resolution.x));
                        var by = Math.floor(this.bullets[i].y / (canvas.height / map.resolution.y));
                        if (this.bullets[i].x < 0 || this.bullets[i].x >= canvas.width) {
                            this.bullets.splice(i, 1);
                            if (this.bullets.length == 0) {
                                //this.resetStats();
                                nextPlayer();
                            }
                        }
                        else if (this.bullets[i].y > 0 && map.map[bx][by] != 0) {
                            if (this.bullets[i].type == 0 || this.bullets[i].type == 2) {
                                map.damageEnvironment(this.bullets[i].x, this.bullets[i].y, this.bullets[i].r);
                                for (var u = 0; u < tanks.length; u++) {
                                    var d = pyt(this.bullets[i].x - tanks[u].position.x, this.bullets[i].y - tanks[u].position.y);
                                    if (d < this.bullets[i].r)tanks[u].damageTank(10 + 40 * (this.bullets[i].r - d) / this.bullets[i].r);
                                }
                            }
                            else if (this.bullets[i].type == 1) {
                                map.createEnvironment(this.bullets[i].x, this.bullets[i].y, this.bullets[i].r);
                            }
                            else if (this.bullets[i].type == 3){
                                for (var u = 0; u < 5; u++)
                                this.addBullet(this.bullets[i].x,this.bullets[i].y,10,3,Math.random()*Math.PI/2 - Math.PI * 3/4);
                            }
                            if (this.bullets[i].type != 4){
                                map.changedAreas.push([this.bullets[i].x,this.bullets[i].y,this.bullets[i].r]);
                                map.optimizeDrawAreas();
                                this.bullets.splice(i, 1);
                                map.updated = false;
                                if (this.bullets.length == 0) {
                                    //this.resetStats();
                                    nextPlayer();
                                }
                            }
                            else {
                                this.bullets[i].vy = -this.bullets[i].vy;
                                this.bullets[i].y -= 5;
                                this.bullets[i].type = 0;
                            }
                        }
                    }
                }
                else if (this.stats.charging) {
                    if (keys[this.controls.shoot]) {
                        if (this.stats.power < 100)
                        this.stats.power += this.stats.chargeSpeed;
                        //console.log(this.stats.power);
                    }
                    else {
                        this.charging = false;
                        this.shooting = true;
                        this.shoot();
                    }
                    updateStats();
                }
                else if (keys[this.controls.shoot]) {
                    this.stats.power = 0;
                    this.stats.charging = true;
                }
                else if (keys[18]){
                    this.stats.charging = true;
                }
                else {//KONTROLLER
                    if (map.updated) {
                        if (keys[67] && !this.bulletChanged){this.changeBulletType();}
                        else if (!keys[67] && this.bulletChanged)this.bulletChanged = false;
                        if (keys[this.controls.left] && this.stats.fuel > 0 && this.position.x - this.size.x / 2 - this.position.vel > 0 && this.position.rot < this.position.degClimb) {//Venstre
                            this.position.x -= this.position.vel;
                            this.useFuel();
                        }
                        if (keys[this.controls.right] && this.stats.fuel > 0 && this.position.x + this.size.x / 2 + this.position.vel < canvas.width && this.position.rot > -this.position.degClimb) {//Høyre
                            this.position.x += this.position.vel;
                            this.useFuel();
                        }
                        if (keys[this.controls.up]) {//Opp
                            this.turret.rot += this.turret.vel;
                        }
                        if (keys[this.controls.down]) {//Ned
                            this.turret.rot -= this.turret.vel;
                        }
                    }
                }
            }
        }
        else if (map.map[x][y] != 0){
            this.position.y -= canvas.height/map.resolution.y;
        }
        else console.log("error");
    };
    this.useFuel = function(){
        this.stats.fuel -= this.stats.fuelUsage;
        if (this.stats.fuel < 0)this.stats.fuel = 0;
        updateStats();
    };
    this.shoot = function(){
        if (this.stats.bulletType == 2) {
            for (var i = 0; i < 3; i++) {
                var tmp = Object.create(this.bullet);
                tmp.x = this.position.x - this.size.y * Math.cos(this.position.rot + Math.PI / 2);
                tmp.y = this.position.y - this.size.y * Math.sin(this.position.rot + Math.PI / 2);
                tmp.vx = Math.cos(this.turret.rot + Math.PI/28 - i * Math.PI/28) * this.stats.power / 8;
                tmp.vy = Math.sin(this.turret.rot + Math.PI/28 - i * Math.PI/28) * this.stats.power / 8;
                tmp.r = 20;
                tmp.type = this.stats.bulletType;
                this.bullets.push(tmp);
            }
        }
        else if (this.stats.bulletType == 1) {
            var tmp = Object.create(this.bullet);
            tmp.x = this.position.x - this.size.y * Math.cos(this.position.rot + Math.PI / 2);
            tmp.y = this.position.y - this.size.y * Math.sin(this.position.rot + Math.PI / 2);
            tmp.vx = Math.cos(this.turret.rot) * this.stats.power / 8;
            tmp.vy = Math.sin(this.turret.rot) * this.stats.power / 8;
            tmp.r = 30;
            tmp.type = this.stats.bulletType;
            this.bullets.push(tmp);
        }
        else {
            var tmp = Object.create(this.bullet);
            tmp.x = this.position.x - this.size.y * Math.cos(this.position.rot + Math.PI / 2);
            tmp.y = this.position.y - this.size.y * Math.sin(this.position.rot + Math.PI / 2);
            tmp.vx = Math.cos(this.turret.rot) * this.stats.power / 8;
            tmp.vy = Math.sin(this.turret.rot) * this.stats.power / 8;
            tmp.r = 40;
            tmp.type = this.stats.bulletType;
            this.bullets.push(tmp);
        }
    };
    this.addBullet = function(_x,_y,_r,_vel,_deg){
        var tmp = Object.create(this.bullet);
        tmp.x = _x;
        tmp.y = _y;
        tmp.vx = Math.cos(_deg) * _vel;
        tmp.vy = Math.sin(_deg) * _vel;
        tmp.r = _r;
        tmp.type = 0;
        this.bullets.push(tmp);
    };
    this.resetStats = function(){
        this.stats.charging = false;
        //this.shooting = false;
        this.stats.fuel = 100;
        //this.stats.power = 0;
        updateStats();
    };
    this.damageTank = function(dmg){
        if (tanks.length > 1) {
            this.stats.health -= dmg;
            this.stats.health = Math.round(this.stats.health);
            if (this.stats.health < 0)this.stats.health = 0;
        }
        updateStats();
    };
    this.changeBulletType = function(){
        this.bulletChanged = true;
        this.stats.bulletType = (this.stats.bulletType + 1)%this.stats.nBullets;
        updateStats();
    }
}

function cloneObj(obj){
    return obj;
}