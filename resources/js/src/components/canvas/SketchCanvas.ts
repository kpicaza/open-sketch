import {LitElement, css, html} from "lit";
import {customElement, property, query} from "lit/decorators.js";
import {consume} from "@lit/context";
import {brushContext} from "../../store/AppContext";
import {Brush} from "../../domain/model/Brush";
import {Sketch} from "../../domain/model/Sketch";
import {DrawingTool} from "../../domain/model/DrawingTool";

@customElement('sketch-canvas')
export class SketchCanvas extends LitElement {
  static styles = css`
    :host {
      height: 80vh;
    }

    canvas {
      width: 120vh;
      background: #FFFFFF;
      cursor: none;
    }

    .cursor {
      user-select: none;
      cursor: none;
      position: absolute;
      border-radius: 50%;
      opacity: 0.5;
      pointer-events:none;
    }
  `
  @query("#sheet") canvas!: HTMLCanvasElement;
  @query(".cursor") cursor!: HTMLDivElement;

  @consume({context: brushContext, subscribe: true})
  @property({attribute: false})
  brush?: Brush

  @property() resetCanvas: boolean = false;
  @property() sketchId: string = '';
  @property() canvasWidth: number = 960;
  @property() canvasHeight: number = 0;
  @property() image?: URL;
  @property() drawingTool: DrawingTool;

  protected firstUpdated() {
    this.canvasWidth = this.offsetWidth;
    this.canvasHeight = this.parentElement!.offsetHeight - 50;
    this.drawingTool = new DrawingTool(this.canvas.getContext("2d"))
    this.drawingTool.clearCanvas(this.canvasWidth, this.canvasHeight, this.image);
    this.drawingTool.setBrush(this.brush);
    setTimeout(() => this.drawingTool.setImage(this.image), 500);
  }

  protected async updated(_changedProperties) {
    super.updated(_changedProperties);
    this.drawingTool.setBrush(this.brush);
    const image = _changedProperties.get('image');
    if (typeof image == 'string') {
      this.image = new URL(this.image);
    }
    if (true === this.resetCanvas) {
      this.drawingTool.clearCanvas(this.canvasWidth, this.canvasHeight, this.image);
      this.drawingTool.setImage(this.image);
      this.resetCanvas = false;
      this.dispatchEvent(new CustomEvent('canvasreseted', {
        detail: this.sketchId
      }))
    }
  }

  protected moveCursor(event: MouseEvent) {
    const cursorWidth =  this.brush.lineWidth > 3 ? this.brush.lineWidth : 3;
    this.cursor.style.width = `${cursorWidth}px`;
    this.cursor.style.height = `${cursorWidth}px`;
    this.cursor.style.background = this.brush.color;
    const mouseY = event.offsetY - (this.brush.lineWidth / 2);
    const mouseX = event.offsetX - (this.brush.lineWidth / 2);
    this.cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
  }

  protected draw(event: MouseEvent) {
    this.drawingTool.draw(event.offsetX, event.offsetY);
    this.moveCursor(event);
  }

  protected startDrawing(event: MouseEvent) {
    if (!this.drawingTool.hasCurrentBrush(this.brush)) {
      this.drawingTool.setBrush(this.brush);
    }

    this.drawingTool.startDrawing(event.offsetX, event.offsetY);
  }

  protected stopDrawing() {
    if (this.drawingTool.stopDrawing()) {
      this.saveSketchBook();
    }
  }

  protected saveSketchBook() {
    this.dispatchEvent(new CustomEvent(
      'sketchbooksaved',
      {
        detail: {
          id: this.sketchId,
          image: new URL(this.canvas.toDataURL("image/png"))
        } as Sketch
      }
    ))
  }

  protected render() {
    return html`
      <div
        @ondragstart=${false}
        @ondrop=${false}
        class="cursor"
      ></div>
      <canvas
        id="sheet"
        width=${this.canvasWidth}
        height=${this.canvasHeight}
        @mousedown=${this.startDrawing}
        @mousemove=${this.draw}
        @mouseover=${this.moveCursor}
        @mouseup=${this.stopDrawing}
        @mouseout=${this.stopDrawing}
      >
      </canvas>
    `;
  }
}
