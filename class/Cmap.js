"use strict";
function Cmap()
{
	this.max_zone = 15;
	this.zoom     = 23;

	this.tab      = {};
	this.perlin   = new Perlin();
	this.memory   = false;
}

Cmap.prototype.setMap =function( data )
{
	if( data.zone != undefined )
		this.max_zone = data.zone;

	if( data.zoom != undefined )
		this.zoom = data.zoom;

	if( data.tab != undefined )
		this.tab = data.tab;

	if( data.seed != undefined )
		this.setSeed( data.seed );
}

/*créer un nouveau seed ou en charge un*/
Cmap.prototype.setSeed = function( seed )
{
	this.perlin.createSeed( seed );
}


Cmap.prototype.resetMap = function()
{
	this.perlin.createSeed();
	this.tab = {};
}

Cmap.prototype.set = function( x, y , id )
{
	this.tab[ x+'_'+y ] = id;
}

Cmap.prototype.getCasse = function( x, y)
{
	var casse = x+'_'+y;
	//si la casse est vierge on affiche ca valeur par default
	if( this.tab[ casse ] == undefined )
	{
		var value = this.generateTerrain( x, y);
		if( this.memory )
			this.tab[ casse ] = value;
		return value;
	}
	return this.tab[ casse ];
}

Cmap.prototype.getRandomPerlin = function( x, y)
{
	var min = 0;
	var max = this.max_zone;
	var perlin = this.perlin.Get2DPerlinNoiseValue( x, y, this.zoom);

	var val = Math.floor( perlin * (max - min + 1) + min);
	return Math.abs( val );
}

Cmap.prototype.generateTerrain = function( x, y)
{
	var casse = x+'_'+y;
	if( this.tab[ casse ] == undefined )
	{
		this.tab[ casse ] =  this.getRandomPerlin( x, y);
	}
	return this.tab[ casse ];
}