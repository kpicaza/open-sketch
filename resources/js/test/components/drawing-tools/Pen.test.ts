import {elementUpdated, fixture} from "@open-wc/testing";
import {html} from "lit";
import {expect} from "@esm-bundle/chai";
import {Pen} from "../../../src/components/drawing-tools/Pen";
import "../../../src/components/drawing-tools/Pen";


describe('<brush-pen> components.', () => {

  it('should be unselected by default.', async () => {
    const el: Pen = await fixture(html` <brush-pen selection=""></brush-pen> `);

    await expect(el.getAttribute('selection')).to.equal('')
    const pencil: HTMLDivElement = el.shadowRoot!.querySelector('.pencil_box');
    expect(pencil.classList).to.contain(['pencil_box'])
    await expect(el).to.be.accessible();
  });

  it('should be selected on click.', async () => {
    const el: Pen = await fixture(html` <brush-pen selection=""></brush-pen> `);

    const pencil: HTMLDivElement = el.shadowRoot!.querySelector('.pencil_box');
    el.pencilBox = pencil;

    pencil.click();
    await elementUpdated(el);

    expect(pencil.classList).to.contain(['pencil_box', 'selected'])
    await expect(el).to.be.accessible();
  });

  it('should be selected with matching selection field.', async () => {
    const el: Pen = await fixture(html` <brush-pen selection="pen"></brush-pen> `);

    const pencil: HTMLDivElement = el.shadowRoot!.querySelector('.pencil_box');
    el.pencilBox = pencil;

    expect(pencil.classList).to.contain(['pencil_box', 'selected'])
    await expect(el).to.be.accessible();
  });

})
