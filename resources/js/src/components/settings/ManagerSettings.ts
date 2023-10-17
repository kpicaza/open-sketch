import {LitElement, css, html} from "lit";
import {customElement} from "lit/decorators.js";
import '@material/web/list/list.js';
import '@material/web/list/list-item.js';
import '@material/web/icon/icon';
import '@material/web/divider/divider.js';
import {openFile, saveFile} from "../../store/SketchBookState";
import {get} from "lit-translate";

@customElement('manager-settings')
export class ManagerSettings extends LitElement {
  static styles = css`
    .clickable {
      cursor: pointer;
    }
  `;

  protected render(){
    return html`
        <md-list style="max-width: 300px;">
          <md-list-item @click=${saveFile} class="clickable">
            ${get('add_sketch_book')}
            <md-icon slot="start">add</md-icon>
          </md-list-item>
          <md-list-item @click=${openFile} class="clickable">
            ${get('open_sketch_book')}
            <md-icon slot="start">folder_open</md-icon>
          </md-list-item>
          <md-divider></md-divider>
          <md-list-item>
            <a href="https://github.com/kpicaza/open-sketch" target="_blank">${get('learn_more')}</a>
            <md-icon slot="start">school</md-icon>
            <md-icon slot="end">open_in_new</md-icon>
          </md-list-item>
          <md-list-item>
            <a href="https://github.com/sponsors/kpicaza" target="_blank">${get('contribute')}</a>
            <md-icon slot="start">recycling</md-icon>
            <md-icon slot="end">open_in_new</md-icon>
          </md-list-item>
        </md-list>
    `;
  }
}
