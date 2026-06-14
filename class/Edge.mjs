import { config } from '../config/Config.mjs';
import Point from '../class/Point.mjs';

export default class Edge {
  static lastId = 0;
  constructor(p1, p2, c = '#ffffff', b = 1) {
    this.p1 = p1;
    this.p2 = p2;
    this.color = c;
    this.border = b;
    this.choose = false;
    this.id = Edge.lastId;
    Edge.lastId += 1;
    this.refer = [];
  }

  // N1 = (1-t)P0 + tP1
  lineEdge(ctx) {
    ctx.beginPath();
    ctx.strokeStyle = config.color.general;
    ctx.lineWidth = config.edgeConfig.border;
    const s = 50;
    const [x1, y1] = this.p1.getPosition();
    ctx.moveTo(x1, y1);
    for (let t = 0; t <= s; t++) {
      let part = t / s;
      const [x, y] = this.iterate(part);
      ctx.lineTo(x, y);
    }
    ctx.stroke();

    
  }
  
  iterate(t) {
    const r = this.refer.length;
    const totalR = r+1;
    let [iterPointX, iterPointY] = this.p1.getPosition();
    [iterPointX, iterPointY] = [iterPointX * ((1-t)**(totalR)), iterPointY * ((1-t)**(totalR))];
    for(let i = 0; i < r; i++){
      const [x, y] = this.refer[i].getPosition();
      const cof = this.combination(totalR, i+1);
      [iterPointX, iterPointY] 
      =  [iterPointX + cof * x * ((1-t)**(r-i)) * (t ** (i+1)), iterPointY + cof * y * ((1-t)**(r-i)) * (t ** (i+1))];
    }
    const [x, y] = this.p2.getPosition();
    [iterPointX, iterPointY] = [iterPointX + x * (t ** (r+1)), iterPointY + y * (t ** (r+1))];
    return [iterPointX, iterPointY];
  }
  
  combination(n, k) {
    if (k < 0 || k > n) return 0;
    if (k === 0 || k === n) return 1;
    
    let result = 1;
    if (k > n / 2) k = n - k;
    for (let i = 1; i <= k; i++) {
      result *= n - k + i;
      result /= i;
    }
    return result;
  }

  isSame(x, y){
    const [startX, startY] = this.p1.getPosition();
    const [endX, endY] = this.p2.getPosition();
    // cross product
    const cross = (x-startX)*(endY-startY) - (y-startY)*(endX-startX);
    const lineLength = Math.sqrt(
      (endX-startX)**2 + (endY-startY)**2
    );
    return Boolean(Math.abs(cross)/lineLength < 10 &&
      Math.min(startX, endX) <= x && x <= Math.max(startX, endX) &&
      Math.min(startY, endY) <= y && y <= Math.max(startY, endY)
    );
  }

  tempHightLight(ctx){
    ctx.beginPath();
    ctx.strokeStyle = config.color.highLight2;
    ctx.lineWidth = config.edgeConfig.smallBorder;
    ctx.setLineDash([5, 2]);
    const [x1, y1] = this.p1.getPosition();
    const [x2, y2] = this.p2.getPosition();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // combineTwoPoint(t) {
  //   const [x1, y1] = this.p1.getPosition();
  //   const [x2, y2] = this.p2.getPosition();
  //   const [x, y] = [x1 * (1 - t) + x2 * t, y1 * (1 - t) + y2 * t];
  //   return [x, y];
  // }
}
