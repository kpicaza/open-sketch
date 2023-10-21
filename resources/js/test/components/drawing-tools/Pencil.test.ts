import {elementUpdated, fixture} from "@open-wc/testing";
import {html} from "lit";
import {expect} from "@esm-bundle/chai";
import {Pencil} from "../../../src/components/drawing-tools/Pencil";
import "../../../src/components/drawing-tools/Pencil";


describe('<brush-pencil> components.', () => {

  it('should be unselected by default.', async () => {
    const el: Pencil = await fixture(html` <brush-pencil selection=""></brush-pencil> `);

    await expect(el.getAttribute('selection')).to.equal('')
    const pencil: HTMLDivElement = el.shadowRoot!.querySelector('.pencil_box');
    expect(pencil.classList).to.contain(['pencil_box'])
    await expect(el).to.be.accessible();
  });

  it('should be selected on click.', async () => {
    const el: Pencil = await fixture(html` <brush-pencil selection=""></brush-pencil> `);

    const pencil: HTMLDivElement = el.shadowRoot!.querySelector('.pencil_box');
    el.pencilBox = pencil;

    pencil.click();
    await elementUpdated(el);

    expect(pencil.classList).to.contain(['pencil_box', 'selected'])
    await expect(el).to.be.accessible();
  });

  it('should be selected with matching selection field.', async () => {
    const el: Pencil = await fixture(html` <brush-pencil selection="pencil"></brush-pencil> `);

    const pencil: HTMLDivElement = el.shadowRoot!.querySelector('.pencil_box');
    el.pencilBox = pencil;

    expect(pencil.classList).to.contain(['pencil_box', 'selected'])
    await expect(el).to.be.accessible();
  });

})
