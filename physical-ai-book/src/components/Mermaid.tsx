import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

type MermaidProps = {
  chart: string;
  id?: string;
};

const Mermaid: React.FC<MermaidProps> = ({ chart, id = 'mermaid-chart' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    mermaid.initialize({ startOnLoad: false });

    (async () => {
      try {
        const result = await mermaid.render(id, chart);
        const { svg, bindFunctions } = result;
        containerRef.current.innerHTML = svg;
        bindFunctions?.(containerRef.current);
      } catch (err) {
        containerRef.current.innerHTML = `<pre>Error rendering Mermaid diagram: ${err}</pre>`;
      }
    })();
  }, [chart, id]);

  return <div ref={containerRef} />;
};

export default Mermaid;
