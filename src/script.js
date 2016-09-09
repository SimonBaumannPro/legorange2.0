/*                ORIGINAL WebApp
 https://io.datasync.orange.com/samples/legorange/ */


require('./assets/styles/app.scss');
require('./assets/styles/style.css');

var webcom = require('./assets/js/webcom_fct.js'),
    init   = require('./assets/js/init.js'),
    ev     = require('./assets/js/events.js');
    

var drawspace = $(".drawspace"),
    btn_dezoom = $("#btn_dezoom"),
    eraseAll = $("#eraseAll"),
    btn_panel = $('#btn_panel'),
    panel = $('#overlayPanel'),
    mode = "draw",
    topHeight,
    last_move="",
    smartphone,
    last_scale,
    scale = 1,
    last_posX = 0,
    last_posY = 0;

module.exports.mode = mode;

var bricksize = webcom.bricksize;
//var mode = webcom.mode;

$(window).on('beforeunload', function(){
  $(window).scrollTop(0);
  $(window).scrollLeft(0);
});

$(window).on("load", function (){

  $(document).foundation();

  // Initialisation globale du contexte
  globalInit();

  //drawspace scale from 2 to 1
  btn_dezoom.on('click', function(){
    var offX, offY, scale; 

    offY = $('body').scrollTop();
    offX = $('body').scrollLeft();
    
    scale = 0.5;

    dezoom(offX, offY, scale);
  });
  
  // $(window).resize(function() {
  //    globalInit();
  //    bricksize = parseInt($(window).width()/100);
  //    location.reload();
  //  });  

  // $(function() {
  //   $("body").swipe( {
  //     swipeStatus:function(event, phase, direction, distance , duration , fingerCount) {
  //       if(phase === $.fn.swipe.phases.PHASE_END || phase === $.fn.swipe.phases.PHASE_CANCEL) {
  //         //The handlers below fire after the status, 
  //         // so we can change the text here, and it will be replaced if the handlers below fire
  //         $(this).find('#swipe_text').text("No swipe was made");
  //       }
  //     },
  //     swipeLeft:function(event, direction, distance, duration, fingerCount) {
  //       if (fingerCount == 1 && duration < 250) {
  //         console.log("swipeLeft");
  //         panel.open();
  //       }        
  //     },
  //     swipeRight:function(event, direction, distance, duration, fingerCount) {
  //       if (fingerCount == 1) {
  //         offCanvas.foundation('close');
  //       }
  //     },
  //     fingers:$.fn.swipe.fingers.ALL
  //   });
  // });

  /* Supprime toutes les briques du drawspace */
  eraseAll.click(function() {
    webcom.eraseAll();
  });


  

  drawspace.on('mousedown', function(e){
    if (smartphone === 0) {
      e.preventDefault();

      var handlers = {
        mousemove : function(e){
          e.preventDefault();
          x=parseInt(e.pageX / bricksize);
          y=parseInt((e.pageY - topHeight) / bricksize);

          var new_move = x + "-" + y;

          // Disable brick overflow outside drawspace
          if (new_move!=last_move && e.pageX < drawspace.width() && e.pageY < drawspace.height() && e.pageX > 0 && e.pageY > 0) {
            webcom.updatePos(x,y);
          }
          last_move=new_move;
        },
        mouseup : function(e){
          $(this).off(handlers);   
        }
      };
      $(document).on(handlers);
    }
  });

  /* Gère le click simple (ajout/suppression de briques) sur le drawspace  */
  drawspace.bind("click", function(e){
    var x,y;
    var clickX = e.pageX;
    var clickY = e.pageY; // we remove the top-bar height

    // (if no mobile device)
    if (smartphone === 0) {
      x=parseInt(clickX / bricksize);
      y=parseInt((clickY - topHeight) / bricksize);
      webcom.updatePos(x,y);
    } else { // (mobile device)

      if (panel.hasClass('ui-panel-open') === true) {
        e.preventDefault();
        panel.panel("close");
        $('html').removeClass('hideOverflow').addClass('showOverflow');
      } else {

        // Add brick if draw mode
        if (scale === 2) {
          x=parseInt(((clickX - drawspace.offset().left) / bricksize)/2);
          y=parseInt(((clickY - drawspace.offset().top) / bricksize)/2);
          webcom.updatePos(x,y);
        }

        if (scale === 1) {

          last_scale = 1;
          scale = 2;

          var scrollX,
              scrollY,
              viewpWidth = window.innerWidth/2,
              viewpHeight = window.innerHeight/2,
              overflowX = e.clientX - viewpWidth,
              overflowY = e.clientY - viewpHeight;
              offX = $('body').scrollLeft() ;
              offY = $('body').scrollTop() ;

          scrollX = clickX + overflowX + offX;     // mouse position at zoom scale 1
          scrollY = clickY + overflowY + offY;    

          btn_dezoom.show();

          transcale(scrollX, scrollY, scale);
        }
      }
    }
  });
 });

