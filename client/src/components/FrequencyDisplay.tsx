import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface FrequencyDisplayProps {
  data: Uint8Array | null;
}

export function FrequencyDisplay({ data }: FrequencyDisplayProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    svg.selectAll("*").remove();

    const x = d3.scaleLinear()
      .domain([0, data.length])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, 255])
      .range([height, 0]);

    const line = d3.line<number>()
      .x((d, i) => x(i))
      .y(d => y(d))
      .curve(d3.curveMonotoneX);

    svg.append("path")
      .datum(Array.from(data))
      .attr("class", "frequency-line")
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", "hsl(var(--primary))")
      .attr("stroke-width", 2);

  }, [data]);

  return (
    <div className="w-full h-64 bg-card">
      <svg
        ref={svgRef}
        className="w-full h-full"
        preserveAspectRatio="none"
      />
    </div>
  );
}
