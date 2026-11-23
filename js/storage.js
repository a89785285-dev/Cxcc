(function(BM){'use strict';
var KEY='blockMasterSaveV1';
var defaults={best:0,coins:0,settings:{sound:true,music:false,volume:.55},game:null};
function load(){try{var raw=localStorage.getItem(KEY);if(!raw)return structuredCloneSafe(defaults);var data=JSON.parse(raw);return {best:Number.isFinite(data.best)?Math.max(0,data.best):0,coins:Number.isFinite(data.coins)?Math.max(0,data.coins):0,settings:Object.assign({},defaults.settings,data.settings||{}),game:data.game&&typeof data.game==='object'?data.game:null};}catch(e){return structuredCloneSafe(defaults);}}
function structuredCloneSafe(v){return JSON.parse(JSON.stringify(v));}
var state=load();
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));return true;}catch(e){return false;}}
BM.storage={state:state,save:save,load:load,saveGame:function(game){state.game=game;save();},clearGame:function(){state.game=null;save();},setBest:function(n){if(n>state.best){state.best=n;save();return true;}return false;},setSetting:function(k,v){state.settings[k]=v;save();},addCoins:function(n){state.coins+=n;save();}};
})(window.BlockMaster=window.BlockMaster||{});
