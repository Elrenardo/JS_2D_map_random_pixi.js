"use strict";
//--------------------------------------------------------
//--------------------------------------------------------
//--------------------------------------------------------
//--------------------------------------------------------
//Evenement appelé lors de l'appel de la scene
function window_default( obj, render )
{
  obj.map = new MapEngine( obj.render, render );

  obj.map.setSize( obj.width, obj.height );

  obj.map.load( "data/map.json", "data/sp.json", function(){} );
}

//--------------------------------------------------------
//--------------------------------------------------------
//--------------------------------------------------------
//--------------------------------------------------------
//Evenement appelé a chaque frame
function window_default_update( obj, render )
{
  obj.map.scrool( 1, 1 );
}
