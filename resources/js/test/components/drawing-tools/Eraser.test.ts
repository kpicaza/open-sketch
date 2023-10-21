import {elementUpdated, fixture} from "@open-wc/testing";
import {html} from "lit";
import {expect} from "@esm-bundle/chai";
import {Eraser} from "../../../src/components/drawing-tools/Eraser.js";
import "../../../src/components/drawing-tools/Eraser.js";


describe('<brush-eraser> components.', () => {

  it('should be unselected by default.', async () => {
    const el: Eraser = await fixture(html` <brush-eraser selection=""></brush-eraser> `);

    await expect(el.getAttribute('selection')).to.equal('')
    const eraser: HTMLDivElement = el.shadowRoot!.querySelector('.eraser-wrapper');
    expect(eraser.classList).to.contain(['eraser-wrapper'])
    await expect(el).to.be.accessible();
  });

  it('should be selected on click.', async () => {
    const el: Eraser = await fixture(html` <brush-eraser selection=""></brush-eraser> `);

    const eraser: HTMLDivElement = el.shadowRoot!.querySelector('.eraser-wrapper');
    el.pencilBox = eraser;

    eraser.click();
    await elementUpdated(el);

    expect(eraser.classList).to.contain(['eraser-wrapper', 'selected'])
    await expect(el).to.be.accessible();
  });

  it('should be selected with matching selection field.', async () => {
    const el: Eraser = await fixture(html` <brush-eraser selection="eraser"></brush-eraser> `);

    const eraser: HTMLDivElement = el.shadowRoot!.querySelector('.eraser-wrapper');
    el.pencilBox = eraser;

    expect(eraser.classList).to.contain(['eraser-wrapper', 'selected'])
    await expect(el).to.be.accessible();
  });
})
