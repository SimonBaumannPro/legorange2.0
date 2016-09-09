
/* All these functions are based on webcom.js */

var main = require('../../script.js');
var ev = require('./events.js');

var webcom_url=__WEBCOM_SERVER__+"/base/"+__NAMESPACE__,
    legobase = new Webcom(webcom_url),
    bricks={},
    bricksize = 15, //parseInt($(document).width()/100),
    mode = main.mode,
    noAuth=true,
    authData ="",
    domain="brick";

    module.exports.bricksize = bricksize;

module.exports.eraseAll = function() {
	$.confirm({
    	icon: 'fa fa-warning',
    	title: 'Attention !',
    	content : 'voulez vous supprimer toutes les briques ?',
    	confirmButton: 'Oui',
    	cancelButton: 'Non',
    	confirm: function () {
    		legobase.child(domain).remove();
    	},
	});
};

// Callback sur changement d'une brique. Dans notre cas c'est juste la couleur qui change
legobase.child(domain).on('child_changed', function(snapshot) {
	var brick=snapshot.val();
	bricks[brick.x+"-"+brick.y].removeClass().addClass("brick "+brick.color+" "+brick.uid.replace(":", "_"));  
});

// Callback sur l'ajout d'une nouvelle brick
legobase.child(domain).on('child_added', function(snapshot) {
	var brick=snapshot.val();
	var brick_div;
	brick_div=$('<div>', {class: "brick "+brick.color}).css('top', (bricksize*brick.y)+"px").css('left', (bricksize*brick.x)+"px").css('width', bricksize+"px").css('height', bricksize+"px").css('background-size', bricksize+"px" + " " + bricksize+"px").css('z-index',"1");

	if (brick.uid) {
	  brick_div.addClass(brick.uid.replace(":", "_"));
	}

	bricks[brick.x+"-"+brick.y]=brick_div;

	$(".drawspace").append(brick_div);
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
	authData={uid: "anonymous", provider: "none", none: {displayName: "anonymous"}};
}

// Méthode appelée pour créer/modifier/supprimer une brique à la position x,y
module.exports.updatePos = function(x, y) {

  // On "instancie" une nouvelle brique avec comme id "x-y" (c'est plus lisible coté forge)
  var brick=legobase.child(domain+"/"+x+"-"+y);

  // On regarde si on a déjà une valeur pour cette positon
  brick.once("value", function(currentData) {
  	color = ev.color;
  	mode = main.mode;
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
};