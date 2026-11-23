(function(BM){'use strict';
function createGhost(shape){
  var box=document.createElement('div'),maxX=0,maxY=0;box.className='drag-ghost piece-shape';
  shape.cells.forEach(function(p){maxX=Math.max(maxX,p[0]+1);maxY=Math.max(maxY,p[1]+1);});
  box.style.gridTemplateColumns='repeat('+maxX+',var(--drag-piece-unit))';box.style.gridTemplateRows='repeat('+maxY+',var(--drag-piece-unit))';
  var occupied={};shape.cells.forEach(function(p){occupied[p[0]+':'+p[1]]=true;});
  for(var y=0;y<maxY;y++)for(var x=0;x<maxX;x++){var cell=document.createElement('span'),has=!!occupied[x+':'+y];cell.className='piece-cell'+(has?'':' empty');if(has)cell.style.setProperty('--piece-gradient',BM.game.gradient(shape.color));box.appendChild(cell);}
  return box;
}
function init(){
  var tray=document.getElementById('piece-tray'),boardEl=document.getElementById('game-board');if(!tray||!boardEl)return;
  var drag=null,raf=0,previewCells=[],SIZE=BM.board.SIZE;
  function clearPreview(){for(var i=0;i<previewCells.length;i++)previewCells[i].classList.remove('preview-valid','preview-invalid');previewCells.length=0;}
  function boardPosition(x,y){
    var rect=boardEl.getBoundingClientRect(),cs=getComputedStyle(boardEl),border=parseFloat(cs.borderLeftWidth)||0,pad=parseFloat(cs.paddingLeft)||0,gap=parseFloat(cs.columnGap)||0;
    var left=rect.left+border+pad,top=rect.top+border+pad,contentW=rect.width-border*2-pad*2,contentH=rect.height-border*2-pad*2;
    var cellW=(contentW-gap*(SIZE-1))/SIZE,cellH=(contentH-gap*(SIZE-1))/SIZE;
    var col=Math.floor((x-left)/(cellW+gap)),row=Math.floor((y-top)/(cellH+gap));
    var inside=x>=left&&y>=top&&x<left+contentW&&y<top+contentH;
    return {row:row,col:col,inside:inside,left:left,top:top,cellW:cellW,cellH:cellH,gap:gap};
  }
  function findGrabCell(shape,slot,e){
    var grid=slot.querySelector('.piece-shape'),rect=grid.getBoundingClientRect(),cs=getComputedStyle(grid),gap=parseFloat(cs.gap)||0;
    var first=grid.querySelector('.piece-cell:not(.empty)'),unit=first?first.getBoundingClientRect().width:24,pitch=unit+gap;
    var gx=Math.floor((e.clientX-rect.left)/pitch),gy=Math.floor((e.clientY-rect.top)/pitch),found=null,best=Infinity;
    shape.cells.forEach(function(p){var d=Math.pow(p[0]-gx,2)+Math.pow(p[1]-gy,2);if(d<best){best=d;found=p;}});
    return {x:found[0],y:found[1],unit:unit,gap:gap};
  }
  function updateDrag(x,y){
    if(!drag)return;
    var pos=boardPosition(x,y),originRow=pos.row-drag.grab.y,originCol=pos.col-drag.grab.x;
    drag.pos={row:originRow,col:originCol};drag.valid=pos.inside&&BM.board.canPlace(BM.game.state.board,drag.shape,originRow,originCol);
    clearPreview();
    drag.shape.cells.forEach(function(p){var r=originRow+p[1],c=originCol+p[0];if(r>=0&&r<SIZE&&c>=0&&c<SIZE){var el=BM.game.getCell(r,c);if(el){el.classList.add(drag.valid?'preview-valid':'preview-invalid');previewCells.push(el);}}});
    var ghostUnit=drag.ghostUnit,pitch=ghostUnit+drag.ghostGap;
    drag.ghost.style.transform='translate3d('+(x-drag.grab.x*pitch-ghostUnit/2)+'px,'+(y-drag.grab.y*pitch-ghostUnit/2)+'px,0)';
  }
  tray.addEventListener('pointerdown',function(e){
    var slot=e.target.closest('.piece-slot');if(!slot||slot.classList.contains('used')||BM.game.state.animating||BM.game.state.ended)return;
    var idx=Number(slot.dataset.index),shape=BM.game.state.pieces[idx];if(!shape)return;
    e.preventDefault();var grab=findGrabCell(shape,slot,e),ghost=createGhost(shape);document.body.appendChild(ghost);
    drag={idx:idx,shape:shape,slot:slot,ghost:ghost,pointerId:e.pointerId,grab:grab,valid:false,pos:null,ghostUnit:Math.max(30,grab.unit*1.25),ghostGap:Math.max(3,grab.gap)};
    ghost.style.setProperty('--drag-piece-unit',drag.ghostUnit+'px');slot.classList.add('dragging');updateDrag(e.clientX,e.clientY);
  },{passive:false});
  window.addEventListener('pointermove',function(e){if(!drag||e.pointerId!==drag.pointerId)return;drag.x=e.clientX;drag.y=e.clientY;if(!raf)raf=requestAnimationFrame(function(){raf=0;if(drag)updateDrag(drag.x,drag.y);});},{passive:true});
  function finish(e,cancelled){if(!drag||e.pointerId!==drag.pointerId)return;if(raf){cancelAnimationFrame(raf);raf=0;}if(!cancelled)updateDrag(e.clientX,e.clientY);var current=drag;clearPreview();current.ghost.remove();current.slot.classList.remove('dragging');drag=null;if(!cancelled&&current.valid&&current.pos)BM.game.placePiece(current.idx,current.pos.row,current.pos.col);}
  window.addEventListener('pointerup',function(e){finish(e,false);});window.addEventListener('pointercancel',function(e){finish(e,true);});
}
BM.dragDrop={init:init};
})(window.BlockMaster=window.BlockMaster||{});
