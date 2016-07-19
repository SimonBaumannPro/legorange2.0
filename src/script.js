require('./assets/styles/app.scss');
require('./assets/styles/style.css');



$(window).load(function (){



  $(document).foundation();

  var drawspace = $("#drawspace");
  var btn_dezoom = document.getElementById('btn_dezoom');
  var offCanvas = $("#offCanvasRight");
  var eraseAll = $("#eraseAll");
  var brique = $(".brick");
  var bricksize = parseInt($(document).width()/100);
  var bricksizepx = bricksize+"px";
  var smartphone;

  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    console.log("smartphone");
    smartphone = 1;
  } else {
    smartphone = 0;
    $('body').css('position', 'absolute');
  }

  // $(window).resize(function() {
  //   bricksize = parseInt($(window).width()/100);
  //   location.reload();
  // });

  drawspace.css('background-size', bricksizepx + " " + bricksizepx);


  /* ------------ Gestion du tactile ------------ */

  if (smartphone == 0) {
    btn_dezoom.style.visibility = "hidden";
    btn_dezoom.style.display = "none";
  }

  function hammerIt(drawspace) {
    hammertime = new Hammer(drawspace, {});

    var posX = 0,
        posY = 0,
        scale = 1,
        last_scale = 1,
        last_posX = 0,
        last_posY = 0,
        max_pos_x = 0,
        max_pos_y = 0,
        transform = "",
        el = drawspace;

    var pageX, pageY;
    var position;
    

  hammertime.on('tap pan pinch panend pinchend', function(ev) {


    // la 2ème condition empèche le dessin continu sur le drawspace
    if (ev.type == "tap" && scale == 1 && smartphone == 1) {
      scale = 2;
      last_scale = 2;
      posX = ev.center.x * scale;
      posY = ev.center.y * scale;

      console.log("posX = " + posX + " - posY = " + posY);
      console.log("pageX = " + ev.pageX + " - pageY = " + ev.pageY);

      max_pos_x = Math.ceil((scale - 1) * el.clientWidth / 2);
      max_pos_y = Math.ceil((scale - 1) * el.clientHeight / 2);

      console.log("max_posX = " + max_pos_x + " - max_pos_y = " + max_pos_y);

      if (posX < max_pos_x*2 && posY > max_pos_y*2) {
          posX = max_pos_x;
          posY = -max_pos_y;
      } else
      if (posX < max_pos_x*2 && posY < max_pos_y*2) {
          posX = max_pos_x;
          posY = max_pos_y;
      } else
      if (posX > max_pos_x*2 && posY < max_pos_y*2) {
          posX = -max_pos_x;
          posY = +max_pos_y;
      } else
      if (posX > max_pos_x*2 && posY > max_pos_y*2) {
          posX = -max_pos_x;
          posY = -max_pos_y;
      }
      last_posX = posX;
      last_posY = posY;
    } else if (ev.type == "tap" && scale > 1 && smartphone == 1){ 
        console.log("innerWidth = " + window.innerWidth + " - innerHeight = " + window.innerHeight);
        //console.log("pageX = " + ev.pageX + " - pageY = " + ev.pageY);
        //console.log("scrollTop = " + el.scrollTop() + " - scrollLeft = " + el.scrollLeft);
  
    }  


    //pan    
    if (ev.type == "pan") {

        posX = last_posX + ev.deltaX;
        posY = last_posY + ev.deltaY;
        max_pos_x = Math.ceil((scale - 1) * el.clientWidth / 2);
        max_pos_y = Math.ceil((scale - 1) * el.clientHeight / 2);
        if (posX > max_pos_x) {
            posX = max_pos_x;
        }
        if (posX < -max_pos_x) {
            posX = -max_pos_x;
        }
        if (posY > max_pos_y) {
            posY = max_pos_y;
        }
        if (posY < -max_pos_y) {
            posY = -max_pos_y;
        }
    }

    //panend
    if (ev.type == "panend"){
        last_posX = posX < max_pos_x ? posX : max_pos_x;
        last_posY = posY < max_pos_y ? posY : max_pos_y;
    }

    if (scale == 2) {
        transform =
          "translate3d(" + posX + "px," + posY + "px, 0) " +
          "scale3d(" + scale + ", " + scale + ", 1)";
    }

    if (transform) {
        el.style.webkitTransform = transform;
    }
  });

  document.getElementById("btn_dezoom").onclick = function() {
        try {
          if (window.getComputedStyle(el, null).getPropertyValue('-webkit-transform').toString() != "matrix(1, 0, 0, 1, 0, 0)") {
               transform =
              "translate3d(0, 0, 0) " +
               "scale3d(1, 1, 1) ";
          }
        } catch (err) {}
      el.style.webkitTransform = transform;
      transform = "";
      scale = 1;
      last_scale = 1;
    }
  } 

 $(function() {      
      $("body").swipe( {
        swipeStatus:function(event, phase, direction, distance , duration , fingerCount) {
           if(phase === $.fn.swipe.phases.PHASE_END || phase === $.fn.swipe.phases.PHASE_CANCEL) {
             //The handlers below fire after the status, 
             // so we can change the text here, and it will be replaced if the handlers below fire
             $(this).find('#swipe_text').text("No swipe was made");
           }
        },
        pinchStatus:function(event, phase, direction, distance , duration , fingerCount, pinchZoom) {
          if(phase === $.fn.swipe.phases.PHASE_END || phase === $.fn.swipe.phases.PHASE_CANCEL) {
             //The handlers below fire after the status, 
             // so we can change the text here, and it will be replaced if the handlers below fire
             $(this).find('#pinch_text').text("No pinch was made");
           }
        },
        swipeLeft:function(event, direction, distance, duration, fingerCount) {
          if (fingerCount == 1 && duration < 200) {
            offCanvas.foundation("open", offCanvas);
          }        
        },
        swipeRight:function(event, direction, distance, duration, fingerCount) {
          if (fingerCount == 1) {
            offCanvas.foundation('close');
          }
        },
        pinchIn:function(event, direction, distance, duration, fingerCount, pinchZoom) {
          //alert("You pinched " +direction + " by " + distance +"px, zoom scale is "+pinchZoom); 
        },
        pinchOut:function(event, direction, distance, duration, fingerCount, pinchZoom) {
          //alert("You pinched " +direction + " by " + distance +"px, zoom scale is "+pinchZoom);
        },
        fingers:$.fn.swipe.fingers.ALL  
      });
  });


  /* Disable Ctrl+mouseWheel Zoom on cross-browser */
  $(document).keydown(function(event) {
      if (event.ctrlKey==true && (event.which == '61' || event.which == '107' || event.which == '173' || event.which == '109'  || event.which == '187'  || event.which == '189'  ) ) {
                event.preventDefault();
      }
  });
  $(window).bind('mousewheel DOMMouseScroll', function (event) {
      if (event.ctrlKey == true) {
          event.preventDefault();
      }
  });
  
// appel de la fonction permettant de gérer les évennements tactiles
hammerIt(drawspace[0]);

  var webcom_url=__WEBCOM_SERVER__+"/base/"+__NAMESPACE__;
  var bricks={};
  var last_move="";
  var color="white";
  var mode="draw";
  var noAuth=true;
  var authData;


    

  // Ici commence le code du "backend"
  var legobase = new Webcom(webcom_url);
  var domain="brick";

  if (m=window.location.href.match(/#(.*)$/)) {
    if (m && m[1].match(/^[A-Za-z0-9_\-]+$/)) {
      domain=m[1];
    }
  }

  /* Supprime toutes les briques du drawspace */
  eraseAll.click(function() {
    legobase.child(domain).remove();
  });

  // Méthode appelée pour créer/modifier/supprimer une brique à la position x,y
  function updatePos(x, y) {
    /*
    if ($("body").scale != 1) {
      console.log('ok');
       x = 20;
       y = 20;
    } */

    // On "instancie" une nouvelle brique avec comme id "x-y" (c'est plus lisible coté forge)
    var brick=legobase.child(domain+"/"+x+"-"+y);

    // On regarde si on a déjà une valeur pour cette positon
    brick.once("value", function(currentData) {
      if (currentData.val() === null) {
        // il n'y avait pas encore de brique on l'ajoute avec la couleur actuellement sélectionné
        if (mode=="draw" || mode=="eraseAll") 
          brick.set({color: color, x: x, y: y, uid: authData.uid});
      } else {
        // il y a déjà une brique à cet emplacement. 
        // En mode "erase" on supprime le bloc
        if (mode=="erase")
          brick.set(null);
        // En mode "draw" si la couleur de la brique est modifiée on averti le backend
        if (mode=="draw" || mode=="eraseAll") // && currentData.color != color) 
          brick.set({color: color, x: x, y: y, uid: authData.uid});
      }
    });
  }

  // Callback sur changement d'une brique. Dans notre cas c'est juste la couleur qui change
  legobase.child(domain).on('child_changed', function(snapshot) {
    var brick=snapshot.val();
    bricks[brick.x+"-"+brick.y].removeClass().addClass("brick "+brick.color+" "+brick.uid.replace(":", "_"));  
  });
  
  // Callback sur l'ajout d'une nouvelle brick
  legobase.child(domain).on('child_added', function(snapshot) {
    var brick=snapshot.val();
    var brick_div=$('<div>', {class: "brick "+brick.color}).css('top', (bricksize*brick.y)+"px").css('left', (bricksize*brick.x)+"px").css('width', bricksize+"px").css('height', bricksize+"px").css('background-size', bricksizepx + " " + bricksizepx);

    if (brick.uid) {
      brick_div.addClass(brick.uid.replace(":", "_"));
    }
    
    bricks[brick.x+"-"+brick.y]=brick_div;
    
    $("#drawspace").append(brick_div);
	  $("#bricks_count").html(Object.keys(bricks).length);
  }); 

  // Callback sur la suppression d'une brique
  legobase.child(domain).on('child_removed', function(snapshot) {

    var brick=snapshot.val();
    bricks[brick.x+"-"+brick.y].remove();
    delete bricks[brick.x+"-"+brick.y];
	  $("#bricks_count").html(Object.keys(bricks).length);
  });

  // Gestion de l'authentification
  if (noAuth) {
    $("#connect").hide();
    $("#disconnect").hide();
    authData={uid: "anonymous", provider: "none", none: {displayName: "anonymous"}};
  } else {
    legobase.resume(checkAuth);
  }

  // Ici se termine le code du "backend".

  /* gère la surbrillance d'une couleur active */
  $(".colors .brickMenu").click(function(e) {
    $(".colors .brickMenu").removeClass("active");
    $(this).addClass("active");
    color=$(this).attr('class').replace(/\s*(brick|active)\s*/g, '');
  });
  
  /* empèche l'affichage des couleurs lors du déroulement de la liste si on est en mode "erase" */
  $("#titleDT").click(function() {
    if (mode == "erase") {
      $(".ul-drawTools").attr("style", "height: 100px");
      $(".drawTools-buttons-container").css("height", "100%");
      $(".color-list").hide();
    }
  });

  $(".button").click(function(e){
    change_mode($(this).attr("id"))
  });
    
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


    drawspace.on('mousedown', function(e){
  	  e.preventDefault();
      var target = $( e.target );
      var options_div=target.closest(".options");
      var position = options_div.offset() || target.offset();
      var initialized = {
        x :  e.pageX,
        y :  e.pageY
      };
    
  	  var handlers = {
        mousemove : function(e){
          e.preventDefault();
          if (options_div.length==0) {
            x=parseInt(e.pageX / bricksize);
            y=parseInt(e.pageY / bricksize);
            var new_move=x+"-"+y;
            // Disable brick overflow outside drawspace
            if (new_move!=last_move && e.pageX < drawspace.width() && e.pageY < drawspace.height()) {
              updatePos(x,y);
            }
            last_move=new_move;
          } else {
            alert('lala');
             options_div.css({
              left : ( initialized.x + e.pageX - $(document).scrollLeft() ) + 'px',
              top : ( initialized.y + e.pageY - $(document).scrollTop() ) + 'px',
              bottom: 'inherit',
              right: 'inherit',
             });
          }
        },
        mouseup : function(e){
          $(this).off(handlers);   
        }
      };
      $(document).on(handlers);
    });

  /* Gère le click simple (ajout/suppression de briques) sur le drawspace  */
  $("#drawspace").bind("click", function(e){
    console.log("offsetTop = " + drawspace.offset().top + " - offsetLeft = " + drawspace.offset().left);
    console.log("Pagex = " + e.pageX + " - Pagey = "+ e.pageY);
	  var target = $( e.target );
    var x,y;
      // le 2 fait référence au zoom
      if (smartphone == 1) {
        x=parseInt(((e.pageX - drawspace.offset().left) / bricksize)/2);
        y=parseInt(((e.pageY - drawspace.offset().top) / bricksize)/2);
        console.log("x = " + x + " - y = "+ y);
      } else {
        x=parseInt(e.pageX / bricksize);
        y=parseInt(e.pageY / bricksize);
      }
      updatePos(x,y);
  });

  var leftPos;
  $("#buttonToggle").click(function() {
     if (smartphone == 0) {
      if (!offCanvas.hasClass("is-open")) {
        leftPos = $('body').scrollLeft();
        $("body").animate({scrollLeft: leftPos + 300}, 800);
      } else {
        $("body").animate({scrollLeft: leftPos - 300}, 800);
      }
    }
  });
});


