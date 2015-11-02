function Render( width, height, color )
{
    // create an new instance of a pixi stage
    this.stage = new PIXI.Stage( color );

    // create a renderer instance.
    this.renderer = PIXI.autoDetectRenderer( width, height);

    // add the renderer view element to the DOM
    //document.body.appendChild(renderer.view);
    $('body').append( this.renderer.view );
}

/* Redimensionné le canvas */
Render.prototype.resize = function( width, height )
{
	  this.renderer.view.style.width  = width+'px';
    this.renderer.view.style.height = height+'px';
}

/* Ajouter un tuiles sprites */
Render.prototype.addSpritesTuiles = function( json, callback )
{
   loader = new PIXI.AssetLoader( json );
   loader.onComplete = callback;
   loader.load();
}

/*Rendu graphique*/
Render.prototype.draw = function()
{
  this.renderer.render( this.stage );
}