var main   = require('../../script.js'),
	webcom = require('./webcom_fct.js');


var size; // ici la taille des briques
var is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
var is_android = navigator.platform.toLowerCase().indexOf("android") > -1;
var is_mobile = window.matchMedia("only screen and (max-width: 775px)").matches;
var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent.toLowerCase());

if (is_firefox) console.log('is_firefox');
if (is_android) console.log('is_android');
if (is_mobile) console.log('is_mobile');
if (isMobile) console.log('isMobile');


  

if (navigator.appName == 'Microsoft Internet Explorer' ||  !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/rv 11/)))
{
  console.log("IE");
  $(".colors").css('padding-top','22px');
}

/* Détecte si l'application est utilisé sur mobile/tablettes ou PC */
module.exports.detectDevice = function() {
  if (is_mobile || (isMobile && is_firefox)) {
    //$('body').css('position', 'absolute');
    //$('body').css('overflow', 'auto');
    //offCanvas.addClass('reveal-for-large');
    //$('#btn_panel').hide();
    $('.dezoom').css('background-color','none');
console.log('mobile');
    return 1;
  } else {

    $('#DT').attr('aria-expanded', 'true');
    $('.ul-drawTools').css('display', 'block');
    console.log('PC'); 
    return 0;
  }
};