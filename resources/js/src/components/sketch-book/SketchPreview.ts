import {LitElement, css, html} from "lit";
import {customElement, property, query} from "lit/decorators.js";
import '@material/web/iconbutton/filled-icon-button.js';
import '@material/web/icon/icon.js';

@customElement('sketch-preview')
export class SketchPreview extends LitElement {
  static styles = css`
    :host {
      --md-icon-button-icon-color: #ffffff;
      --md-sys-color-primary: #4a5568;
    }
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
    .close-button {
      position: absolute;
      top: 0;
      margin-left: -40px;
    }
  `

  @property() sketchId: number = 1;
  @property() image: URL = new URL("data:,");

  protected selectSketch(event: MouseEvent) {
    this.dispatchEvent(new CustomEvent(
      'sketchselected',
    {
      detail: this.sketchId
    }
    ));
  }

  protected deleteSketch() {
    this.dispatchEvent(new CustomEvent(
      'sketchdeleted',
    {
      detail: this.sketchId
    }
    ));
  }

  private renderCloseButton()
  {
    return html`
      <md-filled-icon-button
        class="close-button"
        @click=${this.deleteSketch}
      >
        <md-icon>close</md-icon>
      </md-filled-icon-button>
    `;
  }

  protected render() {
    if ("data:," === this.image.toString()) {
      return html`
        <div
          class="image"
          @click=${this.selectSketch}
        ></div>
        ${this.renderCloseButton()}
      `;
    }

    return html`
      <img
        class="image"
        src=${this.image.toString()}
        @click=${this.selectSketch}
        height="85"
      />
      ${this.renderCloseButton()}
    `;
  }
}
