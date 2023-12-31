import {LitElement, css, html} from "lit";
import {customElement, property, query} from "lit/decorators.js";
import '@material/web/iconbutton/filled-icon-button.js';
import '@material/web/icon/icon.js';
import {consume} from "@lit/context";
import {sketchBookContext} from "../../store/AppContext.js";
import {Sketch} from "../../domain/model/Sketch.js";
import {SketchBook} from "../../domain/model/SketchBook.js";

@customElement('sketch-nav')
export class SketchNavigator extends LitElement {
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
      bottom: 0;
      width: 100%;
      height: 125px;
      background: #1a202c;
      z-index: 20;
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

    .drop-zone.dropable {
      background: #6a6a6a;
      margin-left: -3px;
      margin-right: -3px;
      border: #ededed dashed 3px;
      border-radius: 8px;
      padding-bottom: 15px;
      opacity: .5;
    }

    .dragging {
      opacity: .25;
    }
  `;

  @query(".horizontal-scroll-wrapper") scrollWrapper: HTMLDivElement;

  @consume({context: sketchBookContext, subscribe: true})
  @property({attribute: false})
  declare sketchBook: SketchBook;

  @property() declare canvasColor: string;

  @property() declare showLeftArrow: boolean;

  @property() declare showRightArrow: boolean;

  @property() declare previewScrollPosition: number;

  constructor() {
    super();
    this.canvasColor = '';
    this.previewScrollPosition = 0;
    this.showLeftArrow = false;
    this.showRightArrow = false;
  }

  protected async firstUpdated() {
    this.resetArrows();
    this.scrollWrapper.addEventListener('scrollend', () => {
      this.resetArrows();
    });
  }

  protected async updated(_changedProperties) {
    super.updated(_changedProperties);
    this.resetArrows();
  }

  private async resetArrows() {
    setTimeout(() => {
      this.showLeftArrow = this.previewScrollPosition > 0;
      this.showRightArrow = window.innerWidth < (this.scrollWrapper.scrollWidth)
        && window.innerWidth !== this.scrollWrapper.scrollWidth - this.scrollWrapper.scrollLeft;
    });
  }

  private async movePreviewsToLeft() {
    this.previewScrollPosition = this.scrollWrapper.scrollLeft - 400;
    await this.scrollWrapper.scroll({
      top: 0,
      left: this.previewScrollPosition,
      behavior: "smooth",
    })
  }

  private async movePreviewsToRight() {
    this.previewScrollPosition = this.scrollWrapper.scrollLeft + 400;
    await this.scrollWrapper.scroll({
      top: 0,
      left: this.previewScrollPosition,
      behavior: "smooth",
    })
  }

  private async goToSelectedSketch(event: CustomEvent) {
    this.dispatchEvent(new CustomEvent(
      'sketchselected',
      {
        detail: event.detail
      }
    ))
  }

  private async deleteSketch(event: CustomEvent) {
    this.dispatchEvent(new CustomEvent(
      'sketchdeleted',
      {
        detail: event.detail
      }
    ))
  }

  private async downloadSketch(event: CustomEvent) {
    this.dispatchEvent(new CustomEvent(
      'sketchdownloaded',
      {
        detail: event.detail
      }
    ))
  }

  private renderPreviewArrows() {
    if (this.sketchBook.sketches.length === 1) {
      return html``;
    }


    let result ;
    if (this.showLeftArrow) {
      result = html`
        <button
          @click=${this.movePreviewsToLeft}
          class="left-previews arrow-button"
        >
          <md-icon>arrow_back_ios</md-icon>
        </button>
      `
    }

    if (this.showRightArrow) {
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

  private allowDrop(event: DragEvent) {
    event.preventDefault();
    const {dataTransfer} = event;
    dataTransfer.dropEffect = "move";
    const sketchWrapper: HTMLDivElement = event.target as HTMLDivElement;
    if (!sketchWrapper.classList.contains('preview')) {
      return;
    }
    const dropZones = this.shadowRoot.querySelectorAll('.drop-zone')
    for (const dropZone of dropZones) {
      dropZone.classList.remove('dropable');
    }
    sketchWrapper.parentElement.classList.add('dropable');
  }

  private stopDragging() {
    const dropZones = this.shadowRoot.querySelectorAll('.dropable')
    for (const dropZone of dropZones) {
      dropZone.classList.remove('dropable');
    }
  }

  private drag(event: DragEvent) {
    const sketchBookDiv = event.target as HTMLDivElement;
    sketchBookDiv.classList.add('dragging')
    const {dataTransfer} = event;
    dataTransfer.effectAllowed = "move";
    dataTransfer.setData("text", sketchBookDiv.dataset.id);
  }

  private drop(event: DragEvent) {
    event.preventDefault();
    const sketchId = event.dataTransfer.getData("text");
    const sketchWrapper: HTMLDivElement = event.target as HTMLDivElement;
    this.stopDragging();
    const dragging = this.shadowRoot.querySelectorAll('.dragging')
    for (const drag of dragging) {
      drag.classList.remove('dragging');
    }

    this.dispatchEvent(new CustomEvent(
      'sketchesreordered',
      {
        detail: {
          drag: sketchId,
          drop: sketchWrapper.dataset.id
        }
      }
    ))
  }

  protected render() {
    return html`
      <div class="app-footer">
        <div class="horizontal-scroll-wrapper">
          ${this.sketchBook.sketches.map((sketch: Sketch) => html`
            <div
              class="drop-zone"
              data-id=${sketch.id}
              @drop=${this.drop}
              @dragover=${this.allowDrop}
              @dragleave=${this.stopDragging}
            >
              <sketch-preview
                class="preview"
                data-id=${sketch.id}
                .sketchId=${sketch.id}
                .image=${sketch.image}
                .background=${this.sketchBook.palette.backgroundColor}
                @sketchselected=${this.goToSelectedSketch}
                @sketchdeleted=${this.deleteSketch}
                @sketchdownloaded=${this.downloadSketch}
                @dragstart=${this.drag}
              ></sketch-preview>
            </div>
          `)}
        </div>
        ${this.renderPreviewArrows()}
      </div>
    `;
  }
}
