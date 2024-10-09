import { ActionRequest, buildFeature, FeatureType, ValidationError } from 'adminjs';

type requiredConfig = {
  fields: string[];
};
const actionHook = (config: requiredConfig) => async (request: ActionRequest) => {
  if (!request.payload) {
    return request;
  }

  if (request.method === 'post') {
    const payload = request.payload;
    const errors: { [key: string]: { message: string } } = {};

    for (const field of config.fields) {
      if (!payload[field]) {
        errors[field] = {
          message: `${field} is required`,
        };
      }
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidationError(errors);
    }
  }

  return request;
};

export const requiredFeature = (config: requiredConfig): FeatureType => {
  return buildFeature({
    actions: {
      new: {
        before: [actionHook(config)],
      },
      edit: {
        before: [actionHook(config)],
      },
    },
  });
};
