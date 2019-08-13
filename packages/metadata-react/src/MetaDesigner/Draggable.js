import React from 'react';

export default function Draggable({children, title, ...props}) {
  return <div className="designer-component">
    <div className="designer-draggable-handle">{title}</div>
    <div className="designer-content">{children}</div>
  </div>;
}
