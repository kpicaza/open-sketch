import {LitElement, css, html} from "lit";
import {customElement, property, query} from "lit/decorators.js";

@customElement('sketch-canvas')
export class SketchCanvas extends LitElement {
  static styles = css`
    :host {
      height: 80vh;
    }

    canvas {
      width: 120vh;
      background: #FFFFFF;
      cursor: crosshair;
    }
  `

  @query("#sheet") canvas!: HTMLCanvasElement;

  @property() context: CanvasRenderingContext2D | null = null;
  @property() painting: boolean = false;
  @property() lineWidth: number = 3;
  @property() canvasWidth: number = 960;
  @property() canvasHeight: number = 0;
  @property() color: string = "#000000";

  protected firstUpdated() {
    this.context = this.canvas.getContext("2d")
    this.context!.lineJoin = "round";
    this.setBrush();

    this.canvasWidth = this.offsetWidth;
    this.canvasHeight = this.parentElement!.offsetHeight - 50;
  }

  protected setBrush() {
    this.context!.lineWidth = this.lineWidth;
    this.context!.fillStyle = this.color;
    this.context!.strokeStyle = this.color;
  }

  protected draw(event: MouseEvent) {
    if (this.painting) {
      this.context!.lineTo(event.offsetX, event.offsetY);
      this.context!.stroke();
    }
  }

  protected dash(event: MouseEvent) {
    this.context!.beginPath();
    this.context!.arc(
      event.offsetX,
      event.offsetY,
      this.lineWidth / 2,
      0,
      2 * Math.PI
    );
    this.context!.fill();
    this.painting = false;
  }

  protected startDrawing(event: MouseEvent) {
    this.setBrush()
    this.dash(event);
    this.context!.beginPath();
    this.context!.moveTo(event.offsetX, event.offsetY);
    this.painting = true;
  }

  protected stopDrawing(event: MouseEvent) {
    if (!this.painting) {
      return;
    }
    this.painting = false;
    this.dispatchEvent(new CustomEvent(
      'sketchbooksaved',
      {
        detail: new URL(this.canvas.toDataURL("image/png"))
      }
    ))
  }

  protected render() {
    return html`
      <canvas
        id="sheet"
        width=${this.canvasWidth}
        height=${this.canvasHeight}
        @mousedown=${this.startDrawing}
        @mousemove=${this.draw}
        @mouseup=${this.stopDrawing}
        @mouseout=${this.stopDrawing}
        @click=${this.dash}
      ></canvas>
    `;
  }
}
