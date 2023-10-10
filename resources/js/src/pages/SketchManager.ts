import {LitElement, css, html} from "lit";
import {customElement, property, query} from "lit/decorators.js";
import '@material/web/list/list.js';
import '@material/web/list/list-item.js';
import '@material/web/icon/icon';
import '@material/web/divider/divider.js';

@customElement('sketch-manager')
export class SketchManager extends LitElement {
  static styles = css`
    :host {
      font-family: "Open Sans";
      --md-ref-typeface-brand: 'Open Sans';
      --md-ref-typeface-plain: system-ui;
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
      display: flex;
      flex-grow: 1;
      width: 100%;
      margin-top: 125px;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .clickable {
      cursor: pointer;
    }
  `;

  private async saveFile(event: MouseEvent) {
    await fetch('/api/sketch-books/save', {
      method: 'POST',
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
    });
  }

  private async openFile(event: MouseEvent) {
    await fetch('/api/sketch-books/open', {
      method: 'POST',
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
    });
  }

  protected render(){
    return html`
      <main>
        <h1>OPEN SKETCH</h1>
        <md-list style="max-width: 300px;">
          <md-list-item @click=${this.saveFile} class="clickable">
            New Sketch Book
            <md-icon slot="start">add</md-icon>
          </md-list-item>
          <md-list-item @click=${this.openFile} class="clickable">
            Open Existing Sketch Book
            <md-icon slot="start">folder_open</md-icon>
          </md-list-item>
          <md-divider></md-divider>
          <md-list-item>
            <a href="https://github.com/kpicaza/open-sketch" target="_blank">Learn more…</a>
            <md-icon slot="start">school</md-icon>
            <md-icon slot="end">open_in_new</md-icon>
          </md-list-item>
          <md-list-item>
            <a href="https://github.com/sponsors/kpicaza" target="_blank">Contribute</a>
            <md-icon slot="start">recycling</md-icon>
            <md-icon slot="end">open_in_new</md-icon>
          </md-list-item>
          <!--<md-list-item>
            <div slot="headline">Cucumber</div>
            <div slot="supporting-text">Cucumbers are long green fruits that are just as long as this multi-line
              description
            </div>
          </md-list-item>
          <md-list-item
            interactive
            href="https://google.com/search?q=buy+kiwis&tbm=shop"
            target="_blank">
            <div slot="headline">Shop for Kiwis</div>
            <div slot="supporting-text">This will link you out in a new tab</div>
            <md-icon slot="end">open_in_new</md-icon>
          </md-list-item>-->
        </md-list>
      </main>
    `;
  }
}
