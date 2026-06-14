export default class Point {
  static lastId = 0;
  constructor(x, y, r, c = '#ffffff', b = 1) {
    this.x = x;
    this.y = y;
    this.radius = r;
    this.color = c;
    this.border = b;
    this.choose = false;
    this.fill = false;
    this.id = Point.lastId;
    Point.lastId += 1;
  }

  writePoint(ctx) {
    if(!this.fill){
      ctx.strokeStyle = this.color;
      ctx.lineWidth = this.border;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.stroke();
    }else{
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  setPosition(x, y){
    this.x = x;
    this.y = y;
  }
  getPosition(){
    return [this.x, this.y];
  }
  setfill(f){
    this.fill = f;
  }
}