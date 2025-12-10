import React from 'react';
import Content from '@theme-original/DocItem/Content';

export default function ContentWrapper(props) {
  return (
    <>
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
      </div>
      <Content {...props} />
    </>
  );
}
