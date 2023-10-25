import {elementUpdated, fixture, waitUntil} from "@open-wc/testing";
import {html} from "lit";
import {expect} from "@esm-bundle/chai";
import {SketchNavigator} from "../../../src/components/sketch-book/SketchNavigator.js";
import {defaultSketchBook} from "../../../src/domain/model/SketchBook.js";
import "../../../src/components/sketch-book/SketchNavigator.js";
import {Sketch} from "../../../src/domain/model/Sketch.js";

describe('<sketch-nav> component.', () => {

  it('should show all available sketches in the sketch book', async () => {
    const sketches: Array<Sketch> = [
      {
        id: 1,
        image: 'data:,'
      },
      {
        id: 2,
        image: 'data:,'
      },
    ] as Array<Sketch>;
    const sketchBook = defaultSketchBook();
    sketchBook.sketches = sketches;

    const scrollWrapper:HTMLDivElement = document.createElement('div') as HTMLDivElement;
    const el: SketchNavigator = await fixture(html`
      <sketch-nav
        .sketchBook=${sketchBook}
        .scrollWrapper=${scrollWrapper}
      ></sketch-nav>
    `);
    await waitUntil(() => el.scrollWrapper, 'Element did not become ready');

    const previews: Array<HTMLDivElement> = el.shadowRoot.querySelectorAll(
      'sketch-preview'
    ) as Array<HTMLDivElement>;

    expect(previews).to.has.length(2);
  });

  it('should show right arrow when the sketches fit more space than the screen width', async () => {
    const sketches: Sketch[] = new Array(15).fill(null).map((a, key) => ({
        id: key + 1,
        image: 'data:,'
      } as Sketch));
    const sketchBook = defaultSketchBook();
    sketchBook.sketches = sketches;

    const scrollWrapper: HTMLDivElement = document.createElement('div') as HTMLDivElement;
    const el: SketchNavigator = await fixture(html`
      <sketch-nav
        .sketchBook=${sketchBook}
        .scrollWrapper=${scrollWrapper}
      ></sketch-nav>
    `);
    el.showRightArrow = true;
    await elementUpdated(el);

    expect(el.previewScrollPosition).to.be.equal(0);

    const rightArrow: HTMLDivElement = await el.shadowRoot.querySelector('.right-previews');
    rightArrow.click();
    await elementUpdated(el);

    expect(el.previewScrollPosition).to.be.equal(400);
  });

  it('should show left arrow when the sketches nav scrollLeft is greater than 0', async () => {
    const sketches: Sketch[] = new Array(15).fill(null).map((a, key) => ({
        id: key + 1,
        image: 'data:,'
      } as Sketch));
    const sketchBook = defaultSketchBook();
    sketchBook.sketches = sketches;

    const scrollWrapper: HTMLDivElement = document.createElement('div') as HTMLDivElement;
    const el: SketchNavigator = await fixture(html`
      <sketch-nav
        .sketchBook=${sketchBook}
        .scrollWrapper=${scrollWrapper}
      ></sketch-nav>
    `);
    el.scrollWrapper.scrollLeft = 400;
    el.previewScrollPosition = 400;
    await elementUpdated(el);
    await new Promise(resolve => {setTimeout(resolve, 100)});
    expect(el.showLeftArrow).to.be.true;

    const leftArrow: HTMLDivElement = await el.shadowRoot.querySelector('.left-previews');
    leftArrow.click();
    await new Promise(resolve => {setTimeout(resolve, 100)});

    expect(el.showLeftArrow).to.be.false;
    expect(el.previewScrollPosition).to.be.lessThan(1);
  });

});
