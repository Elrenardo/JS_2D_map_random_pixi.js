$(document).ready(function()
{
    //création controler
    var GC = new GameControler( $(window).width(), $(window).height(), 0x66FF99 );
    GC.init();

    //boucle animation
    function render()
    {
        requestAnimFrame( render );
        GC.loopRender();
    }
    requestAnimFrame( render );

    //redimension de l'ecran
    /*$( window ).resize(function()
    {
      GC.resizeCanvas( $(window).width(), $(window).height() );
    });*/
});