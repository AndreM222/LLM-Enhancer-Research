'use client';

import { createElement, type ComponentType, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import * as d3 from 'd3';
import * as LucideIcons from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';

export type GraphNode = d3.SimulationNodeDatum & {
  id: string;
  label: string;
  group?: string;
  radius?: number;
};

export type GraphLink = d3.SimulationLinkDatum<GraphNode> & {
  source: string | GraphNode;
  target: string | GraphNode;
};

export type NodeCategory = {
  id: string;
  color: string;
  icon?: string;
  url?: string;
};

function getIconMarkup(iconName: string | undefined, size: number): string {
  if (!iconName) {
    return '';
  }

  const Icon = (LucideIcons as unknown as Record<string, ComponentType<LucideProps>>)[iconName];

  if (!Icon) {
    return '';
  }

  return renderToStaticMarkup(
    createElement(Icon, {
      width: size,
      height: size,
      color: 'white',
      strokeWidth: 2,
      'aria-hidden': true,
    })
  );
}

export default function LinkGraph({
  className = '',
  nodes,
  links,
  groups,
}: {
  className?: string;
  nodes: GraphNode[];
  links: GraphLink[];
  groups: NodeCategory[];
}) {
  const router = useRouter();
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

    const filteredNodes: GraphNode[] = nodes.map((n) => ({ ...n }));
    const filteredLinks: GraphLink[] = links.map((l) => ({ ...l }));

    const defs = root.append('defs');
    const filter = defs.append('filter').attr('id', 'glow');
    filter.append('feGaussianBlur').attr('stdDeviation', '4').attr('result', 'blur');
    const merge = filter.append('feMerge');
    merge.append('feMergeNode').attr('in', 'blur');
    merge.append('feMergeNode').attr('in', 'SourceGraphic');

    const sim = d3
      .forceSimulation(filteredNodes)
      .force(
        'link',
        d3
          .forceLink<GraphNode, GraphLink>(filteredLinks)
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
      .attr('class', 'text-border')
      .selectAll<SVGLineElement, GraphLink>('line')
      .data(filteredLinks)
      .join('line')
      .attr('stroke', 'currentColor')
      .attr('stroke-opacity', 0.8)
      .attr('stroke-width', 1.2)
      .attr('pointer-events', 'none');

    const nodeG = g
      .append('g')
      .selectAll<SVGGElement, GraphNode>('g.node')
      .data(filteredNodes)
      .join('g')
      .attr('class', 'node')
      .on('click', (event, d) => {
        event.stopPropagation();

        const group = groups.find((item) => item.id === d.group);

        if (group?.url) {
          router.push(group.url);
        }
      })
      .attr('cursor', 'grab')
      .call(
        d3
          .drag<SVGGElement, GraphNode>()
          .on('start', (event, d) => {
            if (!event.active) {
              sim.alphaTarget(0.3).restart();
            }

            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', (event, d) => {
            if (!event.active) {
              sim.alphaTarget(0);
            }

            d.fx = null;
            d.fy = null;
          })
      );

    nodeG
      .append('circle')
      .attr('r', (d) => d.radius ?? 10)
      .attr('fill', (d) => groups.find((item) => item.id === d.group)?.color ?? '#ffffff')
      .attr('stroke', 'rgba(0,0,0,0.4)')
      .attr('stroke-width', 2);

    nodeG.each(function (d) {
      const group = groups.find((item) => item.id === d.group);

      if (!group?.icon) {
        return;
      }

      const radius = d.radius ?? 10;
      const iconSize = Math.max(10, Math.min(radius * 1.1, 18));
      const markup = getIconMarkup(group.icon, iconSize);

      if (!markup) {
        return;
      }

      d3.select(this)
        .append('g')
        .attr('class', 'node-icon')
        .attr('transform', `translate(${-iconSize / 2},${-iconSize / 2})`)
        .attr('pointer-events', 'none')
        .html(markup);
    });

    const label = g
      .append('g')
      .selectAll<SVGTextElement, GraphNode>('text')
      .data(filteredNodes)
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

      nodeG.attr('transform', (d) => `translate(${d.x ?? 0},${d.y ?? 0})`);

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
      className={`relative h-full w-full overflow-hidden rounded-3xl border min-h-100 ${className}`}
    >
      <div className="absolute inset-0">
        <svg ref={svgRef} className="h-full w-full" style={{ background: 'var(--card)' }} />
      </div>
    </div>
  );
}
