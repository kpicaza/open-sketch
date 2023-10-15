import {Tool} from "./Tool";
import {Point} from "../../types/Point";

export class Eraser implements Tool{
  isDrawing: boolean = false;
  points: Array<Point> = [];
  context: CanvasRenderingContext2D;

  constructor(context: CanvasRenderingContext2D) {
    this.context = context;
    this.context.lineJoin = "round";
    this.context.lineCap = "round";
    this.context.globalCompositeOperation="destination-out";
  }

  public name(): string {
    return 'pen';
  }

  public startDrawing(offsetX: number, offsetY: number)
  {
    this.isDrawing = true;
    this.points.push({ x: offsetX, y: offsetY });
  }

  public draw(offsetX: number, offsetY: number) {
    if (!this.isDrawing) {
      return
    }

    this.points.push({ x: offsetX, y: offsetY });

    var p1 = this.points[0];
    var p2 = this.points[1];

    this.context.beginPath();
    this.context.moveTo(p1.x, p1.y);

    for (var i = 1, len = this.points.length; i < len; i++) {
      // we pick the point between pi+1 & pi+2 as the
      // end point and p1 as our control point
      var midPoint = this.midPointBtw(p1, p2);
      this.context.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
      p1 = this.points[i];
      p2 = this.points[i+1];
    }
    // Draw last line as a straight line while
    // we wait for the next point to be able to calculate
    // the bezier control point
    this.context.lineTo(p1.x, p1.y);
    this.context.stroke();

    if (this.isDrawing) {
      this.context.lineTo(offsetX, offsetY);
      this.context.stroke();
    }
  }

  public stopDrawing() {
    if (!this.isDrawing) {
      return;
    }
    this.context.globalCompositeOperation="source-over";
    this.isDrawing = false;
  }

  private midPointBtw(point1: Point, point2: Point) {
    return {
      x: point1.x + (point2.x - point1.x) / 2,
      y: point1.y + (point2.y - point1.y) / 2
    };
  }
}
