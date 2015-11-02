
function MapEngine( renderPIXI, winRender )
{
	this.render    = renderPIXI;
	this.winRender = winRender;
}

MapEngine.prototype.setSize = function( width, height )
{
	this.width  = width;
	this.height = height;
}

MapEngine.prototype.load = function( url_config_js, url_config_tuile, callback )
{
  var obj = this;
  obj.callback = callback;
  //chargement JSON map
  $.getJSON( url_config_js, function( json )
  {
     //configuration map
      obj.config_map = json;

      //chargement texture
      obj.render.addSpritesTuiles([ url_config_tuile ],function()
      {
        obj.renderBuild();
      });
  });
}



/*-- PRIVATE --*/
MapEngine.prototype.renderBuild = function()
{
	 //configuration basic
  this.size_box   = 64;
  this.size_casse = Math.ceil( this.width/this.size_box );
  this.casse_x    = this.size_casse+2;
  this.casse_y    = this.size_casse+2;
  this.casse_nb   = this.casse_x*this.casse_y;

  console.log('Résolution render: '+this.width+' / '+this.height);
  console.log('nb_casse render: '+this.casse_x+' / '+this.casse_y+' = '+this.casse_nb);

  //creation random
  var seed = randomMM(0, 999999);
  if( this.config_map.config.seed != undefined )
    seed = this.config_map.config.seed;
  else
    this.config_map.config.seed = seed;

  //attributions du seed
  this.rand = new randomSeed( seed );
  console.log( "Seed map: "+seed );

  //creation map avec seed
  this.map        = new Cmap();
  this.map.setMap( this.config_map.config );

  //Creation casses rendu
  this.casses     = {};
  this.render_map = {};

    //posi map
  this.mapX = 0;
  this.mapY = 0;

  //build render
  var x = -1;
  var y = -1;
  for(var i=0; i < this.casse_nb; i++ )
  {
      this.casses[ i ] = new PIXI.Sprite.fromFrame("W");
      this.casses[ i ].width  = this.size_box;
      this.casses[ i ].height = this.size_box*2;

      this.casses[ i ].anchor.y = 0.5;
      this.casses[ i ].position.x      = (x*this.size_box)-this.size_box;
      this.casses[ i ].position.y      = y*this.size_box;
      this.winRender.addChild( this.casses[ i ] );

      x++;
      if( x == this.casse_x )
      {
        x = 0;
        y++;
      }
  }
  this.updateMapRender();
  this.callback();
  this.callback = undefined;
}

/* Convertit un ID venans de Cmap en la valeur id du sprite a afficher*/
MapEngine.prototype.convertIdSprite = function( id, x, y )
{
  //id default
  var ret = this.config_map.convert["default"];

  //verifie si l'ID sortit existe
  if( this.config_map.convert[ id ] != undefined )
  {
      //choisi un sprite qui sera utilisé via pour le rendu
      var ale = this.rand.rand(0, this.config_map.convert[ id ].length );
      ret = this.config_map.convert[ id ][ ale ];

      //border gestion
      if( this.config_map.border != undefined )
      {
        var i = this.config_map.border;
        for( var elem in i )
        if( i[ elem ] == ret )
          ret = this.borderModifSpe( i[ elem ], x,  y );
      }
  }
  //return l'id convertit en Texture ID
  return ret;
}

/*Met a jour le rendu de l'image*/
MapEngine.prototype.updateMapRender = function()
{
  var casse = 0;
  var p = 0;
  var x = -1;
  var y = -1;
  
  for(var i=0; i < this.casse_nb; i++ )
  {
      //verifier si la mémoire du render est libre
      casse = (this.mapX+x)+':'+(this.mapY+y);
      p = this.render_map[ casse ];
      if( p == undefined )
      {
        //Recuperais ID map et le convertir en ID Texture
        p = this.map.getCasse( this.mapX+x, this.mapY+y );
        p = this.convertIdSprite( p, this.mapX+x, this.mapY+y );
        
        //Sauvegarde de la mémoire
        this.render_map[ casse ] = p;
      }

      //Mise a jour du sprite avec la nouvelle texture
      this.casses[ i ].setTexture( PIXI.TextureCache[ p ] );

      x++;
      if( x == this.casse_x )
      {
        x = 0;
        y++;
      }
  }
}

/*Fonction de scrolling*/
MapEngine.prototype.scrool = function( x, y )
{
  var render = this.winRender;
  render.position.x += x;
  render.position.y += y;

  if( render.position.x > this.size_box )
  {
    render.position.x -= this.size_box;
    this.mapX--;
    this.updateMapRender();
  }
  
  if( render.position.y > this.size_box )
  {
    render.position.y -= this.size_box;
    this.mapY--;
    this.updateMapRender();
  }

  if( render.position.x < -this.size_box )
  {
    render.position.x += this.size_box;
    this.mapX++;
    this.updateMapRender();
  }

  if( render.position.y < -this.size_box )
  {
    render.position.y += this.size_box;
    this.mapY++;
    this.updateMapRender();
  }
}


MapEngine.prototype.borderModifSpe = function( _default, x,  y )
{
	var centre = this.map.getCasse( x  ,y  );
	var bas    = this.map.getCasse( x  ,y+1);
	var haut   = this.map.getCasse( x  ,y-1);
	var gauche = this.map.getCasse( x-1,y  );
	var droite = this.map.getCasse( x+1,y  );

  //test ile
  if( gauche == 0 )
  if( droite == 0 )
  if( haut == 0 )
  if( bas == 0 )
  if( centre != 0)
    return _default+'B_Ile';

  if( gauche != 0 )
  if( droite != 0 )
  if( haut != 0 )
  if( bas != 0 )
  if( centre == 0)
    return _default+'B_lac';
	
  //test angle fin zone
  if( gauche != 0 )
  if( droite != 0 )
  if( haut != 0 )
  if( bas == 0 )
    return _default+'B__S';

  if( gauche != 0 )
  if( droite != 0 )
  if( haut == 0 )
  if( bas != 0 )
    return _default+'B__N';

  if( gauche != 0 )
  if( droite == 0 )
  if( haut != 0 )
  if( bas != 0 )
    return _default+'B__W';

  if( gauche == 0 )
  if( droite != 0 )
  if( haut != 0 )
  if( bas != 0 )
    return _default+'B__E';


  //test si sol 2 coté
  if( gauche != 0 )
  if( droite != 0 )
  if( haut == 0 )
  if( bas == 0 )
    return _default+'B_EW';

  if( gauche == 0 )
  if( droite == 0 )
  if( haut != 0 )
  if( bas != 0 )
    return _default+'B_NS';

  //test direction
	if( bas != 0 )
  {
    if( gauche != 0 )
        return _default+'_NE';
    if( droite != 0 )
        return _default+'_NW';
    return _default+'_S';
  }

  if( haut != 0 )
  {
    if( gauche != 0 )
        return _default+'B_SW';
    if( droite != 0 )
        return _default+'B_SE';
    return _default+'_N';
  }

  if( gauche != 0 )
  {
    if( haut != 0 )
        return _default+'_SW';
    if( bas != 0 )
        return _default+'_NE';
      return _default+'_W';
  }

  if( droite != 0 )
  {
    if( haut != 0 )
        return _default+'_SE';
    if( bas != 0 )
        return _default+'_NW';
      return _default+'_E';
  }

  //default return
	return _default;
}
