(function(BM){'use strict';
function boot(){if(BM.animations)BM.animations.init();if(BM.navigation)BM.navigation.init();if(BM.audio)BM.audio.init(BM.storage.state.settings);if(BM.game)BM.game.init();if(BM.dragDrop)BM.dragDrop.init();if(BM.settings)BM.settings.init();if('serviceWorker'in navigator&&location.protocol.indexOf('http')===0){navigator.serviceWorker.register('service-worker.js').catch(function(){});}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})(window.BlockMaster=window.BlockMaster||{});
