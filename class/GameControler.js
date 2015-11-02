"use strict";

function GameControler( width, height, colorHEX )
{
    //rendu graphique
    this.height = height;
    this.width  = width;
    this.render = new Render( width, height, colorHEX );

    //Window gestion controler
    this.windows = new WindowControler( this.render.stage );
    this.windows.setData( this );

    //addWindow
    this.windows.addWindow('default', window_default, window_default_update );
}

/* boucle d'annimation a placer dans requestAnimFrame()*/
GameControler.prototype.loopRender = function()
{
    //mise a jour graphique
    this.updateRender();
    // render the stage   
    this.render.draw();
}

/*resize canvas*/
GameControler.prototype.resizeCanvas = function( width, height )
{
    this.height = height;
    this.width  = width;
    this.render.resize( width, height );
}


//----------------------------------------------------------------
//----------------------------------------------------------------
//----------------------------------------------------------------
//----------------------------------------------------------------
GameControler.prototype.init = function()
{
  this.windows.start( 'default' );
}

GameControler.prototype.updateRender = function()
{
  this.windows.update();
}