import { ShowPropertyProps } from 'adminjs';
import React from 'react';

const PreviewPicture: React.FC<ShowPropertyProps> = (props) => {
  return (
    <img
      src={props.property.props.baseUrl + props.record.params[props.property.props.field]}
      style={{ width: '150px', height: '100px', objectFit: 'cover' }}
    />
  );
};

export default PreviewPicture;
