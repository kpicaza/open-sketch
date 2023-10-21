import {Feature} from "../types/Feature.js";

export class FeatureFlagsRepository {
  public async all() {
    const response = (await fetch(
      '/api/features',
      {
        method: 'GET',
        headers: {
          'content-type': 'application/json;charset=UTF-8',
        },
      }
    ));

    return await response.json() as Array<Feature>;
  }

  public async enable(featureId: string) {
    await fetch(
      `/api/features/${  featureId}`,
      {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json;charset=UTF-8',
        },
        body: JSON.stringify({
          "action": "enable_feature",
        })
      }
    );
  }

  public async disable(featureId: string) {
    await fetch(
      `/api/features/${  featureId}`,
      {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json;charset=UTF-8',
        },
        body: JSON.stringify({
          "action": "disable_feature",
        })
      }
    );
  }
}
