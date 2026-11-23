(function(BM){'use strict';
function init(){var modal=document.getElementById('settings-modal'),homeBtn=document.getElementById('settings-btn'),gameBtn=document.getElementById('game-settings-btn'),resume=document.getElementById('resume-btn'),goHome=document.getElementById('home-btn'),sound=document.getElementById('sound-toggle'),music=document.getElementById('music-toggle'),volume=document.getElementById('volume-control');
function open(){modal.hidden=false;}function close(){modal.hidden=true;}
[homeBtn,gameBtn].forEach(function(b){if(b)b.addEventListener('click',open);});resume.addEventListener('click',close);
goHome.addEventListener('click',function(){close();BM.game.pause(false);window.location.hash='home';});
sound.checked=BM.storage.state.settings.sound!==false;music.checked=!!BM.storage.state.settings.music;volume.value=BM.storage.state.settings.volume;
sound.addEventListener('change',function(){BM.storage.setSetting('sound',sound.checked);BM.audio.setEnabled(sound.checked);});
music.addEventListener('change',function(){BM.storage.setSetting('music',music.checked);});
volume.addEventListener('input',function(){BM.storage.setSetting('volume',Number(volume.value));BM.audio.setVolume(volume.value);});
modal.addEventListener('click',function(e){if(e.target===modal)close();});
}
BM.settings={init:init};
})(window.BlockMaster=window.BlockMaster||{});
