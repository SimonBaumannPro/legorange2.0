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
    scale = 0.5,
    last_posX = 0,
    last_posY = 0;

module.exports.mode = mode;

var bricksize = webcom.bricksize;
//var mode = webcom.mode;

$(window).on('beforeunload', function(){
  $(window).scrollTop(0);
  $(window).scrollLeft(0);
});

  // $(document).on('swipe', function(e) {
  //   e.stopPropagation();
  //   e.preventDefault();
  // });

$(window).on("load", function (){

  $(document).foundation();

  // Initialisation globale du contexte
  globalInit();

  //drawspace scale from 2 to 1
  btn_dezoom.on('click', function(){
    var offX, offY, scale; 

    offY = ($('body').scrollTop()/4) - (window.innerHeight/2);
    offX = ($('body').scrollLeft()/4) - (window.innerWidth/2);
    // console.log("------------------");
    // console.log('offX = ' + offX);
    // console.log('offY = ' + offY);
    
    scale = 0.5;

    dezoom(offX, offY, scale);
  });
  
  $(window).resize(function() {
     //globalInit();
     // location.reload();
   });  

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
      if (e.defaultPrevented ) return;

      var handlers = {
        mousemove : function(e){
          if (e.defaultPrevented ) return;
          x=parseInt((e.pageX - drawspace.offset().left) / bricksize);
          y=parseInt((e.pageY - drawspace.offset().top) / bricksize);

          var new_move = x + "-" + y;

          // Disable brick overflow outside drawspace
          if (new_move!=last_move && e.pageX < drawspace.width() && e.pageY < (drawspace.height() + topHeight) && e.pageX > 0 && e.pageY > 0) {
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
      x=parseInt((clickX - drawspace.offset().left) / bricksize);
      y=parseInt((clickY - drawspace.offset().top) / bricksize);
      webcom.updatePos(x,y);
    } else { // (mobile device)
      if (panel.hasClass('ui-panel-open') === true) {
        if (e.defaultPrevented ) return;
        panel.panel("close");
        btn_dezoom.show();
        $('html').removeClass('hideOverflow').addClass('showOverflow');
      } else {

        // Add brick if draw mode
        if (scale === 2) {
          x=parseInt(((clickX - drawspace.offset().left) / bricksize)/2);
          y=parseInt(((clickY - drawspace.offset().top) / bricksize)/2);
          webcom.updatePos(x,y);
        }

        if (scale === 0.5) {

          last_scale = 0.5;
          scale = 2;

          var scrollX,
              scrollY,
              viewpWidth = window.innerWidth/3.5,
              viewpHeight = window.innerHeight/3.5,
              overflowX = e.clientX - viewpWidth,
              overflowY = e.clientY - viewpHeight,
              offX = $('body').scrollLeft(),
              offY = $('body').scrollTop() ;

          scrollX = (clickX + overflowX + offX)*2;
          scrollY = (clickY + overflowY + offY)*2;    


          // console.log('viewpWidth = ' + viewpWidth);
          // console.log('viewpHeight = ' + viewpHeight);
          // console.log('e.clientX = ' + e.clientX);
          // console.log('e.clientY = ' + e.clientY);
          // console.log('e.pageX = ' + e.pageX);
          // console.log('e.pageY = ' + e.pageY);
          // console.log('overflowX = ' + overflowX);
          // console.log('overflowY = ' + overflowY);
          // console.log('offX = ' + offX);
          // console.log('offY = ' + offY);

          btn_dezoom.show();

          transcale(scrollX, scrollY, scale);
        }
      }
    }
  });
 });

/* Effectue une translation et un scale sur le drawspace */
function transcale (x, y, sc) {
  drawspace.css('margin-top', topHeight);
  drawspace.css('transform', "scale(" + sc + ")");
  if (sc === 0.5) {
    $('div[data-role="main"]').height(2490);
    $('div[data-role="main"]').width(2490);
    document.querySelector('meta[name=viewport]').setAttribute('content', "width=device-width, height=device-height, initial-scale=1, user-scalable=no");
    $('body').scrollLeft(x);
    $('body').scrollTop(y);
  } else {
    $('div[data-role="main"]').height(4980);
    $('div[data-role="main"]').width(4980);
    document.querySelector('meta[name=viewport]').setAttribute('content', "width=device-width, height=device-height, initial-scale=1, user-scalable=no");
    $('body').scrollLeft(x);
    $('body').scrollTop(y);
  }
}

/* Initialisation du contexte global (interface) */
function globalInit() {

  //$('.topbar').css('height', '10vh');

  topHeight = $('.topbar').outerHeight();
  var panel = $('[data-role=panel]').height();
  var panelheight = topHeight - panel;
  var panelwidth = '330px';

  $('.ui-panel').css({
    'top': topHeight,
    'min-height' : 'none !important',
    'width': panelwidth,
    'background' : 'black',
    'text-shadow' : '0 0 0',
    'overflow' : 'auto'
  });

  $("div").removeClass('ui-panel-dismiss');
  $('a').removeClass('ui-link');

  btn_dezoom.removeClass().addClass('dezoom button');

  // = 1 si mobile, 0 sinon
  smartphone = init.detectDevice();

  btn_dezoom.hide();
  drawspace.css('margin-top', topHeight);

  var btn_menuicon = $('.menu-icon').height();
  var menutitle = $('.top-bar-title').height();
  var margin_menuicon = ($('.topbar').height() - btn_menuicon)/2;
  var margin_menutitle = ($('.topbar').height() - menutitle)/2;
  console.log(topHeight, btn_menuicon, margin_menuicon);
  $('.menu-icon').css('margin-top', margin_menuicon +'px');
  $('.top-bar-title').css('margin-top', margin_menutitle +'px');
  $('.ui-page-theme-a').css('text-shadow', '0 0 0');


  /* Disable Ctrl+mouseWheel zoom on cross-browser */
  $(window).bind('mousewheel DOMMouseScroll', function (event) {
    if (event.ctrlKey === true) {
      if (event.defaultPrevented ) return;
    }
  });

  // Initialisation of the drawspace's brick size
  initBrickSize(bricksize+"px");

  if (smartphone === 1) {
    transcale(0, 0, 0.5);
  } else {
    transcale(0, 0, 1);
    $('#overlayPanel').panel('open');
  }
}

/* Dezoom le drawspace à son état initial */
function dezoom(x, y, sc) {

  transcale(x, y, sc);

  last_scale = 2;      
  scale = 0.5;

  btn_dezoom.hide();
}

/* set the size of the drawspace's background */
function initBrickSize(size) {
  drawspace.css('background-size', size + " " + size);
}


/* Désactive le scroll quand le panel est ouvert */
btn_panel.click(function() {
  if (smartphone === 1)
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