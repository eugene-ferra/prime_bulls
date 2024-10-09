import { ActionRequest, buildFeature, FeatureType } from 'adminjs';
import slugify from 'slugify';

type slugifyConfig = {
  slugField: string;
  slugFromField: string;
};

const actionHook = (config: slugifyConfig) => async (request: ActionRequest) => {
  if (!request.payload) {
    return request;
  }

  if (request.method === 'post') {
    const payload = request.payload;
    const salt = payload[config.slugFromField];

    if (!salt) throw new Error('slugFromField is required');

    const slug = slugify.default(salt, { lower: true, strict: true, trim: true });

    request.payload = {
      ...payload,
      [config.slugField]: slug,
    };
  }

  return request;
};

export const slugifyFeature = (config: slugifyConfig): FeatureType => {
  if (!config.slugField || !config.slugFromField) {
    throw new Error('slugField and slugFromField are required');
  }

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
