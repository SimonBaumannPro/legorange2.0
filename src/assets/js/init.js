var main   = require('../../script.js'),
	webcom = require('./webcom_fct.js');


var size; // ici la taille des briques


/* Détecte si l'application est utilisé sur mobile/tablettes ou PC */
module.exports.detectDevice = function() {
  if( !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent.toLowerCase()) ) {
    $('body').css('position', 'absolute');
    //offCanvas.addClass('reveal-for-large');
    //$('#btn_panel').hide();
    return 0;
  } else {
    return 1;
  }
};