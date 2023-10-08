import {LitElement, css, html} from "lit";
import {customElement, property, query} from "lit/decorators.js";

@customElement('add-sketch')
export class AddSketch extends LitElement {
    static styles = css`
        :host {
            display: flex;
            align-items: center;
            min-height: 100vh;
        }
        button {
            cursor: pointer;
            border-radius: 8px;
            border: 1px;
            border-color: #9ca3af;
            margin-right: 25px;
            height: 400px;
            width: 75px;
            font-size: 60px;
            font-weight: 700;
            color: #FFFFFF;
            background-color: #9ca3af;
        }
        button:hover {
            background-color: #4a5568;
        }
    `

    protected addSketch(event: InputEvent) {
        this.dispatchEvent(new CustomEvent(
            'sketchadded',
            {
                detail: {}
            }
        ))
    }

    protected render() {
        return html`
            <button
                @click=${this.addSketch}
            >+</button>
        `;
    }
}
