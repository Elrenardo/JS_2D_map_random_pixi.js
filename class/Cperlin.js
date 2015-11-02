
/*Pseudo-Aléatoire random systéme*/
__seed = Math.random();
function random()
{
    var x = Math.sin(__seed++) * 10000;
    return x - Math.floor(x);
}

function randomInt(mini, maxi)
{
     //var nb = mini + (maxi+1-mini)*Math.random();
     var nb = mini + (maxi+1-mini)*random();
     return Math.floor(nb);
}
//----------------------
//----------------------
//----------------------
//----------------------
Array.prototype.shuffle = function(n)
{
     if(!n)
          n = this.length;
     if(n > 1)
     {
          var i = randomInt(0, n-1);
          var tmp = this[i];
          this[i] = this[n-1];
          this[n-1] = tmp;
          this.shuffle(n-1);
     }
}
//----------------------
//----------------------
//----------------------
//----------------------

//BRUIT DE PERLIN
function Perlin()
{
    "use strict";
	var unit = 1/Math.sqrt(2);//float
	this.gradient2 = new Array(
    	new Array(unit,unit),
    	new Array(-unit,unit),
    	new Array(unit,-unit),
    	new Array(-unit,-unit),
    	new Array(1,0),
    	new Array(-1,0),
    	new Array(0,1),
    	new Array(0,-1)
    );//float

    this.createSeed();
    this.buffer = {};

    this.perm = undefined;
}

Perlin.prototype.clearBuffer = function()
{
	this.buffer = {};
}

Perlin.prototype.createSeed = function( seed )
{
    if( seed != undefined )
        __seed = seed;

    //generation d'un seed
    var seed = new Array();
    for( var i=0; i <= 255; i++ )
        seed[i] = i;
    seed.shuffle();

    this.perm = seed;

	//jusqu'a 511
	var permtable = new Array();
	for( var i = 0; i <= 511; i++ )
    	permtable[i] = this.perm[i & 255];
    this.perm = permtable;
}

Perlin.prototype.Get2DPerlinNoiseValue = function( x, y, res)
{
    var tempX,tempY;//float
    var x0,y0,ii,jj,gi0,gi1,gi2,gi3;//int
    var tmp,s,t,u,v,Cx,Cy,Li1,Li2;//float

    //Adapter pour la résolution
    x /= res;
    y /= res;

    //On récupère les positions de la grille associée à (x,y)
    x0 = Math.floor(x);
    y0 = Math.floor(y);

    //Masquage
    ii = x0 & 255;
    jj = y0 & 255;

    //Pour récupérer les vecteurs
    gi0 = this.perm[ii + this.perm[jj]] % 8;
    gi1 = this.perm[ii + 1 + this.perm[jj]] % 8;
    gi2 = this.perm[ii + this.perm[jj + 1]] % 8;
    gi3 = this.perm[ii + 1 + this.perm[jj + 1]] % 8;

    //on récupère les vecteurs et on pondère
    tempX = x-x0;
    tempY = y-y0;
    s = this.gradient2[gi0][0]*tempX + this.gradient2[gi0][1]*tempY;

    tempX = x-(x0+1);
    tempY = y-y0;
    t = this.gradient2[gi1][0]*tempX + this.gradient2[gi1][1]*tempY;

    tempX = x-x0;
    tempY = y-(y0+1);
    u = this.gradient2[gi2][0]*tempX + this.gradient2[gi2][1]*tempY;

    tempX = x-(x0+1);
    tempY = y-(y0+1);
    v = this.gradient2[gi3][0]*tempX + this.gradient2[gi3][1]*tempY;


    //Lissage
    tmp = x-x0;
    Cx = 3 * tmp * tmp - 2 * tmp * tmp * tmp;

    Li1 = s + Cx*(t-s);
    Li2 = u + Cx*(v-u);

    tmp = y - y0;
    Cy = 3 * tmp * tmp - 2 * tmp * tmp * tmp;

    return Li1 + Cy*(Li2-Li1);
}
