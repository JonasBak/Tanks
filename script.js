/**
 * Created by JOBA9 on 12.12.2014.
 */

//TODO slå sammen drawAreas, bounce-bomb
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var tmpCanvas = document.getElementById('tmpCanvas');
var tmpCtx = tmpCanvas.getContext('2d');

var btnStart = document.getElementById("btnStart");
var btnNyBane = document.getElementById("btnNyBane");
var menue = document.getElementById("divMenue");

var controls = document.getElementById("controls");

canvas.width = tmpCanvas.width = 800;
canvas.height = tmpCanvas.height = 400;

ctx.fillStyle = "#EAF2EF";
ctx.fillRect(0,0,canvas.width,canvas.height);

var map = new Map(400, 200);

//ctx.fillStyle = "#EAF2EF";
//ctx.fillRect(0,0,canvas.width,canvas.height);
//map.update();
map.drawMap();

//var tanks = [new Tanks(100,200,37,39,38,40,32,"#ff2222", "Spiller1"), new Tanks(700,200,37,39,38,40,32,"#2222ff", "Spiller2")];
var tanks = [];

var player = 0;

var keys = {};

var musX=0;
var musY=0;

function loop() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "#EAF2EF";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    map.update();
    map.drawMap();
    for (var i = 0; i < tanks.length; i++){
        tanks[i].draw();
        tanks[i].update();
        //showStats(i,tanks[i].position.x-10,15,tanks[i].stats,tanks[i].color.tanks);
        if(tanks[i].stats.health == 0){
            tanks.splice(i,1);
            //player--;
            if (tanks.length > 0) {
                i--;
                //player = (player-1+tanks.length)%tanks.length;
                tanks[(player + 1) % tanks.length].resetStats();
                player = player % tanks.length;
            }
        }
    }
    //showStats();
    /*if (tanks.length > 1){
        showStats(0,0,tanks[player].stats,tanks[player].color.tanks);
        map.update();
    }*/
    if (tanks.length == 1) {
        //tanks[0].resetStats();
        //alert(tanks[0].stats.name + " vant!");
        controls.style.display = "none";
        menue.style.display = "block";
        menue.getElementsByTagName("div")[1].style.display = "block";
        menue.getElementsByTagName("div")[1].getElementsByTagName("p")[0].innerHTML = tanks[0].stats.name + " vant!";
    }
    else if(tanks.length < 1) {
        //alert("Ingen vant!");
        controls.style.display = "none";
        menue.style.display = "block";
        menue.getElementsByTagName("div")[1].style.display = "block";
        menue.getElementsByTagName("div")[1].getElementsByTagName("p")[0].innerHTML = "Ingen vant!";
    }
    else {
        ctx.textAlign = "center";
        ctx.fillStyle = tanks[player].color.tanks;
        ctx.font = '10pt Liberation-Sans';
        ctx.fillText(tanks[player].stats.name + " sin tur", canvas.width/2, 15);
    }
    window.requestAnimationFrame(loop);
}

canvas.addEventListener('mousemove', function(e){
    musX= e.clientX - canvas.getBoundingClientRect().left;
    musY= e.clientY - canvas.getBoundingClientRect().top-0.5;
});

canvas.onclick = function(){
    map.editEnvironment(musX, musY, 100, 2);
};

window.addEventListener('keydown', function(evt){
    //alert(evt.keyCode);
    if ([37,39,38,40,18].indexOf(evt.keyCode) != -1)evt.preventDefault();
    keys[evt.keyCode] = true;
    //alert(evt.keyCode);
});

window.addEventListener('keyup', function(evt){
    delete keys[evt.keyCode];
});

//loop();
var udel = 0;
function showStats(){
    /*ctx.fillStyle = color;
    var size = 10;
    ctx.font = size + 'pt Liberation-Sans';
    ctx.fillText("Name: " + stats.name, _x, _y + (size + 2));
    ctx.fillText("Health: " + stats.health, _x, _y + 2 * (size + 2));
    ctx.fillText("Fuel: " + stats.fuel, _x, _y + 3 * (size + 2));
    ctx.fillText("Power: " + stats.power, _x, _y + 4 * (size + 2));
    ctx.fillText("Bullet: " + stats.bulletType, _x, _y + 5 * (size + 2));*/
    //controls.getElementsByTagName("div")[n].style.color = color;
    //controls.getElementsByTagName("div")[n].style.left = _x;
    //controls.getElementsByTagName("div")[n].getElementsByTagName("span")[0].innerHTML = stats.name;
    //udel++;
    //if (udel > 6){
        //updateStats();
        //udel = 0;
    //}
}

function updateStats(){
    for (var i = 0; i < tanks.length; i++){
        var div = controls.getElementsByTagName("div")[i];
        div.style.color = tanks[i].color.tanks;
        div.getElementsByTagName("span")[0].innerHTML = tanks[i].stats.name;
        div.getElementsByTagName("span")[1].innerHTML = tanks[i].stats.health;
        div.getElementsByTagName("span")[2].innerHTML = tanks[i].stats.fuel;
        div.getElementsByTagName("span")[3].innerHTML = tanks[i].stats.power;
        div.getElementsByTagName("span")[4].innerHTML = tanks[i].stats.bulletType;
        div.getElementsByTagName("input")[0].value = tanks[i].stats.power;
    }
}

function nextPlayer(){
    player = (player+1)%tanks.length;
    tanks[player].resetStats();
}

btnStart.onclick = function(){
    tanks = [
        new Tanks(Math.random()*(canvas.width/2-50)+50,200,37,39,38,40,32,document.getElementById("inpColor1").value, document.getElementById("inpName1").value),
        //new Tanks(400,200,37,39,38,40,32,"#00ff00", "agafsd"),
        new Tanks(Math.random()*(canvas.width/2-50)+50+canvas.width/2,200,37,39,38,40,32,document.getElementById("inpColor2").value, document.getElementById("inpName2").value)
    ];
    menue.style.display = "none";
    menue.getElementsByTagName("div")[0].style.display = "none";

    controls.style.display = "block";
    updateStats();

   /* for (var i = 0; i < tanks.length; i++){
        var div = controls.getElementsByTagName("div")[i];

        div.getElementsByTagName("input")[0].addEventListener("change", function(){
            tanks[i].stats.power = div.getElementById("input")[0].value;});

        /*div.getElementsByTagName("span")[0].innerHTML = tanks[i].stats.name;
        div.getElementsByTagName("span")[1].innerHTML = tanks[i].stats.health;
        div.getElementsByTagName("span")[2].innerHTML = tanks[i].stats.fuel;
        div.getElementsByTagName("span")[3].innerHTML = tanks[i].stats.power;
        div.getElementsByTagName("span")[4].innerHTML = tanks[i].stats.bulletType;
    }*/
    controls.getElementsByTagName("div")[0].getElementsByTagName("input")[0].addEventListener("change", function(){
        tanks[0].stats.power = controls.getElementsByTagName("div")[0].getElementsByTagName("input")[0].value;
        updateStats();});
    controls.getElementsByTagName("div")[1].getElementsByTagName("input")[0].addEventListener("change", function(){
        tanks[1].stats.power = controls.getElementsByTagName("div")[1].getElementsByTagName("input")[0].value;
        updateStats();});

    loop();
};
btnNyBane.onclick = function(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    map = new Map(400, 200);
    //ctx.fillStyle = "#EAF2EF";
    //ctx.fillRect(0,0,canvas.width,canvas.height);
    //map.update();
    //map.update();
    map.drawMap();
};

