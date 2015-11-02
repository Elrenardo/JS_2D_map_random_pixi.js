"use strict";
/*
WINDOWS CONTROLER

*/

function WindowControler( PIXIstage )
{
	this.stage = PIXIstage;
	
	this.windows = {};
	this.data = {};

	this.render_actu = undefined;
	this.render = new PIXI.DisplayObjectContainer();
}

/*DEFINIR DATA */
WindowControler.prototype.setData = function( data )
{
	this.data = data;
}

/*AJOUTER UN WINDOW */
WindowControler.prototype.addWindow = function( name, callback_init, callback_update )
{
	//ajout conteneur vide
	this.stage.addChild( this.render );

	//configuration windows
	this.windows[ name ] = {};
	this.windows[ name ].init = callback_init;
	this.windows[ name ].upda = callback_update;
}

/*lANCER UN WINDOWS*/
WindowControler.prototype.start = function( name_start )
{
	//activie le nouveau window
	this.render_actu = name_start;
	
	//appel foncton du init window
	//this.render.removeAll();
	while( this.render.children[0] )
	{
		this.render.removeChild( this.render.children[0] );
	}

	this.windows[ name_start ].init( this.data, this.render );
}

/* MISE A JOUR DU WINDOWS FRAME*/
WindowControler.prototype.update = function()
{
	//appel foncton du update window
	var fonc = this.windows[ this.render_actu ].upda;
	if( fonc != undefined )
		fonc( this.data, this.render );
}