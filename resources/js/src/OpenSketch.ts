import {LitElement, html, css} from 'lit';
import {query, property, customElement} from 'lit/decorators.js';
import {SketchBookRepository} from "./domain/SketchBookRepository";
import {Brush} from "./domain/model/Brush";
import "./components/canvas/SketchCanvas";
import "./components/sketch-book/AddSketch";
import "./components/drawing-tools/BrushOptions";


@customElement('open-sketch')
export class OpenSketch extends LitElement {
  @property({type: String}) header = 'My app';

  static styles = css`
    :host {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      font-size: calc(10px + 2vmin);
      color: #1a2b42;
      width: 100%;
      margin: 0 auto;
      background-color: var(--open-sketch-background-color);
    }

    .brush-tools {
      display: flex;
      position: fixed;
      top: 0;
      height: 125px;
      width: 100%;
      align-items: center;
      justify-content: center;
    }

    main {
      margin-top: 125px;
      flex-grow: 1;
    }

    .horizontal-scroll-wrapper {
      display: flex;
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

    .sketch-book-controls {
      position: fixed;
      right: 0;
      z-index: 10;
    }

    .app-footer {
      font-size: calc(12px + 0.5vmin);
      align-items: center;
    }

    .app-footer a {
      margin-left: 5px;
    }
  `;

  @query("main") sketchWrapper: HTMLDivElement;
  @property() sketchNumber: Array<number> = [1];
  @property() sketchBookRepository: SketchBookRepository;
  @property() sketchBookId: string;
  @property() brush: Brush = {
    lineWidth: 3,
    color: '#000000'
  };

  constructor() {
    super();
    this.sketchBookRepository = new SketchBookRepository();
    const url = URL.createObjectURL(new Blob());
    this.sketchBookId = url.substring(url.lastIndexOf('/') + 1);
  }

  protected async appendSketch(event: CustomEvent) {
    const body = this.parentElement.parentElement;
    this.sketchNumber.push(this.sketchNumber.length + 1);
    await this.requestUpdate();
    const scrollWidth = body.scrollWidth + 100;
    body.scroll({
      top: 0,
      left: scrollWidth,
      behavior: "smooth",
    })
  }

  protected saveSketchBook(event: CustomEvent) {
    const sketch = event.target as HTMLDivElement;

    this.sketchBookRepository.save({
      id: this.sketchBookId,
      sketches: [
        {
          id: sketch.dataset.id as number,
          image: event.detail
        }
      ]
    })
  }

  protected changeBrushLineWidth(event: CustomEvent) {
    this.brush = {
      lineWidth: event.detail,
      color: this.brush.color
    }
  }

  protected changeBrushColor(event: CustomEvent) {
    this.brush = {
      lineWidth: this.brush.lineWidth,
      color: event.detail
    }
  }

  render() {
    return html`
      <menu class="brush-tools">
        <brush-options
          @linewidthchanged=${this.changeBrushLineWidth}
          @colorchanged=${this.changeBrushColor}
        ></brush-options>
      </menu>

      <aside class="sketch-book-controls">
        <add-sketch
          @sketchadded=${this.appendSketch}
        ></add-sketch>
      </aside>

      <main>
        <div class="horizontal-scroll-wrapper">
          ${this.sketchNumber.map((id: number) => {
            return html`
              <div class="sketches">
                <div class="sketch">
                  <sketch-canvas
                    .lineWidth=${this.brush.lineWidth}
                    .color=${this.brush.color}
                    data-id=${id}
                    @sketchbooksaved=${this.saveSketchBook}
                  ></sketch-canvas>
                </div>
              </div>
            `;
          })}
        </div>
      </main>

      <footer class="app-footer">
      </footer>
    `;
  }
}
