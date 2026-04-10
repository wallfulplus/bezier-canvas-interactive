import Point from "./class/Point.mjs"
import Status from "./class/Status.mjs"
import { config } from './config/Config.mjs';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// #region properties

const mouse = {
  x: 0,
  y: 0,
  mousePoint: new Point()
};

const points = [];

let choosePoint = null;

// #endregion
// #region init set up

const updateSize = () => {
  config.width = window.innerWidth;
  config.height = window.innerHeight;
  canvas.width = config.width;
  canvas.height = config.height;
}
updateSize();

// #endregion
// #region EventListener

window.addEventListener('resize', updateSize);

window.addEventListener('mousemove', (event) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = event.clientX - rect.left;
  mouse.y = event.clientY - rect.top;
  mouse.mousePoint.setPosition(mouse.x, mouse.y);
});

window.addEventListener('pointerdown', (event) => {
  if(choosePoint) choosePoint.choosePoint = false;
  choosePoint = null;
  const [minDis, closestPoint] = findClosestPoint(mouse.mousePoint);
  const gap = (config.pointConfig.radius+config.pointConfig.border)**2;
  if(minDis > gap){
    createPoint();
    return;
  }
  choosePoint = closestPoint;
  choosePoint.choosePoint = true;
});

window.addEventListener('pointerup', (event) => {
  // clear choose point
  if(choosePoint) choosePoint.choosePoint = false;
  choosePoint = null;
});

// #endregion
// #region utility function

const createPoint = () => {
  if(points.length >= 20) return;
  const p = new Point(mouse.x, mouse.y, config.pointConfig.radius, config.color.general, config.pointConfig.border);
  points.push(p);
}

const distanceSquare = (p1, p2) => {
  const [p1x, p1y] = p1.getPosition();
  const [p2x, p2y] = p2.getPosition();
  const disSquare = (p2x-p1x)**2 + (p2y-p1y)**2
  return disSquare;
}

const findClosestPoint = (p) => {
  let minDis = 1e9;
  let closestPoint = null;
  for (let point of points) {
    const dis = distanceSquare(point, p);
    if(minDis > dis){
      closestPoint = point;
      minDis = dis;
    }
  }
  return [minDis, closestPoint];
}

// #endregion
// #region main action

const render = () => {
  // set choose point position
  if(choosePoint){
    choosePoint.x = mouse.x;
    choosePoint.y = mouse.y;
  }
  // set color
  for (let point of points) {
    // set near mousepoint color
    const dis = distanceSquare(point, mouse.mousePoint);
    const radiusSquare = config.pointConfig.radius**2;
    if(dis <= radiusSquare){      
      point.color = config.color.highLight;
    }else{
      point.color =  config.color.general;
    }
    // set choose color
    if(choosePoint && point.id == choosePoint.id){
      choosePoint.color =  config.color.fadeHighLight;
    }

    point.writePoint(ctx);
  }
  
}

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
  render()

  // config
  Status.updateStatus(ctx, config);
}
main();

// #endregion
