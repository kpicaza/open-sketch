import {LitElement, css, html, PropertyValues} from "lit";
import {customElement, property, state} from "lit/decorators.js";
import {use} from "lit-translate";
import  '../lang/LangConfig'
import '../components/settings/ManagerSettings'

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

  @state() hasLoadedStrings = false;
  @property() lang: string = 'en';

  protected shouldUpdate(props: PropertyValues) {
    return this.hasLoadedStrings && super.shouldUpdate(props);
  }

  async connectedCallback() {
    super.connectedCallback();

    await use(this.lang);
    this.hasLoadedStrings = true;
  }

  protected render(){
    return html`
      <main>
        <h1>OPEN SKETCH</h1>
        <manager-settings></manager-settings>
      </main>
    `;
  }
}
