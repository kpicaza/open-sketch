import {LitElement, css, html} from "lit";
import {customElement, property, query} from "lit/decorators.js";
import '@material/web/iconbutton/filled-icon-button.js';
import '@material/web/icon/icon.js';
import {consume} from "@lit/context";
import {sketchBookContext} from "../../store/AppContext";
import {SketchBook} from "../../domain/model/SketchBook";
import {Sketch} from "../../domain/model/Sketch";

@customElement('painting-board')
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

    .horizontal-scroll-wrapper > .sketches {
      display: flex;
      flex: 0 0 auto;
    }

    .horizontal-scroll-wrapper > .sketches > .sketch {
      flex-direction: column;
      flex-wrap: wrap;
      height: 80vh;
      margin-left: 65px;
      margin-right: 65px;
    }
  `;

  @consume({context: sketchBookContext, subscribe: true})
  @property({attribute: false})
  declare sketchBook?: SketchBook;

  @property() declare resetCanvas: boolean;

  constructor() {
    super();
    this.resetCanvas = false;
  }

  protected saveSketchBook(event: CustomEvent) {
    this.dispatchEvent(new CustomEvent(
      'sketchbooksaved',
      {
        detail: event.detail
      }
    ))
  }

  protected canvasReset(event: CustomEvent) {
    this.resetCanvas = false;
    this.dispatchEvent(new CustomEvent(
      'canvasreseted',
      {
        detail: event.detail
      }
    ))
  }

  protected render() {
    return html`
      <div class="horizontal-scroll-wrapper">
        ${this.sketchBook.sketches.map((sketch: Sketch) => {
          return html`
              <div class="sketches">
                <div class="sketch">
                  <sketch-canvas
                    class="sketch-${sketch.id}"
                    .image=${sketch.image as URL}
                    .sketchId=${sketch.id}
                    @sketchbooksaved=${this.saveSketchBook}
                    @canvasreseted=${this.canvasReset}
                    .resetCanvas=${this.resetCanvas}
                  ></sketch-canvas>
                </div>
              </div>
            `;
        })}
      </div>
    `;
  }
}
