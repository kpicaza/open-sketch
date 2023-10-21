import {Tool} from "./Tool.js";
import {Point} from "../../types/Point.js";

export class Pencil implements Tool {
  isDrawing: boolean = false;

  lastPoint: Point = {x: 0, y: 0};

  context: CanvasRenderingContext2D;

  constructor(context: CanvasRenderingContext2D) {
    this.context = context;
    this.context.lineJoin = "round";
    this.context.lineCap = "round";
    this.context.globalCompositeOperation="source-over";
  }

  public name(): string {
    return 'pencil';
  }

  public startDrawing(offsetX: number, offsetY: number)
  {
    this.isDrawing = true;
    this.lastPoint = { x: offsetX, y: offsetY };
  }

  public draw(offsetX: number, offsetY: number) {
    if (this.isDrawing === false) {
      return
    }

    this.context.beginPath();

    this.context.moveTo(this.lastPoint.x - this.getRandomInt(0, 2), this.lastPoint.y - this.getRandomInt(0, 2));
    this.context.lineTo(offsetX - this.getRandomInt(0, 2), offsetY - this.getRandomInt(0, 2));
    this.context.stroke();

    this.context.moveTo(this.lastPoint.x, this.lastPoint.y);
    this.context.lineTo(offsetX, offsetY);
    this.context.stroke();

    this.context.moveTo(this.lastPoint.x + this.getRandomInt(0, 2), this.lastPoint.y + this.getRandomInt(0, 2));
    this.context.lineTo(offsetX + this.getRandomInt(0, 2), offsetY + this.getRandomInt(0, 2));
    this.context.stroke();

    this.lastPoint = { x: offsetX, y: offsetY };
  }

  public stopDrawing() {
    if (!this.isDrawing) {
      return false;
    }
    this.context.globalCompositeOperation="source-over";
    this.isDrawing = false;

    return true;
  }

  private getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
