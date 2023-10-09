import {LitElement, css, html} from "lit";
import {customElement, property, query} from "lit/decorators.js";

@customElement('brush-options')
export class BrushOptions extends LitElement {
  static styles = css``;

  @property() color: string = "#000000";
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

  protected render() {
    return html`
      <input type="color" @input=${this.changeColor} value=${this.color}/>
      <input type="range" min="1" max="100" @input=${this.changeLineWidth} value=${this.lineWidth}/>
    `;
  }
}
