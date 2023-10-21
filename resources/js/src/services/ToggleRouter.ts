import {Feature} from "../types/Feature";

export class ToggleRouter {
  features: Array<Feature>

  constructor(features) {
    this.features = features
  }

  public isEnabled(id): boolean {
    const feature = this.features.find((feature) => feature.id == id)

    if (feature?.enabled) {
      return true;
    }

    return false;
  }

  public all(): Array<Feature> {
    return this.features;
  }
}
