(function(BM){'use strict';
function reward(score){return (Math.floor(Math.max(0,score)/5000)+1)*1000;}
BM.rewards={forScore:reward};
})(window.BlockMaster=window.BlockMaster||{});
