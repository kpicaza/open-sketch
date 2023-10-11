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
  @property() image?: string;
  @property() brush: string = 'pen';

  protected firstUpdated() {
    this.context = this.canvas.getContext("2d")
    this.context!.lineJoin = "round";
    this.context!.lineCap = "round";
    this.setBrush();
    this.canvasWidth = this.offsetWidth;
    this.canvasHeight = this.parentElement!.offsetHeight - 50;
    if (this.image) {
      this.setImage();
    }
    setTimeout(() => this.setImage(), 500);
  }

  protected setImage() {
    const img = new Image();
    img.onload = () => {
          this.context!.drawImage(img, 0, 0);
    };
    img.src = this.image;
  }

  protected setBrush() {
    if(this.brush === "pencil"){
      this.context!.lineWidth = this.lineWidth / 4;
      this.context!.shadowBlur = this.lineWidth / 2;
      this.context!.shadowColor = this.color;
    } else {
      this.context!.lineWidth = this.lineWidth;
      this.context!.shadowBlur = 0;

    }

    this.context!.fillStyle = this.color;
    this.context!.strokeStyle = this.color;

    if(this.brush === "eraser"){
      this.context!.lineWidth = this.lineWidth;
      this.context!.shadowBlur = this.lineWidth;
      this.context!.globalCompositeOperation="destination-out";
    }else{
      this.context!.globalCompositeOperation="source-over";
    }
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
      this.lineWidth / Math.PI,
      0,
      0
    );
    this.context!.stroke();
  }

  protected startDrawing(event: MouseEvent) {
    this.setBrush()
   // this.dash(event);
    this.context!.beginPath();
    this.context!.moveTo(event.offsetX, event.offsetY);
    this.painting = true;
  }

  protected stopDrawing(event: MouseEvent) {
    if (!this.painting) {
      return;
    }
    this.painting = false;
    this.saveSketchBook();
  }

  protected saveSketchBook() {
    this.dispatchEvent(new CustomEvent(
      'sketchbooksaved',
      {
        detail: new URL(this.canvas.toDataURL("image/png"))
      }
    ))

  }

  protected render() {
    console.log(this.brush)
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
