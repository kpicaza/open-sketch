import {elementUpdated, fixture} from "@open-wc/testing";
import {expect} from "@esm-bundle/chai";
import {html} from "lit";
import {ToggleRouter} from "../../../src/services/ToggleRouter.js";
import {Feature} from "../../../src/types/Feature.js";
import {defaultSketchBook} from "../../../src/domain/model/SketchBook.js";
import {BrushOptions} from "../../../src/components/drawing-tools/BrushOptions.js";
import "../../../src/components/drawing-tools/BrushOptions.js";

describe('<brush-options> components.', () => {

  it('should have different brush types', async () => {
    const sketchBook = defaultSketchBook();
    const el: BrushOptions = await fixture(
      html` <brush-options .features=${new ToggleRouter([])} .sketchBook=${sketchBook}></brush-options> `
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
    const sketchBook = defaultSketchBook();
    const el: BrushOptions = await fixture(
      html` <brush-options .features=${new ToggleRouter([])} .sketchBook=${sketchBook}></brush-options> `
    );

    const colorPicker: HTMLDivElement = el.shadowRoot.querySelector('.color');
    expect(colorPicker).to.have.attribute('type').to.be.equal('color');
    expect(colorPicker).to.have.value('#000000');
  });

  it('should have a brush line width slider', async () => {
    const sketchBook = defaultSketchBook();
    const el: BrushOptions = await fixture(
      html` <brush-options .features=${new ToggleRouter([])} .sketchBook=${sketchBook}></brush-options> `
    );
    await elementUpdated(el);

    const lineWidthSlider: HTMLInputElement = el.shadowRoot.querySelector('.brush-width-slider');
    expect(lineWidthSlider.value).to.be.equal(9.42477796076938);
    expect(el.lineWidth).to.be.equal(3);
  });


  it('should have a background color picker (Experimental)', async () => {
    const toggleRouter = new ToggleRouter([
      {
        id: 'canvas-background-color',
        enabled: true
      } as Feature
    ]);
    const sketchBook = defaultSketchBook();
    const el: BrushOptions = await fixture(
      html` <brush-options .features=${toggleRouter} .sketchBook=${sketchBook}></brush-options> `
    );

    const pickers: Array<HTMLDivElement> = el.shadowRoot.querySelectorAll('.rounded') as Array<HTMLDivElement>;

    const bgColorPicker: HTMLDivElement = pickers[0];
    expect(bgColorPicker).to.have.value('#ffffff');

    const colorPicker: HTMLDivElement = pickers[1];
    expect(colorPicker).to.have.value('#000000');
  });

  it('should have three secondary color pickers', async () => {
    const sketchBook = defaultSketchBook();
    const el: BrushOptions = await fixture(
      html` <brush-options .features=${new ToggleRouter([])} .sketchBook=${sketchBook}></brush-options> `
    );
    const pickers: Array<HTMLInputElement> = await el.shadowRoot.querySelectorAll('.rounded') as Array<HTMLInputElement>;
    expect(el.color).to.be.equal('#000000');

    const pickerColor =  pickers[0].value;
    const recentColor = el.color;
    pickers[0].click();
    await elementUpdated(el);
    expect(el.color).to.be.equal(pickerColor);
    expect(pickers[0].value).to.be.equal(recentColor);

    const pickerColor1 =  pickers[1].value;
    const recentColor1 = el.color;
    pickers[1].click();
    await elementUpdated(el);
    expect(el.color).to.be.equal(pickerColor1);
    expect(pickers[1].value).to.be.equal(recentColor1);

    const pickerColor2 =  pickers[2].value;
    const recentColor2 = el.color;
    pickers[2].click();
    await elementUpdated(el);
    expect(el.color).to.be.equal(pickerColor2);
    expect(pickers[2].value).to.be.equal(recentColor2);

  });

});
