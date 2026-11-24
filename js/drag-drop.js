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
  function measureBoard(){
    var rect=boardEl.getBoundingClientRect(),cs=getComputedStyle(boardEl),border=parseFloat(cs.borderLeftWidth)||0,pad=parseFloat(cs.paddingLeft)||0,gap=parseFloat(cs.columnGap)||0;
    var left=rect.left+border+pad,top=rect.top+border+pad,contentW=rect.width-border*2-pad*2,contentH=rect.height-border*2-pad*2;
    return {left:left,top:top,contentW:contentW,contentH:contentH,cellW:(contentW-gap*(SIZE-1))/SIZE,cellH:(contentH-gap*(SIZE-1))/SIZE,gap:gap};
  }
  function boardPosition(x,y,m){
    var col=Math.floor((x-m.left)/(m.cellW+m.gap)),row=Math.floor((y-m.top)/(m.cellH+m.gap));
    return {row:row,col:col,inside:x>=m.left&&y>=m.top&&x<m.left+m.contentW&&y<m.top+m.contentH};
  }
  function clearPreview(){
    for(var i=0;i<previewCells.length;i++)previewCells[i].classList.remove('preview-valid','preview-invalid');
    previewCells.length=0;
  }
  function updatePreview(row,col,valid){
    var next=[],nextSet=Object.create(null),className=valid?'preview-valid':'preview-invalid';
    drag.shape.cells.forEach(function(p){
      var r=row+p[1],c=col+p[0];
      if(r>=0&&r<SIZE&&c>=0&&c<SIZE){
        var el=BM.game.getCell(r,c);
        if(el){next.push(el);nextSet[r*SIZE+c]=true;}
      }
    });
    for(var i=0;i<previewCells.length;i++){
      var old=previewCells[i],key=Number(old.dataset.row)*SIZE+Number(old.dataset.col);
      if(!nextSet[key])old.classList.remove('preview-valid','preview-invalid');
    }
    for(var j=0;j<next.length;j++){
      var cell=next[j],wasPresent=previewCells.indexOf(cell)!==-1;
      if(!wasPresent||drag.previewClass!==className){
        cell.classList.remove(className==='preview-valid'?'preview-invalid':'preview-valid');
        cell.classList.add(className);
      }
    }
    previewCells=next;drag.previewClass=className;
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
    var pos=boardPosition(x,y,drag.metrics),originRow=pos.row-drag.grab.y,originCol=pos.col-drag.grab.x;
    var changed=originRow!==drag.lastRow||originCol!==drag.lastCol||pos.inside!==drag.lastInside;
    drag.pos={row:originRow,col:originCol};
    if(changed){
      drag.valid=pos.inside&&BM.board.canPlace(BM.game.state.board,drag.shape,originRow,originCol);
      updatePreview(originRow,originCol,drag.valid);
      drag.lastRow=originRow;drag.lastCol=originCol;drag.lastInside=pos.inside;
    }
    var ghostUnit=drag.ghostUnit,pitch=ghostUnit+drag.ghostGap;
    drag.ghost.style.transform='translate3d('+(x-drag.grab.x*pitch-ghostUnit/2)+'px,'+(y-drag.grab.y*pitch-ghostUnit/2)+'px,0)';
  }
  tray.addEventListener('pointerdown',function(e){
    var slot=e.target.closest('.piece-slot');if(!slot||slot.classList.contains('used')||BM.game.state.animating||BM.game.state.ended)return;
    var idx=Number(slot.dataset.index),shape=BM.game.state.pieces[idx];if(!shape)return;
    e.preventDefault();var grab=findGrabCell(shape,slot,e),ghost=createGhost(shape);document.body.appendChild(ghost);
    drag={idx:idx,shape:shape,slot:slot,ghost:ghost,pointerId:e.pointerId,grab:grab,valid:false,pos:null,metrics:measureBoard(),lastRow:null,lastCol:null,lastInside:null,previewClass:null,ghostUnit:Math.max(30,grab.unit*1.25),ghostGap:Math.max(3,grab.gap)};
    ghost.style.setProperty('--drag-piece-unit',drag.ghostUnit+'px');slot.classList.add('dragging');updateDrag(e.clientX,e.clientY);
  },{passive:false});
  window.addEventListener('resize',function(){if(drag)drag.metrics=measureBoard();},{passive:true});
  window.addEventListener('pointermove',function(e){if(!drag||e.pointerId!==drag.pointerId)return;drag.x=e.clientX;drag.y=e.clientY;if(!raf)raf=requestAnimationFrame(function(){raf=0;if(drag)updateDrag(drag.x,drag.y);});},{passive:true});
  function finish(e,cancelled){
    if(!drag||e.pointerId!==drag.pointerId)return;
    if(raf){cancelAnimationFrame(raf);raf=0;}
    if(!cancelled)updateDrag(e.clientX,e.clientY);
    var current=drag;clearPreview();current.ghost.remove();current.slot.classList.remove('dragging');drag=null;
    if(!cancelled&&current.valid&&current.pos)BM.game.placePiece(current.idx,current.pos.row,current.pos.col);
  }
  window.addEventListener('pointerup',function(e){finish(e,false);});
  window.addEventListener('pointercancel',function(e){finish(e,true);});
}
BM.dragDrop={init:init};
})(window.BlockMaster=window.BlockMaster||{});
