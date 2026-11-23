(function(BM){'use strict';
var SHAPES=[
{name:'single',cells:[[0,0]]},{name:'domino',cells:[[0,0],[1,0]]},{name:'tri-line',cells:[[0,0],[1,0],[2,0]]},{name:'line4',cells:[[0,0],[1,0],[2,0],[3,0]]},{name:'line5',cells:[[0,0],[1,0],[2,0],[3,0],[4,0]]},{name:'square4',cells:[[0,0],[1,0],[0,1],[1,1]]},{name:'square9',cells:[[0,0],[1,0],[2,0],[0,1],[1,1],[2,1],[0,2],[1,2],[2,2]]},{name:'L-small',cells:[[0,0],[0,1],[1,1]]},{name:'L',cells:[[0,0],[0,1],[0,2],[1,2]]},{name:'J',cells:[[1,0],[1,1],[0,2],[1,2]]},{name:'T',cells:[[0,0],[1,0],[2,0],[1,1],[1,2]]},{name:'S',cells:[[1,0],[2,0],[0,1],[1,1]]},{name:'Z',cells:[[0,0],[1,0],[1,1],[2,1]]},{name:'corner',cells:[[0,0],[1,0],[0,1]]},{name:'line3v',cells:[[0,0],[0,1],[0,2]]},{name:'line4v',cells:[[0,0],[0,1],[0,2],[0,3]]}
];
var COLORS=['yellow','orange','sky','purple','green','pink'];
function make(s){return {name:s.name,cells:s.cells.map(function(p){return p.slice();}),color:COLORS[Math.floor(Math.random()*COLORS.length)],id:Math.random().toString(36).slice(2)};}
function randomShape(){return make(SHAPES[Math.floor(Math.random()*SHAPES.length)]);}
function generate(board){var result=[],size=BM.board.SIZE;for(var i=0;i<3;i++){var candidates=SHAPES.map(make);var viable=candidates.filter(function(s){for(var r=0;r<size;r++)for(var c=0;c<size;c++)if(BM.board.canPlace(board,s,r,c))return true;return false;});result.push((viable.length?viable:candidates)[Math.floor(Math.random()*(viable.length?viable.length:candidates.length))]);}return result;}
BM.pieces={shapes:SHAPES,random:randomShape,generate:generate};
})(window.BlockMaster=window.BlockMaster||{});
