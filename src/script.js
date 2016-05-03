require('./assets/styles/style.css');

$(window).load(function (){

  var elem = $(".plaquette");

  function hammerIt(elm) {
    hammertime = new Hammer(elm, {});


    var posX = 0,
      posY = 0,
      scale = 1,
      last_scale = 1,
      last_posX = 0,
      last_posY = 0,
      max_pos_x = 0,
      max_pos_y = 0,
      transform = "",
      el = elm;

    var pageX, pageY;
    var position;
    

  hammertime.on('tap pan pinch panend pinchend', function(ev) {

    if (ev.type == "tap" && scale == 1) {
      scale = 2;
      last_scale = 2;
      posX = ev.center.x * scale;
      posY = ev.center.y * scale;

      max_pos_x = Math.ceil((scale - 1) * el.clientWidth / 2);
      max_pos_y = Math.ceil((scale - 1) * el.clientHeight / 2);

      if (posX < max_pos_x*2 && posY > max_pos_y*2) {
          posX = max_pos_x;
          posY = -max_pos_y;
      } else
      if (posX < max_pos_x*2 && posY < max_pos_y*2) {
        alert("haut-gauche");
          posX = max_pos_x;
          posY = max_pos_y;
      } else
      if (posX > max_pos_x*2 && posY < max_pos_y*2) {
        alert("haut-droit");
          posX = -max_pos_x;
          posY = +max_pos_y;
      } else
      if (posX > max_pos_x*2 && posY > max_pos_y*2) {
        alert("bas-droit");
          posX = -max_pos_x;
          posY = -max_pos_y;
      }

      last_posX = posX;
      last_posY = posY;

    } 

    //pan    
    if (ev.type == "pan" && scale == 2) {
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


  // A ENLEVER
  function newPosition(clx, cly, scale) {

    /*max_pos_x = Math.ceil((scale - 1) * el.clientWidth / 2);
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
    

      var plx = elem.width(),
          ply = elem.height(),
          posx, posy;

      if (clx < plx/2) {
        posx = clx;
        if (cly < ply/2) {
          posy = cly;
        } else {
          posy = -cly;
        }
      } else {
        posx = -clx;
        if (cly < ply/2) {
          posy = cly;
        } else {
          posy = -cly;
        }
      }
      posx = posx * scale;
      posy = posy * scale;
      return {positionX: posx, positionY: posy};
      */
  }


  var offCanvas = $("#offCanvasRight");

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



// appel de la fonction permettant de gérer le zoom du pinch
hammerIt(elem[0]);

  var webcom_url=__WEBCOM_SERVER__+"/base/"+__NAMESPACE__;
  var bricks={};
  var preview_bricks={};
  var last_move="";
  var color="white";
  var mode="draw";
  var noAuth=true;
  var authData;


  /* ------------ Gestion du tactile ------------ */
      





  // Ici commence le code du "backend"
  var legobase = new Webcom(webcom_url);

  var domain="brick";
  if (m=window.location.href.match(/#(.*)$/)) {
    if (m && m[1].match(/^[A-Za-z0-9_\-]+$/)) {
      domain=m[1];
    }
  }

  // Méthode appelée pour créer/modifier/supprimer une brique à la position x,y
  function updatePos(x, y) {
    if (!authData)
      return;

    console.log(x+"-"+y);
    // On "instancie" une nouvelle brique avec comme id "x-y" (c'est plus lisible coté forge)
    var brick=legobase.child(domain+"/"+x+"-"+y);

    // On regarde si on a déjà une valeur pour cette position
    brick.once("value", function(currentData) {
      if (currentData.val() === null) {
        // il n'y avait pas encore de brique on l'ajoute avec la couleur actuellement sélectionné
        if (mode=="draw") 
          brick.set({color: color, x: x, y: y, uid: authData.uid});
      } else {
        // il y a déjà une brique à cet emplacement. 
        // En mode "erase" on supprime le bloc
        if (mode=="erase")
          brick.set(null);
        // En mode "draw" si la couleur de la brique est modifiée on averti le backend
        if (mode=="draw") // && currentData.color != color) 
          brick.set({color: color, x: x, y: y, uid: authData.uid});
      }
    });

    // Utilisation de la méthode transaction() qui permet de vérifier si une brique était déjà positionnée (élément existant)
    /*
       brick.transaction(function(currentData) {
       if (currentData === null) {
       // il n'y avait pas encore de brique on l'ajoute avec la couleur actuellement sélectionnée
       if (mode=="draw") 
       return {color: color, x: x, y: y, uid: authData.uid};
       } else {
       // il y a déjà une brique à cet emplacement. 
       // En mode "erase" on supprime le bloc
       if (mode=="erase")
       brick.remove();
       // En mode "draw" si la couleur de la brique est modifiée on averti le backend
       if (mode=="draw") // && currentData.color != color) 
       return {color: color, x: x, y: y, uid: authData.uid};
       }
       });
     */
  }

  // Callback sur changement d'une brique. Dans notre cas c'est juste la couleur qui change
  legobase.child(domain).on('child_changed', function(snapshot) {
    var brick=snapshot.val();
    bricks[brick.x+"-"+brick.y].removeClass().addClass("brick "+brick.color+" "+brick.uid.replace(":", "_"));

    preview_bricks[brick.x+"-"+brick.y].removeClass().addClass("preview_brick "+brick.color);

    if (authData && brick.uid && brick.uid == authData.uid && $("#view_my_bricks").is(":checked")) {
      bricks[brick.x+"-"+brick.y].addClass("view_owner");
    }
  q});
  
  // Callback sur l'ajout d'une nouvelle brick
  legobase.child(domain).on('child_added', function(snapshot) {
    var brick=snapshot.val();
    var brick_div=$('<div>', {class: "brick "+brick.color}).css('top', (20*brick.y)+"px").css('left', (20*brick.x)+"px");

    if (brick.uid) {
      brick_div.addClass(brick.uid.replace(":", "_"));
    }
    
    bricks[brick.x+"-"+brick.y]=brick_div;
    if (authData && brick.uid && brick.uid == authData.uid && $("#view_my_bricks").is(":checked")) {
      bricks[brick.x+"-"+brick.y].addClass("view_owner");
    }
    
    $("body").append(brick_div);

    var brick_preview=$('<div>', {class: "preview_brick "+brick.color}).css('top', (brick.y)+"px").css('left', (brick.x)+"px");
    preview_bricks[brick.x+"-"+brick.y]=brick_preview;
    $("#preview_div").append(brick_preview);

	  $("#bricks_count").html(Object.keys(bricks).length);
  });


  // Callback sur la suppression d'une brique
  legobase.child(domain).on('child_removed', function(snapshot) {

    var brick=snapshot.val();
    bricks[brick.x+"-"+brick.y].remove();
    preview_bricks[brick.x+"-"+brick.y].remove();
    delete bricks[brick.x+"-"+brick.y];
    delete preview_bricks[brick.x+"-"+brick.y];
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
    
  $("#register").click(function(){
    $("#simple_register").show();
  });
  $(".cancel").click(function(){
    $(this).parent().hide();
  });

  $("#register_submit").click(function(){
    var user_id=$("#register_user_id").val();
    var password1=$("#register_password1").val();
    var password2=$("#register_password2").val();
    if (user_id!=null && user_id.match(/\@/)) {
      if (password1!= null && password1!="" && password1.length>6) {
        if (password1==password2) {
          legobase.createUser(user_id, password1, checkAuth );
        } else {
          $("#register_error").html("Les mots de passe ne correspondent pas");
        }
      } else {
        $("#register_error").html("Mot de passe invalide (>=6 caractères)");
      }
    } else {
      $("#register_error").html("Adresse e-mail invalide");
    }
  });

  function checkAuth(error, user) {
    if (error) {
      $("#login_error").html(error);
      authData=null;
      console.log("auth error: " + error);
    } else {
      if (user) {
        console.log("auth OK: " + JSON.stringify(user));
        $("#simple_login").hide();
        authData={uid: user.uid, provider: "local", local: {displayName: user.email}};
        legobase.child("users").child(authData.uid).set(authData);
        $("#user_name").html(authData[authData.provider].displayName.replace(/@/, "<br/>@"));
        $("#connect").hide();
        $("#disconnect").show();
        $("#erase").show();
        $("#draw").show();
        $(".colors").show();
      } else {
        console.log("not authenticated");
        authData=null;
        $(".owner").removeClass("view_owner");
        $("#connect").show();
        $("#disconnect").hide();
        $("#erase").hide();
        $("#draw").hide();
        $(".colors").hide();
      }
    }
  }

  $("#login_submit").click(function(){
    var user_id=$("#user_id").val();
    var password=$("#password").val();
    if (user_id!=null && user_id.match(/\@/)) {
      if (password!= null && password!="") {
        legobase.authWithPassword({
          email : user_id,
          password : password,
          rememberMe : true
        }, checkAuth);
      } else {
        $(".login_error").html("Veuillez renseigner votre mot de passe");
      }
    } else {
      $("#login_error").html("Adresse e-mail invalide");
    }
  });
    
  $(".login").click(function(){
    var provider=$(this).attr("provider");
    if (provider=="simple") {
      $(".simple_login").show();
    } else {
      //TODO
    }        
  });

  $("#logout").click(function(){
    legobase.logout();
  });

  // Ici se termine le code du "backend".
  //Le reste sert à (mal) géré les évèvements souris/écran tactile
  $("#view_my_bricks").change(function() {
    if ($(this).is(":checked") && authData && authData.uid) {
      $("."+authData.uid.replace(":", "_")).addClass("view_owner");
    } else {
      $("."+authData.uid.replace(":", "_")).removeClass("view_owner");
    }
  });


  $(".close").click(function() {toggle_opt($(this).parent().attr("opt"))});
   
  $(".colors .brick").click(function(e) {
    $(".colors .brick").removeClass("active");
    $(this).addClass("active");
    color=$(this).attr('class').replace(/\s*(brick|active)\s*/g, '');
  });

  $(".little_button").click(function(e){
    var opt=$(this).attr("id");
    toggle_opt(opt);
  });

  function toggle_opt(opt_name) {
    var sub_button=$("#"+opt_name+" :nth-child(1)");
    if (sub_button.hasClass("fa-square-o")) {
      $("#"+opt_name+" :nth-child(1)").removeClass("fa-square-o").addClass("fa-square");
      $("#"+opt_name+" :nth-child(2)").removeClass("fa-inverse").addClass("fa-inverse");
      $("."+opt_name+"_box").show();
    } else {
      $("#"+opt_name+" :nth-child(1)").removeClass("fa-square").addClass("fa-square-o");
      $("#"+opt_name+" :nth-child(2)").removeClass("fa-inverse");
      $("."+opt_name+"_box").hide();
    }
  }
    
  $(".button").click(function(e){
    change_mode($(this).attr("id"))
  });
    
  function change_mode(new_mode) {
    mode=new_mode;
    if (mode=="draw")
      $(".colors").show();
    else
      $(".colors").hide();

    ["draw", "erase"].forEach(function(action){
      if (action == mode) {
        $("#"+action+" :nth-child(1)").removeClass("fa-square-o").addClass("fa-square");
        $("#"+action+" :nth-child(2)").removeClass("fa-inverse").addClass("fa-inverse");
      } else{
        $("#"+action+" :nth-child(1)").removeClass("fa-square").addClass("fa-square-o");
        $("#"+action+" :nth-child(2)").removeClass("fa-inverse");
      }
    });
  }

  if (! /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    toggle_opt("preview");

    $("body").on('mousedown', function(e){
  	  e.preventDefault();
      var target = $( e.target );
      var options_div=target.closest(".options");
      var position = options_div.offset() || target.offset();
      var initialized = {
        x : position.left - e.pageX,
        y : position.top - e.pageY
      };
    
  	  var handlers = {
        mousemove : function(e){
        e.preventDefault();
        if (options_div.length==0) {
          var x=parseInt(e.pageX / 20);
          var y=parseInt(e.pageY / 20);
          var new_move=x+"-"+y;
          if (new_move!=last_move) {
            updatePos(x,y);
          }
          last_move=new_move;
          } else {
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
  }

  $("body").bind("click", function(e){
	  var target = $( e.target );
    if (target.closest(".options").length==0) {
      var x=parseInt(e.pageX / 20);
      var y=parseInt(e.pageY / 20);
      updatePos(x,y);
    }
  });

  $(document).keypress(function(e) {
    if (e.which==101 || e.which==69) {
      change_mode("erase");
    }else if (e.which==100 || e.which==68) {
      change_mode("draw");
    }
  });



});