

// https://io.datasync.orange.com/samples/legorange/


require('./assets/styles/app.scss');
require('./assets/styles/style.css');
//require('./assets/js/webcom_fct.js');

var webcom = require('./assets/js/webcom_fct.js');


var drawspace = $(".drawspace"),
    btn_dezoom = document.getElementById('btn_dezoom'),
    offCanvas = $("#offCanvasRight"),
    eraseAll = $("#eraseAll"),
    last_move="",
    smartphone,
    last_scale,
    scale = 1,
    last_posX = 0,
    last_posY = 0;

var bricksize = webcom.bricksize;


$(window).on("load", function (){
  $(document).foundation();

// $('.drawspace').draggable({
//   containment : $('.conteneur'),
//   scroll : true
// });

  viewpwidth = $(window).width();
  viewpheight = $(window).height(); 

  // $('.conteneur').css('width', (drawspace.width()*2)- viewpwidth);
  // $('.conteneur').css('height', (drawspace.height()*2)- viewpheight);
  // $('.conteneur').css('left', -(drawspace.width() - viewpwidth));
  // $('.conteneur').css('top', -(drawspace.height() - viewpheight));

  // drawspace.css('top', drawspace.height() - viewpheight);
  // drawspace.css('left', drawspace.width() - viewpwidth);


// console.log('offtop = ' + drawspace.width() + ' - offleft = ' + viewpwidth);


  // Initialisation globale du contexte
  globalInit();

  // Gestion des évenements tactiles (pan & zoom)
   //hammerIt(drawspace[0]);

  //drawspace scale from 2 to 1
  btn_dezoom.onclick = function(){
    console.log('btn dezoom clicked');
    dezoom();
  };
  
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
  //         offCanvas.foundation("open", offCanvas);
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
    eraseAll();
  });

  drawspace.on('mousedown', function(e){
    if (smartphone === 0) {
      e.preventDefault();

      var handlers = {
        mousemove : function(e){
          e.preventDefault();
          x=parseInt(e.pageX / bricksize);
          y=parseInt(e.pageY / bricksize);
          var new_move=x+"-"+y;

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
    console.log("x = " + e.pageX + " - y = " + e.pageY);
    if (smartphone === 0) {
      x=parseInt(e.pageX / bricksize);
      y=parseInt(e.pageY / bricksize);
      webcom.updatePos(x,y);
    }

    // Ajout des briques si smartphone mode draw
    if (smartphone === 1 && scale === 2) {
      x=parseInt(((e.pageX - drawspace.offset().left) / bricksize)/2);
      y=parseInt(((e.pageY - drawspace.offset().top) / bricksize)/2);
      webcom.updatePos(x,y);
    }

    if (smartphone === 1 && scale === 1) {
      
      btn_dezoom.style.visibility = "visible";
      btn_dezoom.style.display = "inline";

      last_scale = 1;
      scale = 2;

      var offX = drawspace.offset().left*scale ;
      var offY = drawspace.offset().top*scale ;

      var iniMouseX = e.pageX/2 + offX;     // mouse position at zoom scale 1
      var iniMouseY = e.pageY/2 + offY;

      var newMouseX = iniMouseX * scale;      // mouse position at new scale
      var newMouseY = iniMouseY * scale;
      
      posX = iniMouseX;
      posY = iniMouseY;

      last_posX = posX;
      last_posY = posY;

      // max_pos_x =  drawspace.clientWidth - window.innerWidth;
      // max_pos_y =  drawspace.clientHeight - window.innerHeight;

      transcale(posX, posY, scale);
    }
  });
 });

/* Effectue une translation et un scale sur le drawspace */
function transcale (x, y, sc) {

  var transform = "";

  transform = "scale(" + sc + ")";
  
  $('body').scrollLeft(x);
  $('body').scrollTop(y);
  drawspace.css('transform', transform);

  console.log(x + " - " + y + " - " + sc);
  transform = " ";
}


function globalInit() {

  // = 1 si mobile, 0 sinon
  smartphone = detectDevice();

  /* hide dezoom button */
  if (smartphone === 0 || (smartphone == 1 && scale == 1)) {
     btn_dezoom.style.visibility = "hidden";
     btn_dezoom.style.display = "none";
  }

  /* Disable Ctrl+mouseWheel zoom on cross-browser */
  $(window).bind('mousewheel DOMMouseScroll', function (event) {
    if (event.ctrlKey === true) {
      event.preventDefault();
    }
  });

  // Initialisation of the drawspace's brick size
  initBrickSize(bricksize+"px");

  if ($('body').height > $("body").height) {
    //TODO : remove the white space outside the drawspace
  }
}


/* Dezoom le drawspace à son état initial */
function dezoom() {
  console.log('fct dezoom triggered');
  //transcale(0, 0, 1);

  drawspace.css('transform', 'none');

  last_scale = 2;      
  scale = 1;

  btn_dezoom.style.visibility = "hidden";
  btn_dezoom.style.display = "none";
}

/* set the size of the drawspace's background */
function initBrickSize(size) {
  drawspace.css('background-size', size + " " + size);
}

/* ------------ Gestion du tactile ------------ */

function hammerIt(pDrawspace) {

  hammertime = new Hammer(pDrawspace, {});

  var posX = 0,
      posY = 0,
      
      max_pos_x = 0,
      max_pos_y = 0,
      min_pos = 0,
      transform = "",
      ds = pDrawspace;

  // Tap to zoom
  hammertime.on('tap', function(ev) {
alert('lol');
    // Ajout des briques si smartphone
    if (scale == 2 && smartphone == 1) {
      var x,y;
      x=parseInt(((ev.center.x - drawspace.offset().left) / bricksize)/2);
      y=parseInt(((ev.center.y- drawspace.offset().top) / bricksize)/2);
      webcom.updatePos(x,y);
    }

    if (scale == 2 && smartphone == 1) {
      
      btn_dezoom.style.visibility = "visible";
      btn_dezoom.style.display = "inline";

      last_scale = 1;
      scale = 2;

      var offX = drawspace.offset().left*scale ;
      var offY = drawspace.offset().top*scale ;

      var iniMouseX = ev.center.x - offX;     // mouse position at zoom scale 1
      var iniMouseY = ev.center.y - offY;

      var newMouseX = iniMouseX * scale;      // mouse position at new scale
      var newMouseY = iniMouseY * scale;
      
      posX = (iniMouseX - newMouseX) ;
      posY = (iniMouseY - newMouseY) ;

      last_posX = posX;
      last_posY = posY;

      max_pos_x =  ds.clientWidth - window.innerWidth;
      max_pos_y =  ds.clientHeight - window.innerHeight;
    }

    
    transcale(posX, posY, scale);
  }); 
}



/* Détecte si l'application est utilisé sur mobile/tablettes ou PC */
function detectDevice() {
  if( !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    $('body').css('position', 'absolute');
    //offCanvas.addClass('reveal-for-large');
    //$('.container-titlebar-menu').css('display', 'none');
    return 0;
  } else {
    return 1;
  }
}


/* ------------ Gestion de l'affichage de l'off-canvas ------------ */

/* gère la surbrillance d'une couleur active */
$(".colors .brickMenu").click(function(e) {
  $(".colors .brickMenu").removeClass("active");
  $(this).addClass("active");
  color=$(this).attr('class').replace(/\s*(brick|active)\s*/g, '');
});

/* empèche l'affichage des couleurs lors du déroulement de la liste si on est en mode "erase" */
$("#menu-DT").click(function() {
  if (mode == "erase") {
    $(".ul-drawTools").attr("style", "height: 100px");
    $(".drawTools-buttons-container").css("height", "100%");
    $(".color-list").hide();
  }
});

$(".button").click(function(e){
  change_mode($(this).attr("id"));
});

/* Manage the display mode in the off-canvas menue */
function change_mode(new_mode) {
  mode=new_mode;
  if (mode=="draw" || mode=="eraseAll") {
    $(".ul-drawTools").attr("style", "height: 200px");
    $(".drawTools-buttons-container").css("height", "50%");
    $("#erase"+" :nth-child(1)").removeClass("fa-square").addClass("fa-square-o");
    $("#draw"+" :nth-child(1)").removeClass("fa-square-o").addClass("fa-square");
    $(".color-container").show();
  }
  else {
    $(".ul-drawTools").attr("style", "height: 100px");
    $(".drawTools-buttons-container").css("height", "100%");
    $("#erase"+" :nth-child(1)").removeClass("fa-square-o").addClass("fa-square");
    $("#draw"+" :nth-child(1)").removeClass("fa-square").addClass("fa-square-o");
    $(".color-list").hide();      
  }
}