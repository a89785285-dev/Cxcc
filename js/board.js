(function(BM){'use strict';
var SIZE=8;
function empty(){return Array.from({length:SIZE},function(){return Array(SIZE).fill(null);});}
function clone(b){return b.map(function(r){return r.slice();});}
function canPlace(board,shape,row,col){for(var i=0;i<shape.cells.length;i++){var p=shape.cells[i],r=row+p[1],c=col+p[0];if(r<0||c<0||r>=SIZE||c>=SIZE||board[r][c]!==null)return false;}return true;}
function place(board,shape,row,col,color){var next=clone(board);shape.cells.forEach(function(p){next[row+p[1]][col+p[0]]=color;});return next;}
function findCompleted(board){var rows=[],cols=[];for(var r=0;r<SIZE;r++)if(board[r].every(function(v){return v!==null;}))rows.push(r);for(var c=0;c<SIZE;c++){var full=true;for(var y=0;y<SIZE;y++)if(board[y][c]===null){full=false;break;}if(full)cols.push(c);}return {rows:rows,cols:cols};}
function clearLines(board,lines){var next=clone(board),removed={};lines.rows.forEach(function(r){for(var c=0;c<SIZE;c++)removed[r+':'+c]=true;});lines.cols.forEach(function(c){for(var r=0;r<SIZE;r++)removed[r+':'+c]=true;});Object.keys(removed).forEach(function(k){var p=k.split(':').map(Number);next[p[0]][p[1]]=null;});return {board:next,count:Object.keys(removed).length,cells:removed};}
function anyMove(board,shapes){for(var s=0;s<shapes.length;s++){if(!shapes[s])continue;for(var r=0;r<SIZE;r++)for(var c=0;c<SIZE;c++)if(canPlace(board,shapes[s],r,c))return true;}return false;}
BM.board={SIZE:SIZE,empty:empty,clone:clone,canPlace:canPlace,place:place,findCompleted:findCompleted,clearLines:clearLines,anyMove:anyMove};
})(window.BlockMaster=window.BlockMaster||{});
