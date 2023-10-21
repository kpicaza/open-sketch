import {LitElement, css, html} from "lit";
import {customElement, property, query} from "lit/decorators.js";
import '@material/web/iconbutton/filled-icon-button.js';
import '@material/web/icon/icon.js';
import {consume} from "@lit/context";
import {sketchBookContext} from "../../store/AppContext.js";
import {Sketch} from "../../domain/model/Sketch.js";
import {SketchBook} from "../../domain/model/SketchBook.js";

@customElement('sketch-nav')
export class SketchPreview extends LitElement {
  static styles = css`
    .horizontal-scroll-wrapper {
      display: flex;
      width: 100%;
      overflow-x: hidden;
      overflow-y: hidden;
      flex-wrap: nowrap;
      -webkit-overflow-scrolling: touch;
    }

    .app-footer {
      position: fixed;
    }

    .arrow-button {
      cursor: pointer;
      color: #FFFFFF;
      background-color: #9ca3af;
      width: 60px;
      height: 40px;
      border-radius: 8px;
      border: 1px;
      border-color: #9ca3af;
      font-size: 20px;
      font-weight: 700;
      opacity: 0.5;
    }

    .arrow-button:hover {
      background-color: #4a5568;
    }

    .left-previews {
      position: fixed;
      left: 10px;
      bottom: 50px;
    }

    .right-previews {
      position: fixed;
      right: 10px;
      bottom: 50px;
    }

  `;

  @query(".app-footer") sketchFooter: HTMLDivElement;

  @consume({context: sketchBookContext, subscribe: true})
  @property({attribute: false})
  declare sketchBook: SketchBook;

  @property() declare canvasColor: string;

  @property({attribute: false}) declare previewScrollPosition: number;

  constructor() {
    super();
    this.canvasColor = '';
    this. previewScrollPosition = 0;
  }

  protected async movePreviewsToLeft(event: MouseEvent) {
    const button = event.target as HTMLButtonElement
    const previewMenu = button.parentElement.querySelector('.horizontal-scroll-wrapper');
    this.previewScrollPosition = previewMenu.scrollLeft - 200;
    await previewMenu.scroll({
      top: 0,
      left: this.previewScrollPosition,
      behavior: "smooth",
    })
  }

  protected async movePreviewsToRight(event: MouseEvent) {
    const button = event.target as HTMLButtonElement
    const previewMenu = button.parentElement.querySelector('.horizontal-scroll-wrapper');
    this.previewScrollPosition = previewMenu.scrollLeft + 200;
    await previewMenu.scroll({
      top: 0,
      left: this.previewScrollPosition,
      behavior: "smooth",
    })
  }

  protected renderPreviewArrows() {
    if (this.sketchBook.sketches.length === 1) {
      return html``;
    }

    const previewMenu = this.sketchFooter?.querySelector('.horizontal-scroll-wrapper');
    if (!previewMenu || previewMenu.scrollWidth <= previewMenu.clientWidth) {
      return html``;
    }

    let result;
    if (this.previewScrollPosition > 0) {
      result = html`
        <button
          @click=${this.movePreviewsToLeft}
          class="left-previews arrow-button"
        >
          <md-icon>arrow_back_ios</md-icon>
        </button>
      `
    }

    if ((this.previewScrollPosition + previewMenu.clientWidth) < previewMenu.scrollWidth) {
      result = html`
        ${result}
        <button
          @click=${this.movePreviewsToRight}
          class="right-previews arrow-button"
        >
          <md-icon>arrow_forward_ios</md-icon>
        </button>
      `
    }

    return result;
  }

  protected async goToSelectedSketch(event: CustomEvent) {
    this.dispatchEvent(new CustomEvent(
      'sketchselected',
      {
        detail: event.detail
      }
    ))
  }

  protected async deleteSketch(event: CustomEvent) {
    this.dispatchEvent(new CustomEvent(
      'sketchdeleted',
      {
        detail: event.detail
      }
    ))
  }

  protected async downloadSketch(event: CustomEvent) {
    this.dispatchEvent(new CustomEvent(
      'sketchdownloaded',
      {
        detail: event.detail
      }
    ))
  }

  protected render() {
    return html`
      <div class="app-footer">
        <div class="horizontal-scroll-wrapper">
          ${this.sketchBook.sketches.map((sketch: Sketch) => html`
              <div class="sketches">
                <sketch-preview
                  .sketchId=${sketch.id}
                  .image=${sketch.image}
                  .background=${this.sketchBook.background}
                  @sketchselected=${this.goToSelectedSketch}
                  @sketchdeleted=${this.deleteSketch}
                  @sketchdownloaded=${this.downloadSketch}
                ></sketch-preview>
              </div>
            `)}
        </div>
        ${this.renderPreviewArrows()}
      </div>
    `;
  }
}
