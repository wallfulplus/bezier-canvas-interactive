import { config } from '../config/Config.mjs';

export default class Status{
    // variant
    static frameCount = 0;
    static lastUpdate = performance.now();
    static left = 20;
    static top = 20;
    static gap = 20;

    // funtion
    static updateStatus(ctx) {
        // update fps
        this.fps();
        // show Status
        this.show(ctx);
    }

    static fps() {
        this.frameCount++;
        const now = performance.now();
        if (now - this.lastUpdate >= 1000) {
            // 滿一秒了
            config.fps = this.frameCount;
            this.frameCount = 0;
            this.lastUpdate = now;
        }
    }

    static show(ctx){
        ctx.font = config.text.font;
        ctx.fillStyle = config.color.white;
        ctx.textAlign = config.text.textAlign;
        const fillText = (text, line) => {
            ctx.fillText(text, this.left, (this.top + line*this.gap));
        }
        fillText(`fps:    ${config.fps}`, 0);
        fillText(`width   ${config.width}`, 1);
        fillText(`height  ${config.height}`, 2);
    }

}

