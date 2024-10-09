import { ComponentLoader } from 'adminjs';

const componentLoader = new ComponentLoader();

const CustomComponents = {
  PreviewImage: componentLoader.add('PreviewImage', './components/PreviewImage.tsx'),
};

export { componentLoader, CustomComponents };
