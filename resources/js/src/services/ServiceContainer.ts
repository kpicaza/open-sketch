import {SketchBookRepository} from "../domain/SketchBookRepository.js";
import {FeatureFlagsRepository} from "../domain/FeatureFlagsRepository.js";

class ServiceContainer {
  // eslint-disable-next-line no-use-before-define
  private static _instance: ServiceContainer;

  private services: any = null;

  init(services: any = null) {
    if (services) {
      this.services = services;
      return;
    }

    if (this.services) {
      return;
    }

    const sketchBookRepository = new SketchBookRepository();
    const featureFlagsRepository = new FeatureFlagsRepository();
    this.services = {
      'sketchbook.repository': sketchBookRepository,
      'feature.flags.repository': featureFlagsRepository,
    };
  }

  public set(serviceName: string, service: any) {
    this.services[serviceName] = service;
  }

  public get(serviceName: string) {
    return this.services[serviceName];
  }

  public static get Instance() {
    let instance = this._instance;
    // Do you need arguments? Make it a regular static method instead.
    instance = instance || (this._instance = new this());

    return instance;
  }
}

export default ServiceContainer.Instance as ServiceContainer;
