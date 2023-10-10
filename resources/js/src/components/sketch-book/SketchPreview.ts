import {LitElement, css, html} from "lit";
import {customElement, property, query} from "lit/decorators.js";

@customElement('sketch-preview')
export class SketchPreview extends LitElement {
  static styles = css`
    .image {
      cursor: pointer;
      margin-top: 20px;
      margin-left: 20px;
      margin-right: 20px;
      display: inline-block;
      height: 85px;
      width: 150px;
      background: #FFFFFF;
    }
  `

  @property() sketchId: number = 1;
  @property() image: URL = new URL("data:,");

  protected selectSketch(event: MouseEvent) {
    const sketch = event.target as HTMLDivElement;
    this.dispatchEvent(new CustomEvent(
      'sketchselected',
    {
      detail: sketch.dataset.id
    }
    ));
  }

  protected render() {
    if ("data:," === this.image.toString()) {
      return html`
        <div
          class="image"
          data-id=${this.sketchId}
          @click=${this.selectSketch}
        ></div>
      `;
    }

    return html`
      <img
        class="image"
        src=${this.image.toString()}
        data-id=${this.sketchId}
        @click=${this.selectSketch}
        height="85"
      />
    `;
  }
}
