import Point from './class/Point.mjs';
import Status from './class/Status.mjs';
import Edge from './class/Edge.mjs';
import { config } from './config/Config.mjs';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// #region properties

const mouse = {
  x: 0,
  y: 0,
  mousePoint: new Point(),
};

const points = [];
const edges = [];
const edgesCandidate = [];

let choosePoint = null;
let chooseEdge = null;

// #endregion
// #region init set up

const updateSize = () => {
  config.width = window.innerWidth;
  config.height = window.innerHeight;
  canvas.width = config.width;
  canvas.height = config.height;
};
updateSize();

window.addEventListener('contextmenu', (event) => {
  event.preventDefault();
});

window.addEventListener('resize', updateSize);

// #endregion
// #region user action

window.addEventListener('mousemove', (event) => {
  if (event.ctrlKey) {
    handleEdge();
  }
  const rect = canvas.getBoundingClientRect();
  mouse.x = event.clientX - rect.left;
  mouse.y = event.clientY - rect.top;
  mouse.mousePoint.setPosition(mouse.x, mouse.y);
});

window.addEventListener('pointerdown', (event) => {
  
  // choose the lastest choosen point
  if (choosePoint) choosePoint.choosePoint = false;
  choosePoint = null;
  const [minDis, closestPoint] = findClosestPoint(mouse.mousePoint);
  const gap = (config.pointConfig.radius + config.pointConfig.border) ** 2;
  if (minDis > gap) {
    createPoint();
    edgesCandidate.length = 0;
    return;
  }
  choosePoint = closestPoint;
  choosePoint.choosePoint = true;

  // edge set up (right click)
  addEdge(event.button);
});

window.addEventListener('pointerup', (event) => {
  // clear choose point
  if (choosePoint) choosePoint.choosePoint = false;
  choosePoint = null;
});

// #endregion
// #region utility function

const createPoint = () => {
  if (points.length >= 40) return;
  if(chooseEdge != null){
    const p = new Point(
      mouse.x,
      mouse.y,
      config.pointConfig.smallRadius,
      config.color.highLight2,
      config.pointConfig.border,
    );
    chooseEdge.refer.push(p);
    chooseEdge = null;
    points.push(p);
    return;
  }
  const p = new Point(
    mouse.x,
    mouse.y,
    config.pointConfig.radius,
    config.color.general,
    config.pointConfig.border,
  );
  points.push(p);
};

const distanceSquare = (p1, p2) => {
  const [p1x, p1y] = p1.getPosition();
  const [p2x, p2y] = p2.getPosition();
  const disSquare = (p2x - p1x) ** 2 + (p2y - p1y) ** 2;
  return disSquare;
};

const findClosestPoint = (p) => {
  let minDis = 1e9;
  let closestPoint = null;
  for (let point of points) {
    const dis = distanceSquare(point, p);
    if (minDis > dis) {
      closestPoint = point;
      minDis = dis;
    }
  }
  return [minDis, closestPoint];
};

const addEdge = (rightClick) => {
  if (rightClick != 2) {
    edgesCandidate.length = 0;
    return;
  }
  if (edges.length >= 20) {
    edgesCandidate.length = 0;
    return;
  }
  edgesCandidate.push(choosePoint);
  if (edgesCandidate.length >= 2) {
    edges.push(
      new Edge(
        edgesCandidate[0],
        edgesCandidate[1],
        config.color.general,
        config.edgeConfig.border,
      ),
    );
    edgesCandidate[0].setfill(true);
    edgesCandidate[1].setfill(true);
    edgesCandidate.length = 0;
  }
};

const handleEdge = () => {
  chooseEdge = findEdge();
};

const findEdge = () => {
  for (let i = 0; i < edges.length; i++) {
    if (edges[i].isSame(mouse.x, mouse.y)) {
      return edges[i];
    }
  }
  return null;
};

// #endregion
// #region main action

const render = () => {
  // set choose point position
  if (choosePoint) {
    choosePoint.x = mouse.x;
    choosePoint.y = mouse.y;
  }

  for (let edge of edges) {
    edge.lineEdge(ctx);
    if (chooseEdge != null) {
      chooseEdge.tempHightLight(ctx);
    }
  }

  // set color
  for (let point of points) {
    // set near mousepoint color
    const dis = distanceSquare(point, mouse.mousePoint);
    const radiusSquare = config.pointConfig.radius ** 2;
    if (dis <= radiusSquare) {
      point.color = config.color.highLight;
    } else {
      point.color = config.color.general;
    }
    // set choose color
    if (choosePoint && point.id == choosePoint.id) {
      choosePoint.color = config.color.fadeHighLight;
    }

    point.writePoint(ctx);
  }
};

// #endregion
// #region main loop

const main = () => {
  // loop
  requestAnimationFrame(main);

  // clear
  ctx.clearRect(0, 0, config.width, config.height);
  ctx.fillStyle = config.color.dark;
  ctx.fillRect(0, 0, config.width, config.height);

  // render
  render();

  // config
  Status.updateStatus(ctx, config);
};
main();

// #endregion
