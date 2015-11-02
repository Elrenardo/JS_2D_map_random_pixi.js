"use strict";

function randomSeed( seed )
{
	this.seed = seed;
	if( seed == undefined )
		this.seed = 0;
}

randomSeed.prototype.random = function()
{
    var x = Math.sin(this.seed++) * 10000;
    return (x - Math.floor(x));
}

randomSeed.prototype.rand = function( min, max )
{
	return Math.floor((this.random() * max) + min);
}

//-----------------------------------
function randomMM(mini, maxi)
{
     var nb = mini + (maxi+1-mini)*Math.random();
     return Math.floor(nb);
}