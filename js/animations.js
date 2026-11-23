/* ==========================================================
   animations.js — decorative cubes for the Home screen
   Phase 1 only. Gameplay motion is added in phase 5.
   ========================================================== */
(function (BM) {
  'use strict';

  var FACES = ['front', 'top', 'right', 'left', 'back', 'bottom'];

  /*
    Background cubes.
    x, y   : position in % of the screen
    n      : size in cube units (see --cube-unit in main.css)
    c      : colour name (block--NAME in blocks.css)
    o      : opacity; lower values read as further back
    float  : seconds for one up/down drift
    spin   : seconds for one full turn
    delay  : seconds offset so cubes do not move in step
  */
  var DECO_CUBES = [
    { x: '7%',  y: '14%', n: 2.6, c: 'yellow', o: 1,   float: 6.2, spin: 16, delay: 0 },
    { x: '74%', y: '27%', n: 2.0, c: 'sky',    o: 0.9, float: 7.4, spin: 20, delay: -2.1 },
    { x: '14%', y: '70%', n: 2.2, c: 'pink',   o: 0.95, float: 6.8, spin: 18, delay: -1.3 },
    { x: '82%', y: '78%', n: 3.0, c: 'orange', o: 1,   float: 8.1, spin: 22, delay: -4 },
    { x: '42%', y: '88%', n: 1.7, c: 'green',  o: 0.8, float: 5.6, spin: 14, delay: -0.8 },
    { x: '3%',  y: '46%', n: 1.6, c: 'purple', o: 0.85, float: 7.0, spin: 19, delay: -3.2 },
    { x: '92%', y: '40%', n: 1.8, c: 'green',  o: 0.8, float: 6.5, spin: 17, delay: -2.6 },
    { x: '68%', y: '91%', n: 2.4, c: 'yellow', o: 0.95, float: 7.7, spin: 21, delay: -5 },
    { x: '34%', y: '6%',  n: 1.5, c: 'pink',   o: 0.5, float: 8.5, spin: 24, delay: -1.7 },
    { x: '22%', y: '40%', n: 1.3, c: 'sky',    o: 0.5, float: 6.0, spin: 26, delay: -3.8 }
  ];

  function createFace(name) {
    var face = document.createElement('span');
    face.className = 'block-3d__face block-3d__face--' + name;
    return face;
  }

  function createCube(config) {
    var wrap = document.createElement('div');
    wrap.className = 'deco-cube';
    wrap.style.setProperty('--x', config.x);
    wrap.style.setProperty('--y', config.y);
    wrap.style.setProperty('--s', 'calc(var(--cube-unit) * ' + config.n + ')');
    wrap.style.setProperty('--o', String(config.o));
    wrap.style.setProperty('--float-dur', config.float + 's');
    wrap.style.setProperty('--spin-dur', config.spin + 's');
    wrap.style.setProperty('--delay', config.delay + 's');

    var cube = document.createElement('div');
    cube.className = 'block-3d block--' + config.c;
    FACES.forEach(function (name) {
      cube.appendChild(createFace(name));
    });

    wrap.appendChild(cube);
    return wrap;
  }

  function spawnDecoCubes(container) {
    var fragment = document.createDocumentFragment();
    DECO_CUBES.forEach(function (config) {
      fragment.appendChild(createCube(config));
    });
    container.appendChild(fragment);
  }

  function init() {
    var container = document.getElementById('deco-cubes');
    if (container) {
      spawnDecoCubes(container);
    }
  }

  BM.animations = {
    init: init,
    spawnDecoCubes: spawnDecoCubes
  };
})(window.BlockMaster = window.BlockMaster || {});
