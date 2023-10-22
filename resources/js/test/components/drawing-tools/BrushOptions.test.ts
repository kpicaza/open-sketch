import {elementUpdated, fixture} from "@open-wc/testing";
import {expect} from "@esm-bundle/chai";
import {html} from "lit";
import {ToggleRouter} from "../../../src/services/ToggleRouter.js";
import {Feature} from "../../../src/types/Feature.js";
import {SketchBook} from "../../../src/domain/model/SketchBook.js";
import {BrushOptions} from "../../../src/components/drawing-tools/BrushOptions.js";
import "../../../src/components/drawing-tools/BrushOptions.js";

describe('<brush-options> components.', () => {

  it('should have different brush types', async () => {
    const el: BrushOptions = await fixture(
      html` <brush-options .features=${new ToggleRouter([])}></brush-options> `
    );

    const brushes: Array<HTMLDivElement> = el.shadowRoot.querySelectorAll('.brush') as Array<HTMLDivElement>;
    expect(brushes).to.have.length(3);

    const pen: HTMLDivElement = brushes[0];
    const pencil: HTMLDivElement = brushes[1];
    const eraser: HTMLDivElement = brushes[2];
    expect(pen.classList).to.contain(['brush', 'pen', 'selected']);
    expect(pencil.classList).to.contain(['brush', 'pencil']);
    expect(eraser.classList).to.contain(['brush', 'eraser']);
    pencil.click();
    await elementUpdated(el);
    expect(pencil.classList).to.contain(['brush', 'pencil', 'selected']);
    expect(pen.classList).to.contain(['brush', 'pen']);
    expect(eraser.classList).to.contain(['brush', 'eraser']);
    eraser.click();
    await elementUpdated(el);
    expect(eraser.classList).to.contain(['brush', 'eraser', 'selected']);
    expect(pencil.classList).to.contain(['brush', 'pencil']);
    expect(pen.classList).to.contain(['brush', 'pen']);
  });

  it('should have a color picker', async () => {
    const el: BrushOptions = await fixture(
      html` <brush-options .features=${new ToggleRouter([])}></brush-options> `
    );

    const colorPicker: HTMLDivElement = el.shadowRoot.querySelector('.color');
    expect(colorPicker).to.have.attribute('type').to.be.equal('color');
    expect(colorPicker).to.have.value('#000000');
  });

  it('should have a brush line width slider', async () => {
    const el: BrushOptions = await fixture(
      html` <brush-options .features=${new ToggleRouter([])}></brush-options> `
    );

    const lineWidthSlider: HTMLDivElement = el.shadowRoot.querySelector('.brush-width-slider');
    expect(lineWidthSlider).to.have.value('3');
  });


  it('should have a background color picker (Experimental)', async () => {
    const toggleRouter = new ToggleRouter([
      {
        id: 'canvas-background-color',
        enabled: true
      } as Feature
    ]);
    const sketchBook = {
      background: '#ffffff'
    } as SketchBook
    const el: BrushOptions = await fixture(
      html` <brush-options .features=${toggleRouter} .sketchBook=${sketchBook}></brush-options> `
    );

    const pickers: Array<HTMLDivElement> = el.shadowRoot.querySelectorAll('.rounded') as Array<HTMLDivElement>;
    expect(pickers).to.have.length(2);

    const bgColorPicker: HTMLDivElement = pickers[0];
    await expect(bgColorPicker).to.have.attribute('type').to.be.equal('color');
    expect(bgColorPicker).to.have.value('#ffffff');

    const colorPicker: HTMLDivElement = pickers[1];
    await expect(colorPicker).to.have.attribute('type').to.be.equal('color');
    expect(colorPicker).to.have.value('#000000');
  });

});
