import React from 'react';
import Content from '@theme-original/DocItem/Content';
import PersonalizationToggle from '@site/src/components/PersonalizationToggle';
import UrduTranslator from '@site/src/components/UrduTranslator';

export default function ContentWrapper(props) {
  return (
    <>
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <PersonalizationToggle />
        <UrduTranslator />
      </div>
      <Content {...props} />
    </>
  );
}
