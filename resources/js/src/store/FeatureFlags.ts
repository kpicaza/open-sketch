import {FeatureFlagsRepository} from "../domain/FeatureFlagsRepository.js";
import serviceContainer from '../services/ServiceContainer.js';


export const featuresAvailable = async () => {
  const featureFlagsRepository: FeatureFlagsRepository = serviceContainer.get('feature.flags.repository');
  return featureFlagsRepository.all();
}

export const enableFeature = async (feature: string) => {
  const featureFlagsRepository: FeatureFlagsRepository = serviceContainer.get('feature.flags.repository');
  await featureFlagsRepository.enable(feature);
}

export const disableFeature = async (feature: string) => {
  const featureFlagsRepository: FeatureFlagsRepository = serviceContainer.get('feature.flags.repository');
  await featureFlagsRepository.disable(feature);
}
