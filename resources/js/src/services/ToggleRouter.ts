import {Feature} from "../types/Feature.js";

export class ToggleRouter {
  features: Array<Feature>

  constructor(features) {
    this.features = features
  }

  public isEnabled(id): boolean {
    const feature = this.features.find((currentFeature) => currentFeature.id === id)

    if (feature?.enabled) {
      return true;
    }

    return false;
  }

  public all(): Array<Feature> {
    return this.features;
  }
}
