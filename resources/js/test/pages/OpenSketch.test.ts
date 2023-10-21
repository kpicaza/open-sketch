import {expect} from "@esm-bundle/chai";
import {elementUpdated, fixture} from "@open-wc/testing";
import {html} from "lit";
import serviceContainer from '../../src/services/ServiceContainer';
import {FeatureFlagsRepository} from "../../src/domain/FeatureFlagsRepository";
import {SketchBookRepository} from "../../src/domain/SketchBookRepository";
import {OpenSketch} from "../../src/pages/OpenSketch";
import "../../src/pages/open-sketch.js";
import {registerTranslateConfig} from "lit-translate";
import {Strings} from "lit-translate/model";


registerTranslateConfig({
  loader: async function (): Promise<Strings> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {}
  }
});

serviceContainer.init({
  'sketchbook.repository': {
    get: async (sketchBookId) => {
      return {
        id: sketchBookId,
        sketches: [],
        background: '#ffffff',
      }
    }
  } as SketchBookRepository,
  'feature.flags.repository': {
    all: async () => []
  } as FeatureFlagsRepository
});


describe('<open-sketch> page.', () => {

  it('should be refreshed after window resize', async () => {
    const el: OpenSketch = await fixture(html` <open-sketch sketchBookId="someUuid"></open-sketch> `);

    expect(el.resetCanvas).to.be.false;
    window.dispatchEvent(new Event('resize'));
    await elementUpdated(el);

    expect(el.resetCanvas).to.be.true;

    await expect(el).to.be.accessible();
  })

})
