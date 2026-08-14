'use client';

import { createElement, type ComponentType, useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import * as d3 from 'd3';
import * as LucideIcons from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';

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
  urlQuery?: string;
  urlRoute?: string;
};

type NodeMenuState = {
  node: GraphNode;
  x: number;
  y: number;
} | null;

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

function getNodeDestinations(node: GraphNode, groups: NodeCategory[]) {
  const group = groups.find((item) => item.id === node.group);

  if (!group) {
    return {
      route: undefined,
      query: undefined,
    };
  }

  return {
    route: group.urlRoute ? `${group.urlRoute}${node.id}` : undefined,

    query: group.urlQuery ? `${group.urlQuery}${encodeURIComponent(node.label)}` : undefined,
  };
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
  const [nodeMenu, setNodeMenu] = useState<NodeMenuState>(null);
  const router = useRouter();
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const openRoute = (node: GraphNode) => {
    const { route } = getNodeDestinations(node, groups);

    if (route) {
      router.push(route);
    }

    setNodeMenu(null);
  };

  const openQuery = (node: GraphNode) => {
    const { query } = getNodeDestinations(node, groups);

    if (query) {
      router.push(query);
    }

    setNodeMenu(null);
  };

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
      .attr('stroke-opacity', 1)
      .attr('stroke-width', 1.5)
      .attr('pointer-events', 'none');

    const nodeG = g
      .append('g')
      .selectAll<SVGGElement, GraphNode>('g.node')
      .data(filteredNodes)
      .join('g')
      .attr('class', 'node')
      .on('click', (event, d) => {
        event.stopPropagation();

        const { route, query } = getNodeDestinations(d, groups);

        if (route) {
          router.push(route);
        } else if (query) {
          router.push(query);
        }
      })
      .on('contextmenu', (event, d) => {
        event.preventDefault();
        event.stopPropagation();

        const { route, query } = getNodeDestinations(d, groups);

        if (!route && !query) {
          return;
        }

        setNodeMenu({
          node: d,
          x: event.clientX,
          y: event.clientY,
        });
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
      className={`relative h-full w-full overflow-hidden rounded-2xl border min-h-100 ${className}`}
    >
      <div className="absolute inset-0">
        <svg ref={svgRef} className="h-full w-full" style={{ background: 'var(--card)' }} />
        {nodeMenu && (
          <ContextMenu
            open
            onOpenChange={(open) => {
              if (!open) {
                setNodeMenu(null);
              }
            }}
          >
            <ContextMenuTrigger
              asChild
              className="pointer-events-none fixed h-0 w-0"
              style={{
                left: nodeMenu.x,
                top: nodeMenu.y,
              }}
            >
              <span />
            </ContextMenuTrigger>

            <ContextMenuContent
              className="w-52"
              style={{
                position: 'fixed',
                left: nodeMenu.x,
                top: nodeMenu.y,
              }}
            >
              <div className="px-2 py-1.5">
                <p className="truncate text-sm font-medium">{nodeMenu.node.label}</p>
                <p className="text-xs text-muted-foreground">Choose where to open this item</p>
              </div>

              <ContextMenuSeparator />

              {getNodeDestinations(nodeMenu.node, groups).route && (
                <ContextMenuItem onSelect={() => openRoute(nodeMenu.node)}>
                  <LucideIcons.FolderOpen className="mr-2 h-4 w-4" />
                  Open details
                </ContextMenuItem>
              )}

              {getNodeDestinations(nodeMenu.node, groups).query && (
                <ContextMenuItem onSelect={() => openQuery(nodeMenu.node)}>
                  <LucideIcons.Search className="mr-2 h-4 w-4" />
                  View related items
                </ContextMenuItem>
              )}

              <ContextMenuItem onSelect={() => setNodeMenu(null)}>
                <LucideIcons.ExternalLink className="mr-2 h-4 w-4" />
                Cancel
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        )}
      </div>
    </div>
  );
}
