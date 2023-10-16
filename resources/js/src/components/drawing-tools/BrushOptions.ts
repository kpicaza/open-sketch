import {LitElement, css, html} from "lit";
import {customElement, property, query} from "lit/decorators.js";
import "./Eraser"
import "./Pen"
import "./Pencil"

@customElement('brush-options')
export class BrushOptions extends LitElement {
  static styles = css`
    .brush {
      display: block;
      position: fixed;
      left: 0;
      top: 0;
      background: #218BC3;
      height: 120px;
      width: 100px;
      cursor: pointer;
      animation:moveUp .25s;
    }
    .brush:hover, .brush.selected {
      animation:moveDown .25s;
      top: 15px;
    }
    @keyframes moveDown{
      from {top: 0px;}
      to{top:15px;}
    }
    @keyframes moveUp{
      from {top: 15px;}
      to{top:0px;}
    }
    .pen {
      margin-top: -150px;
      overflow: visible;
    }
    .pencil {
      margin-top: -150px;
      left: 70px;
    }

    .eraser {
      left: 240px;
      margin-top: -170px;
    }

    input[type="color"] {
      cursor: pointer;
      position: absolute;;
      top: -10px;
      left: 0;
      -webkit-appearance: none;
      border: none;
      width: 60px;
      height: 60px;
    }
    input[type="color"]::-webkit-color-swatch-wrapper {
      padding: 0;
    }

    input[type="color"]::-webkit-color-swatch {
      border: none;
    }
    input[type="range"] {
      cursor: pointer;
      position: absolute;
      top: 10px;
      transform: rotate(270deg);
      width: 60px;
    }
  `;

  @property() color: string = "#000000";
  @property() selectedBrush: string = 'pen';
  @property() lineWidth: number = 3;

  protected changeLineWidth(event: InputEvent) {
    const input: HTMLInputElement = event.target as HTMLInputElement;
    this.lineWidth = input.value as unknown as number / Math.PI
    this.dispatchEvent(new CustomEvent(
      'linewidthchanged',
      {
        detail: this.lineWidth,
      }
    ));
  }

  protected changeColor(event: InputEvent) {
    const input: HTMLInputElement = event.target as HTMLInputElement;
    this.color = input.value;
    this.dispatchEvent(new CustomEvent(
      'colorchanged',
      {
        detail: this.color,
      }
    ));
  }

  private async selectBrush(event: MouseEvent)
  {
    const selectedBrush: HTMLInputElement = event.target as HTMLInputElement;
    const brushes: NodeList = selectedBrush.parentElement.querySelectorAll('.brush') as NodeList

    brushes.forEach((brush: HTMLDivElement) => {
      brush.classList.remove('selected');
    })

    selectedBrush.classList.add('selected')
    this.selectedBrush = selectedBrush.dataset.value as string;

    this.dispatchEvent(new CustomEvent(
      'brushselected',
      {
        detail: this.selectedBrush,
      }
    ));

    await this.updateComplete;
  }

  protected render() {
    return html`
      <div class="brushes">
        <input type="color" @input=${this.changeColor} value=${this.color}/>
        <input type="range" min="2" max="100" @input=${this.changeLineWidth} value=${this.lineWidth}/>
        <brush-pen
          class="brush pen selected"
          data-value="pen"
          @click=${this.selectBrush}
          .selection=${this.selectedBrush}
        ></brush-pen>
        <brush-pencil
          class="brush pencil"
          data-value="pencil"
          @click=${this.selectBrush}
          .selection=${this.selectedBrush}
        ></brush-pencil>
        <brush-eraser
          class="brush eraser"
          data-value="eraser"
          @click=${this.selectBrush}
          .selection=${this.selectedBrush}
        ></brush-eraser>
      </div>
    `;
  }
}
