import {Brush} from "./Brush.js";
import {Pen} from "./Pen.js";
import {Tool} from "./Tool.js";
import {Pencil} from "./Pencil.js";
import {Eraser} from "./Eraser.js";
import {Palette} from "./Palette.js";

export class DrawingTool {
  context: CanvasRenderingContext2D;

  tool: Tool;

  constructor(context: CanvasRenderingContext2D) {
    this.context = context;
    this.context.lineJoin = "round";
    this.context.lineCap = "round";
    this.tool = new Pen(context);

  }

  public hasCurrentBrushAndPalette(brush: Brush, palette: Palette): boolean {
    if (
      this.tool.name() === brush.type
      && this.context.lineWidth === brush.width
      && this.context.fillStyle === palette.primaryColor
    ) {
      return true;
    }

    return false;
  }

  public setImage(image: URL) {
    const img = new Image();
    img.onload = () => {
      this.context!.drawImage(img, 0, 0);
    };
    setTimeout(() => {
      img.src = image.toString()
    }, 0);
  }

  public setBrushAndPalette(brush: Brush, palette: Palette)
  {
    if(brush.type === "pencil") {
      this.tool = new Pencil(this.context);
    } else if(brush.type === "eraser") {
      this.tool = new Eraser(this.context);
    } else {
      this.tool = new Pen(this.context);
    }

    this.context.lineWidth = brush.width;
    this.context.fillStyle = palette.primaryColor;
    this.context.strokeStyle = palette.primaryColor;
  }

  public clearCanvas(canvasWidth: number, canvasHeight: number, image: URL) {
    this.context?.clearRect(0, 0, canvasWidth, canvasHeight);
    this.setImage(image);
  }

  public startDrawing(offsetX: number, offsetY: number) {
    this.tool.startDrawing(offsetX, offsetY);
  }

  public draw(offsetX: number, offsetY: number) {
    this.tool.draw(offsetX, offsetY);
  }

  public stopDrawing(): boolean {
    return this.tool.stopDrawing();
  }

}
