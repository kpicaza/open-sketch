import {LitElement, html, css} from 'lit';
import {query, property, customElement} from 'lit/decorators.js';
import "./components/canvas/SketchCanvas";
import "./components/sketch-book/AddSketch";


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

    main {
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

  protected appendSketch(event: CustomEvent) {
    this.sketchNumber.push(this.sketchNumber.length + 1);
    this.requestUpdate();
  }

  render() {
    return html`
      <main>
        <div class="horizontal-scroll-wrapper">
          ${this.sketchNumber.map(() => {
            return html`
              <div class="sketches">
                <div class="sketch">
                  <sketch-canvas></sketch-canvas>
                </div>
              </div>
            `;
          })}
        </div>
      </main>

      <aside class="sketch-book-controls">
        <add-sketch
          @sketchadded=${this.appendSketch}
        ></add-sketch>
      </aside>

      <footer class="app-footer">
      </footer>
    `;
  }
}
