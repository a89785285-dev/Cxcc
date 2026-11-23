(function(BM){'use strict';
function placement(count){return count*5;}
function clearBonus(lines){var n=lines.rows.length+lines.cols.length;if(!n)return 0;var values=[0,100,250,450,700,1000];return values[Math.min(n,5)];}
BM.scoring={placement:placement,clearBonus:clearBonus};
})(window.BlockMaster=window.BlockMaster||{});