/* Effectue une translation et un scale sur le drawspace */
function transcale (x, y, sc) {
  $('body').scrollLeft(x);
  $('body').scrollTop(y);
  //drawspace.css('margin-top', topHeight);
  drawspace.css('transform', "scale(" + sc + ")");
  if (sc === 0.5) {
    $('div[data-role="main"]').height(2500);
    $('div[data-role="main"]').width(2500);
    document.querySelector('meta[name=viewport]').setAttribute('content', "width=2500, height=device-height, initial-scale=1, user-scalable=no");
  } else {
    $('div[data-role="main"]').height(5000);
    $('div[data-role="main"]').width(5000);
    document.querySelector('meta[name=viewport]').setAttribute('content', "width=5000, height=device-height, initial-scale=1, user-scalable=no");
  }
}

/* Initialisation du contexte global (interface) */
function globalInit() {

  topHeight = $('.topbar').outerHeight();
  var panel = $('[data-role=panel]').height();
  var panelheight = topHeight - panel;
  var panelwidth = '330px';

  $('.ui-panel').css({
    'top': topHeight,
    'min-height': panelheight,
    'width': panelwidth,
    'background' : 'black',
    'text-shadow' : '0 0 0'
  });

  $("div").removeClass('ui-panel-dismiss');
  $('a').removeClass('ui-link');

  btn_dezoom.removeClass().addClass('dezoom button');

  // = 1 si mobile, 0 sinon
  smartphone = init.detectDevice();

  btn_dezoom.hide();
  drawspace.css('margin-top', topHeight);

  /* Disable Ctrl+mouseWheel zoom on cross-browser */
  $(window).bind('mousewheel DOMMouseScroll', function (event) {
    if (event.ctrlKey === true) {
      event.preventDefault();
    }
  });

  // Initialisation of the drawspace's brick size
  initBrickSize(bricksize+"px");


  transcale(0, 0, 0.5);
}

/* Dezoom le drawspace à son état initial */
function dezoom(x, y, sc) {

  transcale(x, y, sc);

  last_scale = 2;      
  scale = 1;

  btn_dezoom.hide();
}

/* set the size of the drawspace's background */
function initBrickSize(size) {
  drawspace.css('background-size', size + " " + size);
}


/* Désactive le scroll quand le panel est ouvert */
btn_panel.click(function() {
  ev.disableScroll(scale);
});

/* gère la surbrillance d'une couleur active */
$(".brickMenu").click(function() {
  ev.color_active($(this));
});

/* empèche l'affichage des couleurs lors du déroulement de la liste si on est en mode "erase" */
$("#menu-DT").click(ev.hide_colors());

$('.menu-title').click(function() {
  $('#menu-DT').css('color','#ff7900');
});

$(".mode").click(function(e){
  module.exports.mode = ev.change_mode($(this).attr("id"));
});