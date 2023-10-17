import {Feature} from "../types/Feature";

export const featuresAvailable = async () => {
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

export const enableFeature = async (feature: string) => {
  const response = await fetch(
    '/api/features/' + feature,
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

export const disableFeature = async (feature: string) => {
  const response = await fetch(
    '/api/features/' + feature,
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
