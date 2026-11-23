(function(BM){'use strict';
var state={board:BM.board.empty(),pieces:[],score:0,ended:false,rewarded:false};
var boardEl, trayEl, scoreEl,bestEl,messageEl;
function fmt(n){return Math.floor(n).toLocaleString('en-US');}
function gradient(color){var map={yellow:'linear-gradient(145deg,#fff1a6,#ffc83a 55%,#c98a00)',orange:'linear-gradient(145deg,#ffc49a,#ff8a3d 55%,#c9500c)',sky:'linear-gradient(145deg,#cdf1ff,#4fc3f7 55%,#1a72b5)',purple:'linear-gradient(145deg,#e0cfff,#a06bf0 55%,#5a2cae)',green:'linear-gradient(145deg,#c8f8dc,#4fd68a 55%,#1e8a4f)',pink:'linear-gradient(145deg,#ffcbe6,#ff6fb0 55%,#bd2b78)'};return map[color]||map.yellow;}
function renderBoard(){boardEl.innerHTML='';for(var r=0;r<10;r++)for(var c=0;c<10;c++){var cell=document.createElement('div');cell.className='board-cell'+(state.board[r][c]?' filled':'');cell.dataset.row=r;cell.dataset.col=c;if(state.board[r][c])cell.style.setProperty('--cell-gradient',gradient(state.board[r][c]));cell.setAttribute('role','gridcell');boardEl.appendChild(cell);}}
function renderPieces(){trayEl.innerHTML='';state.pieces.forEach(function(shape,index){var slot=document.createElement('div');slot.className='piece-slot'+(!shape?' used':'');slot.dataset.index=index;if(shape){var w=Math.max.apply(null,shape.cells.map(function(p){return p[0];}))+1,h=Math.max.apply(null,shape.cells.map(function(p){return p[1];}))+1,grid=document.createElement('div');grid.className='piece-shape';grid.style.gridTemplateColumns='repeat('+w+',auto)';for(var y=0;y<h;y++)for(var x=0;x<w;x++){var el=document.createElement('span'),has=shape.cells.some(function(p){return p[0]===x&&p[1]===y;});el.className='piece-cell'+(has?'':' empty');if(has)el.style.setProperty('--piece-gradient',gradient(shape.color));grid.appendChild(el);}slot.appendChild(grid);}trayEl.appendChild(slot);});}
function updateStats(){scoreEl.textContent=fmt(state.score);bestEl.textContent=fmt(BM.storage.state.best);}
function save(){BM.storage.saveGame({board:state.board,score:state.score,pieces:state.pieces,ended:state.ended,rewarded:state.rewarded});}
function newRound(){state={board:BM.board.empty(),pieces:[],score:0,ended:false,rewarded:false};state.pieces=BM.pieces.generate(state.board);render();save();document.getElementById('gameover-modal').hidden=true;}
function render(){renderBoard();renderPieces();updateStats();}
function showMessage(text){messageEl.textContent=text;messageEl.classList.remove('show');void messageEl.offsetWidth;messageEl.classList.add('show');}
function placePiece(index,row,col){
  if(state.ended||state.animating)return;
  var shape=state.pieces[index];
  if(!shape||!BM.board.canPlace(state.board,shape,row,col))return;
  state.board=BM.board.place(state.board,shape,row,col,shape.color);
  state.score+=BM.scoring.placement(shape.cells.length);
  state.pieces[index]=null;
  BM.audio.place();
  var lines=BM.board.findCompleted(state.board);
  var hasClear=lines.rows.length>0||lines.cols.length>0;
  if(hasClear){
    var count=lines.rows.length+lines.cols.length;
    var clearing=[];
    lines.rows.forEach(function(r){for(var c=0;c<10;c++)clearing.push(boardEl.querySelector('[data-row="'+r+'"][data-col="'+c+'"]'));});
    lines.cols.forEach(function(c){for(var r=0;r<10;r++)clearing.push(boardEl.querySelector('[data-row="'+r+'"][data-col="'+c+'"]'));});
    clearing.forEach(function(el){if(el)el.classList.add('clearing');});
    state.board=BM.board.clearLines(state.board,lines).board;
    state.score+=BM.scoring.clearBonus(lines);
    if(count>1)state.score+=50*(count-1);
    state.animating=true;
    BM.audio.clear();
    showMessage(count>1?'COMBO x'+count:'NICE!');
  }
  var isBest=BM.storage.setBest(state.score);
  if(isBest)showMessage('NEW BEST!');
  if(state.pieces.every(function(p){return p===null;}))state.pieces=BM.pieces.generate(state.board);
  if(hasClear){
    renderPieces();
    updateStats();
    save();
    window.setTimeout(function(){
      state.animating=false;
      renderBoard();
      updateStats();
      save();
      if(!BM.board.anyMove(state.board,state.pieces))endRound();
    },300);
  }else{
    render();
    save();
    if(!BM.board.anyMove(state.board,state.pieces))endRound();
  }
}
function endRound(){if(state.ended)return;state.ended=true;var reward=BM.rewards.forScore(state.score);if(!state.rewarded){BM.storage.addCoins(reward);state.rewarded=true;}BM.storage.clearGame();BM.storage.setBest(state.score);document.getElementById('final-score').textContent=fmt(state.score);document.getElementById('final-best').textContent=fmt(BM.storage.state.best);document.getElementById('final-reward').textContent='+'+fmt(reward);document.getElementById('gameover-modal').hidden=false;BM.audio.gameover();}
function pause(){document.getElementById('settings-modal').hidden=false;}
function restore(){var saved=BM.storage.state.game;if(saved&&Array.isArray(saved.board)&&saved.board.length===10&&Array.isArray(saved.pieces)){state={board:saved.board,score:Number(saved.score)||0,pieces:saved.pieces,ended:false,rewarded:false};if(state.pieces.length!==3)state.pieces=BM.pieces.generate(state.board);}else newRound();render();}
function init(){boardEl=document.getElementById('game-board');trayEl=document.getElementById('piece-tray');scoreEl=document.getElementById('score-value');bestEl=document.getElementById('best-value');messageEl=document.getElementById('board-message');restore();document.getElementById('retry-btn').addEventListener('click',newRound);document.getElementById('result-home-btn').addEventListener('click',function(){document.getElementById('gameover-modal').hidden=true;window.location.hash='home';});}
BM.game={init:init,newRound:newRound,placePiece:placePiece,gradient:gradient,pause:function(){}};Object.defineProperty(BM.game,'state',{get:function(){return state;}});
})(window.BlockMaster=window.BlockMaster||{});
