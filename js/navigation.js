/* Screen navigation: keep hash/back-button behavior from phase 1. */
(function(BM){'use strict';
var screens={},isNavigating=false;
function read(){var name=location.hash.replace('#','');return screens[name]?name:'home';}
function show(name){Object.keys(screens).forEach(function(k){var active=k===name,el=screens[k];el.classList.toggle('is-active',active);el.setAttribute('aria-hidden',active?'false':'true');el.inert=!active;});document.body.dataset.screen=name;isNavigating=false;}
function route(){show(read());}
function init(){screens.home=document.getElementById('screen-home');screens.game=document.getElementById('screen-game');var btn=document.getElementById('classic-btn');if(!screens.home||!screens.game||!btn)return;btn.addEventListener('click',function(){if(isNavigating)return;isNavigating=true;btn.classList.add('is-pressed');setTimeout(function(){btn.classList.remove('is-pressed');location.hash='game';if(location.hash==='#game')route();},160);});window.addEventListener('hashchange',route);route();}
BM.navigation={init:init,show:function(name){if(screens[name])show(name);}};
})(window.BlockMaster=window.BlockMaster||{});
