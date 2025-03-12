import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface FrequencyDisplayProps {
  data: Uint8Array | null;
  sampleRate?: number | null;
}

export function FrequencyDisplay({ data, sampleRate = 44100 }: FrequencyDisplayProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    svg.selectAll("*").remove();

    // Calculate frequency for each bin
    const binCount = data.length;
    const frequencies = Array.from(data).map((value, i) => ({
      frequency: (i * (sampleRate || 44100)) / (2 * binCount),
      amplitude: value
    }));

    // Filter sonic wave frequencies (20Hz - 20kHz)
    const sonicWaves = frequencies.filter(f => f.frequency >= 20 && f.frequency <= 20000);

    const x = d3.scaleLog()
      .domain([20, 20000])
      .range([0, width])
      .clamp(true);

    const y = d3.scaleLinear()
      .domain([0, 255])
      .range([height, 0]);

    // Create the line generator
    const line = d3.line<{frequency: number, amplitude: number}>()
      .x(d => x(d.frequency))
      .y(d => y(d.amplitude))
      .curve(d3.curveMonotoneX);

    // Add the frequency line
    svg.append("path")
      .datum(sonicWaves)
      .attr("class", "frequency-line")
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", "hsl(var(--primary))")
      .attr("stroke-width", 2);

    // Add frequency axis
    const xAxis = d3.axisBottom(x)
      .tickValues([20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000])
      .tickFormat(d => {
        const freq = Number(d);
        return freq >= 1000 ? `${freq/1000}kHz` : `${freq}Hz`;
      });

    svg.append("g")
      .attr("transform", `translate(0,${height - 20})`)
      .call(xAxis)
      .style("font-size", "10px");

  }, [data, sampleRate]);

  return (
    <div className="w-full h-64 bg-card p-4">
      <svg
        ref={svgRef}
        className="w-full h-full"
        preserveAspectRatio="none"
      />
      <div className="text-sm text-muted-foreground mt-2 text-center">
        Frequency Spectrum (20Hz - 20kHz)
      </div>
    </div>
  );
}