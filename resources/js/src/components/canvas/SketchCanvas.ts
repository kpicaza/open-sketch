import {LitElement, css, html} from "lit";
import {customElement, property, query} from "lit/decorators.js";

@customElement('sketch-canvas')
export class SketchCanvas extends LitElement {
  static styles = css`
    :host {
      min-width: 960px;
      width: 100%;
    }
    canvas {
      background: #FFFFFF;
      cursor: crosshair;
      overflow: scroll;
    }
    .pencil-tools {
      display: block;
    }
  `

  @query("#sheet") canvas!: HTMLCanvasElement;

  @property() context: CanvasRenderingContext2D|null = null;
  @property() painting: boolean = false;
  @property() lineWidth: number = 3;
  @property() canvasWidth: number = 960;
  @property() canvasHeight: number = 0;
  @property() color: string = "#000000";

  protected firstUpdated() {
    this.context = this.canvas.getContext("2d")
    this.context!.fillStyle = this.color;
    this.context!.strokeStyle = this.color;
    this.context!.lineJoin = "round";
    this.canvasWidth = this.parentElement!.offsetWidth;
    this.canvasHeight = this.parentElement!.offsetHeight - 50;
  }

  protected draw(event: MouseEvent) {
    if (this.painting) {
      this.context!.lineTo(event.offsetX, event.offsetY);
      this.context!.stroke();
    }
  }

  protected changeLineSize(event: InputEvent) {
    const input: HTMLInputElement = event.target as HTMLInputElement;
    this.lineWidth = input.value as unknown as number / Math.PI
    this.context!.lineWidth = this.lineWidth
  }

  protected changeColor(event: InputEvent) {
    const input: HTMLInputElement = event.target as HTMLInputElement;
    this.color = input.value;
    this.context!.fillStyle = this.color;
    this.context!.strokeStyle = this.color;
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
    this.dash(event);
    this.context!.beginPath();
    this.context!.moveTo(event.offsetX, event.offsetY);
    this.painting = true;
  }

  protected stopDrawing(event: MouseEvent) {
    this.painting = false;
  }

  protected render() {
    return html`
      <div class="pencil-tools">
        <input type="color" @input=${this.changeColor}/>
        <input type="range" min="1" max="100" @input=${this.changeLineSize} value=${this.lineWidth} />
      </div>
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
