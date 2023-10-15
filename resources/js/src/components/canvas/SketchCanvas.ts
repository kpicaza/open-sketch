import {LitElement, css, html} from "lit";
import {customElement, property, query} from "lit/decorators.js";
import {consume} from "@lit/context";
import {brushContext} from "../../store/AppContext";
import {Brush} from "../../domain/model/Brush";
import {Sketch} from "../../domain/model/Sketch";

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

  @property() canvasContext: CanvasRenderingContext2D | null = null;
  @property() painting: boolean = false;
  @property() resetCanvas: boolean = false;
  @property() sketchId: string = '';
  @property() canvasWidth: number = 960;
  @property() canvasHeight: number = 0;
  @property() image?: URL;

  protected firstUpdated() {
    this.canvasContext = this.canvas.getContext("2d")
    this.clearCanvas();
    this.canvasContext!.lineJoin = "round";
    this.canvasContext!.lineCap = "round";
    this.canvasWidth = this.offsetWidth;
    this.canvasHeight = this.parentElement!.offsetHeight - 50;
    this.setImage();
    setTimeout(() => this.setImage(), 500);
    this.setBrush();
  }

  protected async updated(_changedProperties) {
    super.updated(_changedProperties);
    const image = _changedProperties.get('image');
    if (typeof image == 'string') {
      this.image = new URL(this.image);
    }
    if (true === this.resetCanvas) {
      this.clearCanvas();
      this.setImage();
      this.resetCanvas = false;
      this.dispatchEvent(new CustomEvent('canvasreseted', {
        detail: this.sketchId
      }))
    }
    this.setBrush();
  }

  private clearCanvas() {
    this.canvasContext?.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.setImage();
  }

  protected setImage() {
    const img = new Image();
    img.onload = () => {
          this.canvasContext!.drawImage(img, 0, 0);
    };
    setTimeout(() => img.src = this.image.toString(), 0);
  }

  protected setBrush() {
    this.cursor.style.width = `${this.brush.lineWidth}px`;
    this.cursor.style.height = `${this.brush.lineWidth}px`;
    this.cursor.style.background = this.brush.color;

    this.canvasContext!.shadowBlur = 0;
    if(this.brush.type === "pencil"){
      this.canvasContext!.lineWidth = this.brush.lineWidth / 4;
      this.canvasContext!.shadowColor = this.brush.color;
    } else {
      this.canvasContext!.lineWidth = this.brush.lineWidth;
    }

    this.canvasContext!.fillStyle = this.brush.color;
    this.canvasContext!.strokeStyle = this.brush.color;

    if(this.brush.type === "eraser"){
      this.canvasContext!.lineWidth = this.brush.lineWidth;
      this.canvasContext!.shadowBlur = this.brush.lineWidth;
      this.canvasContext!.globalCompositeOperation="destination-out";
    }else{
      this.canvasContext!.globalCompositeOperation="source-over";
    }
  }

  protected moveCursor(event: MouseEvent) {
    const mouseY = event.offsetY - (this.brush.lineWidth / 2);
    const mouseX = event.offsetX - (this.brush.lineWidth / 2);
    this.cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
  }

  protected draw(event: MouseEvent) {
    if (this.painting) {
      this.canvasContext!.lineTo(event.offsetX, event.offsetY);
      this.canvasContext!.stroke();
    }

    this.moveCursor(event);
  }

  protected dash(event: MouseEvent) {
    this.canvasContext!.beginPath();
    this.canvasContext!.arc(
      event.offsetX,
      event.offsetY,
      this.brush.lineWidth / Math.PI,
      0,
      0
    );
    this.canvasContext!.stroke();
  }

  protected startDrawing(event: MouseEvent) {
    this.canvasContext = this.canvas.getContext("2d")
    this.painting = true;
    this.canvasContext!.beginPath();
  }

  protected stopDrawing(event: MouseEvent) {
    if (!this.painting) {
      return;
    }
    this.canvasContext!.globalCompositeOperation="source-over";
    this.saveSketchBook();
    this.painting = false;
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
        @click=${this.dash}
      >
      </canvas>
    `;
  }
}
