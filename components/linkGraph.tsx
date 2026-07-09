'use client';

import { useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';

type GraphNode = d3.SimulationNodeDatum & {
  id: string;
  label: string;
  group?: string;
  radius?: number;
};

type GraphLink = d3.SimulationLinkDatum<GraphNode> & {
  source: string | GraphNode;
  target: string | GraphNode;
};

const NODES: GraphNode[] = [
  { id: 'frontend', label: 'Next.js Frontend', group: 'ui', radius: 14 },
  { id: 'canvas', label: 'Konva Canvas', group: 'ui', radius: 10 },
  { id: 'api', label: 'API Server', group: 'backend', radius: 16 },
  { id: 'detection', label: 'Detection Service', group: 'backend', radius: 12 },
  { id: 'prompt-engine', label: 'Prompt Engine', group: 'backend', radius: 12 },
  { id: 'gemini', label: 'Gemini Flash', group: 'ai', radius: 14 },
  { id: 'llm-optimizer', label: 'LLM Optimizer', group: 'ai', radius: 12 },
  { id: 'image-store', label: 'Image Storage', group: 'ai', radius: 10 },
  { id: 'db-detections', label: 'Detections DB', group: 'db', radius: 12 },
  { id: 'db-prompts', label: 'Prompts DB', group: 'db', radius: 12 },
];

const LINKS: GraphLink[] = [
  { source: 'frontend', target: 'api' },
  { source: 'frontend', target: 'canvas' },
  { source: 'canvas', target: 'api' },
  { source: 'api', target: 'detection' },
  { source: 'api', target: 'llm-optimizer' },
  { source: 'api', target: 'db-detections' },
  { source: 'api', target: 'image-store' },
  { source: 'detection', target: 'gemini' },
  { source: 'prompt-engine', target: 'api' },
  { source: 'prompt-engine', target: 'gemini' },
  { source: 'prompt-engine', target: 'db-prompts' },
  { source: 'llm-optimizer', target: 'prompt-engine' },
  { source: 'llm-optimizer', target: 'db-prompts' },
  { source: 'db-detections', target: 'canvas' },
  { source: 'image-store', target: 'detection' },
];

const GROUP_COLORS: Record<string, string> = {
  ui: '#7c6aed',
  backend: '#4a9eff',
  ai: '#3ecf8e',
  db: '#f97316',
};

export default function LinkGraph({ className = '' }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const build = useCallback(() => {
    const wrap = wrapRef.current;
    const svg = svgRef.current;
    if (!wrap || !svg) return;

    const W = wrap.clientWidth;
    const H = wrap.clientHeight;

    d3.select(svg).selectAll('*').remove();

    const root = d3
      .select(svg)
      .attr('width', W)
      .attr('height', H)
      .attr('viewBox', [-W / 2, -H / 2, W, H].join(' '));

    const g = root.append('g');
    root.call(
      d3
        .zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.2, 4])
        .on('zoom', (event) => g.attr('transform', event.transform))
    );

    const nodes: GraphNode[] = NODES.map((n) => ({ ...n }));
    const links: GraphLink[] = LINKS.map((l) => ({ ...l }));

    const defs = root.append('defs');
    const filter = defs.append('filter').attr('id', 'glow');
    filter.append('feGaussianBlur').attr('stdDeviation', '4').attr('result', 'blur');
    const merge = filter.append('feMerge');
    merge.append('feMergeNode').attr('in', 'blur');
    merge.append('feMergeNode').attr('in', 'SourceGraphic');

    const sim = d3
      .forceSimulation(nodes)
      .force(
        'link',
        d3
          .forceLink<GraphNode, GraphLink>(links)
          .id((d) => d.id)
          .distance(120)
          .strength(0.5)
      )
      .force('charge', d3.forceManyBody().strength(-400))
      .force('x', d3.forceX())
      .force('y', d3.forceY())
      .force(
        'collide',
        d3.forceCollide<GraphNode>((d) => (d.radius ?? 10) + 20)
      );

    const link = g
      .append('g')
      .selectAll<SVGLineElement, GraphLink>('line')
      .data(links)
      .join('line')
      .attr('stroke', 'rgba(255,255,255,0.12)')
      .attr('stroke-width', 1.2);

    const node = g
      .append('g')
      .selectAll<SVGCircleElement, GraphNode>('circle')
      .data(nodes)
      .join('circle')
      .attr('r', (d) => d.radius ?? 10)
      .attr('fill', (d) => GROUP_COLORS[d.group ?? 'backend'])
      .attr('stroke', 'rgba(0,0,0,0.4)')
      .attr('stroke-width', 2)
      .attr('cursor', 'grab')
      .call(
        d3
          .drag<SVGCircleElement, GraphNode>()
          .on('start', (event, d) => {
            if (!event.active) sim.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', (event, d) => {
            if (!event.active) sim.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    const label = g
      .append('g')
      .selectAll<SVGTextElement, GraphNode>('text')
      .data(nodes)
      .join('text')
      .text((d) => d.label)
      .attr('text-anchor', 'middle')
      .attr('font-size', '11px')
      .attr('font-family', 'var(--font-geist-sans, sans-serif)')
      .attr('fill', 'rgba(255,255,255,0.6)')
      .attr('pointer-events', 'none');

    sim.on('tick', () => {
      link
        .attr('x1', (d) => (d.source as GraphNode).x ?? 0)
        .attr('y1', (d) => (d.source as GraphNode).y ?? 0)
        .attr('x2', (d) => (d.target as GraphNode).x ?? 0)
        .attr('y2', (d) => (d.target as GraphNode).y ?? 0);

      node.attr('cx', (d) => d.x ?? 0).attr('cy', (d) => d.y ?? 0);

      label.attr('x', (d) => d.x ?? 0).attr('y', (d) => (d.y ?? 0) + (d.radius ?? 10) + 14);
    });

    return () => sim.stop();
  }, []);

  useEffect(() => {
    let stop: (() => void) | undefined;

    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      stop?.();
      stop = build() ?? undefined;
    });

    if (wrapRef.current) {
      ro.observe(wrapRef.current);
    }

    stop = build() ?? undefined;

    return () => {
      stop?.();
      ro.disconnect();
    };
  }, [build]);

  return (
    <div
      ref={wrapRef}
      className={`relative h-full w-full overflow-hidden rounded-3xl border ${className}`}
    >
      <div className="absolute inset-0">
        <svg ref={svgRef} className="h-full w-full" style={{ background: 'var(--card)' }} />
      </div>
    </div>
  );
}
