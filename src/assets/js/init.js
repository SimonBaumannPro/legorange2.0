var main   = require('../../script.js'),
	webcom = require('./webcom_fct.js');


var size; // ici la taille des briques
var is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
var is_android = navigator.platform.toLowerCase().indexOf("android") > -1;
var is_mobile = window.matchMedia("only screen and (max-width: 775px)");
var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent.toLowerCase());

/* Détecte si l'application est utilisé sur mobile/tablettes ou PC */
module.exports.detectDevice = function() {
  if((is_mobile && isMobile) || ((navigator.userAgent.toLowerCase().indexOf('firefox') > -1) && is_mobile)) {
    //$('body').css('position', 'absolute');
    //$('body').css('overflow', 'auto');
    //offCanvas.addClass('reveal-for-large');
    //$('#btn_panel').hide();
console.log('mobile');
    return 1;
  } else {
    console.log('PC');
    return 0;
  }
};