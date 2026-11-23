(function(BM){'use strict';
var ctx=null,enabled=true,volume=.55;
function init(settings){enabled=settings.sound!==false;volume=Number(settings.volume)||.55;}
function tone(freq,duration,type){if(!enabled||!window.AudioContext&&!window.webkitAudioContext)return;try{var C=window.AudioContext||window.webkitAudioContext;ctx=ctx||new C();if(ctx.state==='suspended')ctx.resume();var o=ctx.createOscillator(),g=ctx.createGain();o.type=type||'sine';o.frequency.value=freq;g.gain.setValueAtTime(.0001,ctx.currentTime);g.gain.exponentialRampToValueAtTime(Math.max(.0001,volume*.12),ctx.currentTime+.015);g.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+duration);o.connect(g);g.connect(ctx.destination);o.start();o.stop(ctx.currentTime+duration+.03);}catch(e){}}
BM.audio={init:init,setEnabled:function(v){enabled=!!v;},setVolume:function(v){volume=Math.max(0,Math.min(1,Number(v)||0));},place:function(){tone(520,.09,'triangle');},clear:function(){tone(760,.16,'sine');setTimeout(function(){tone(980,.14,'sine');},70);},gameover:function(){tone(300,.25,'triangle');},reward:function(){tone(880,.22,'sine');}};
})(window.BlockMaster=window.BlockMaster||{});
