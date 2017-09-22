/**
 * Created by JOBA9 on 12.12.2014.
 */
function Map(_x,_y){
    this.resolution = {x:_x,y:_y};
    this.map = [];
    this.moving = false;
    this.updated = false;
    this.img = new Image();
    this.changedAreas = [];
    this.ddel = 10;
    this.setUp = function(){
        for (var x = 0; x < this.resolution.x; x++){
            var tmp = [];
            for (var y = 0; y < this.resolution.y; y++){
                if (y < 50)tmp.push(0);
                else tmp.push(1);
                //tmp.push(Math.random() < 0.3 ? 1:0)
            }
            this.map.push(tmp);
        }

        for (var i = 0; i < 25; i++)this.damageEnvironment(Math.random()*canvas.width,Math.random()*100-50,150 + Math.random()*150);
        //for (i = 0; i < 50; i++)this.editEnvironment(i/50*canvas.width,/*Math.random()*20-10+canvas.height-5*/this.firstSolid(this.resolution.x*i/50)*canvas.height/this.resolution.y + 200,100 + Math.random()*50, 2);
        for (x = 0; x < this.resolution.x; x++){
            for (y = Math.floor(this.firstSolid(x) + (this.resolution.y - this.firstSolid(x))/2); y < this.resolution.y; y++){
                this.map[x][y] = 2;
            }
        }

        for (x = 0; x < this.resolution.x; x++) {
            for (y = 0; y < this.resolution.y; y++) {
                if (this.map[x][y] != 0) {
                    ctx.fillStyle = this.map[x][y] == 1 ? "#DEC166":"#918066";
                    //alert(x * this.resolution.x/ctx.width);
                    ctx.fillRect(x * canvas.width / this.resolution.x, y * canvas.height / this.resolution.y, canvas.width / this.resolution.x, canvas.height / this.resolution.y);
                }
            }
        }
        this.update();
    };
    this.damageEnvironment = function(_x, _y, _r){
        var y0 = Math.floor((_y)/(canvas.height/this.resolution.y));
        var y1 = Math.floor((_y - _r)/(canvas.height/this.resolution.y));
        var y2 = Math.floor((_y + _r)/(canvas.height/this.resolution.y));
        var x0 = Math.floor(_x/(canvas.width/this.resolution.x));
        var r = Math.floor(_r/(canvas.height/this.resolution.y));

        for (var y = y1; y <= y2; y++){
            for (var x = x0 - Math.floor(Math.sqrt(Math.pow(r, 2) - Math.pow(y - y0, 2))); x <=  x0 + Math.floor(Math.sqrt(Math.pow(r, 2) - Math.pow(y - y0, 2))); x++){
                if (x >= 0 && x < this.resolution.x && y >= 0 && y < this.resolution.y) {
                    this.map[x][y] = 0;
                }
            }
        }
    };
    this.createEnvironment = function(_x, _y, _r){
        var y0 = Math.floor((_y)/(canvas.height/this.resolution.y));
        var y1 = Math.floor((_y - _r)/(canvas.height/this.resolution.y));
        var y2 = Math.floor((_y + _r)/(canvas.height/this.resolution.y));
        var x0 = Math.floor(_x/(canvas.width/this.resolution.x));
        var r = Math.floor(_r/(canvas.height/this.resolution.y));

        for (var y = y1; y <= y2; y++){
            for (var x = x0 - Math.floor(Math.sqrt(Math.pow(r, 2) - Math.pow(y - y0, 2))); x <=  x0 + Math.floor(Math.sqrt(Math.pow(r, 2) - Math.pow(y - y0, 2))); x++){
                if (x >= 0 && x < this.resolution.x && y >= 0 && y < this.resolution.y) {
                    this.map[x][y] = 1;
                }
            }
        }
    };
    this.drawMap = function(){
        if (this.updated && this.ddel > 5){
            ctx.drawImage(this.img, 0, 0, canvas.width, canvas.height);
            this.changedAreas = [];
        }
        else {
            ctx.drawImage(this.img, 0, 0, canvas.width, canvas.height);
            for (var i = 0; i < this.changedAreas.length; i++){
                this.drawArea(this.changedAreas[i][0],this.changedAreas[i][1],this.changedAreas[i][2]);
            }
            if (this.updated)this.ddel++;
            /*for (var x = 0; x < this.resolution.x; x++) {
                for (var y = 0; y < this.resolution.y; y++) {
                    if (this.map[x][y] != 0) {
                        ctx.fillStyle = "#823521";
                        //alert(x * this.resolution.x/ctx.width);
                        ctx.fillRect(x * canvas.width / this.resolution.x, y * canvas.height / this.resolution.y, canvas.width / this.resolution.x, canvas.height / this.resolution.y);
                    }
                }
            }
            console.log("lol");*/
        }
    };
    this.update = function(){
        if (!this.updated) {
            var n = 0;
            for (var x = this.resolution.x - 1; x >= 0; x--) {
                for (var y = this.resolution.y - 1; y >= 0; y--) {
                    if (this.map[x][y] == 1 && this.map[x][y + 1] == 0) {
                        this.map[x][y + 1] = this.map[x][y];
                        this.map[x][y] = 0;
                        n++;
                    }
                }
            }
            //console.log(n);
            this.moving = n != 0;
        }
        if (!this.updated && !this.moving){
            tmpCtx.clearRect(0,0,tmpCanvas.width,tmpCanvas.height);
            for (var x2 = 0; x2 < this.resolution.x; x2++){
                for (var y2 = 0; y2 < this.resolution.y; y2++){
                    if (this.map[x2][y2] != 0){
                        tmpCtx.fillStyle = this.map[x2][y2] == 1 ? "#DEC166":"#918066";
                        //alert(x * this.resolution.x/ctx.width);
                        tmpCtx.fillRect(x2 * tmpCanvas.width/this.resolution.x, y2 * tmpCanvas.height/this.resolution.y, tmpCanvas.width/this.resolution.x, tmpCanvas.height/this.resolution.y);
                    }
                }
            }
            this.img.src = tmpCanvas.toDataURL();
            this.updated = true;
            this.ddel = 0;
        }
    };
    this.drawArea = function(_x, _y, _r){
        /*var y0 = Math.round((_y)/(canvas.height/this.resolution.y));
        var y1 = Math.round((_y - _r)/(canvas.height/this.resolution.y));
        var y2 = Math.round((_y + _r)/(canvas.height/this.resolution.y));
        var x0 = Math.round(_x/(canvas.width/this.resolution.x));
        var r = Math.round(_r/(canvas.height/this.resolution.y));

        for (var y = y1; y <= y2; y++){
            for (var x = x0 - Math.round(Math.sqrt(Math.pow(r, 2) - Math.pow(y - y0, 2))); x <=  x0 + Math.round(Math.sqrt(Math.pow(r, 2) - Math.pow(y - y0, 2))); x++){
                if (x >= 0 && x < this.resolution.x && y >= 0 && y < this.resolution.y) {
                    ctx.fillStyle = this.map[x][y] == 0 ? "#000000":"#823521";
                    ctx.fillRect(x * canvas.width / this.resolution.x, y * canvas.height / this.resolution.y, canvas.width / this.resolution.x, canvas.height / this.resolution.y);
                }
            }
        }*/
        var x0 = Math.floor((_x - _r)/(canvas.width/this.resolution.x));
        var x1 = Math.floor((_x + _r)/(canvas.width/this.resolution.x));
        var y0 = 0;//Math.round((_y - 2*_r)/(canvas.height/this.resolution.y));
        var y1 = this.resolution.y;//Math.round((_y + _r)/(canvas.height/this.resolution.y));
        ctx.fillStyle = "#EAF2EF";
        ctx.fillRect(_x-_r, 0, 2*_r, canvas.height);
        for (var x = x0; x <= x1; x++){
            for (var y = y0; y <= y1; y++){
                if (x >= 0 && x < this.resolution.x && y >= 0 && y < this.resolution.y) {
                    //alert(this.map[x].indexOf(1) + " " + y);
                    if (this.map[x][y] != 0) {
                        ctx.fillStyle = /*this.map[x][y] == 0 ? "#EAF2EF"/*"#992222" :*/ (this.map[x][y] == 1 ? "#DEC166" : "#918066");
                        ctx.fillRect(x * canvas.width / this.resolution.x, y * canvas.height / this.resolution.y, canvas.width / this.resolution.x, canvas.height / this.resolution.y);
                    }
                }
            }
        }
    };
    this.editEnvironment = function(_x, _y, _r, _to){
        var y0 = Math.floor((_y)/(canvas.height/this.resolution.y));
        var y1 = Math.floor((_y - _r)/(canvas.height/this.resolution.y));
        var y2 = Math.floor((_y + _r)/(canvas.height/this.resolution.y));
        var x0 = Math.floor(_x/(canvas.width/this.resolution.x));
        var r = Math.floor(_r/(canvas.height/this.resolution.y));

        for (var y = y1; y <= y2; y++){
            for (var x = x0 - Math.floor(Math.sqrt(Math.pow(r, 2) - Math.pow(y - y0, 2))); x <=  x0 + Math.floor(Math.sqrt(Math.pow(r, 2) - Math.pow(y - y0, 2))); x++){
                if (x >= 0 && x < this.resolution.x && y >= 0 && y < this.resolution.y) {
                    if (this.map[x][y] != 0)this.map[x][y] = _to;
                }
            }
        }
        this.updated = false;
    };
    this.firstSolid = function(_x){
        for (var y = 0; y < this.resolution.y; y++)if(this.map[_x][y] != 0)return y;
        return this.resolution.y;
    };
    this.closestPlane = function(_x,_y){
        var x0 = _x;//Math.floor(_x/(canvas.width/this.resolution.x));
        var y0 = _y;//Math.floor((_y)/(canvas.height/this.resolution.y));

        if (this.map[x0][y0] == 0){
            var tmp = this.map[x0].slice(y0);
            var y1 = tmp.indexOf(1);
            y1 = y1 == -1 ? this.resolution.y-y0:y1;
            var y2 = tmp.indexOf(2);
            y2 = y2 == -1 ? this.resolution.y-y0:y2;
            y1 = y1 < y2 ? y1:y2;
            y1 += y0;
        }
        else {
            var tmp = this.map[x0].slice(0,y0);
            tmp.reverse();
            y1 = y0 - (tmp.indexOf(0));
        }
        return y1;
    };
    this.optimizeDrawAreas = function(){
        this.changedAreas.sort(this.sortFunction);

        for (var i = 0; i < this.changedAreas.length - 1;){
            if (this.changedAreas[i][0] + this.changedAreas[i][2] >= this.changedAreas[i+1][0] - this.changedAreas[i+1][2]){
                var tmp = [];
                tmp.push((this.changedAreas[i][0] - this.changedAreas[i][2] + this.changedAreas[i+1][0] + this.changedAreas[i+1][2])/2);
                tmp.push(this.changedAreas[i][1]);
                tmp.push(tmp[0] - (this.changedAreas[i][0] - this.changedAreas[i][2]));
                this.changedAreas.splice(0,1);
                this.changedAreas[0] = tmp;
            }
            else {
                i++;
            }
        }
    };
    this.sortFunction = function(a, b){
        if (a[0] === b[0]) {
            return 0;
        }
        else {
            return (a[0] < b[0]) ? -1 : 1;
        }
    };
    this.setUp();
}