import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface FrequencyDisplayProps {
  data: Uint8Array | null;
  sampleRate?: number | null;
}

export function FrequencyDisplay({ data, sampleRate = 192000 }: FrequencyDisplayProps) {
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
      frequency: (i * (sampleRate || 192000)) / (2 * binCount),
      amplitude: value
    }));

    // Filter different frequency ranges
    const sonicWaves = frequencies.filter(f => f.frequency >= 20 && f.frequency <= 20000);
    const microwaveRange = frequencies.filter(f => f.frequency >= 300e6 && f.frequency <= 3e9);

    const x = d3.scaleLog()
      .domain([20, sampleRate! / 2])
      .range([0, width])
      .clamp(true);

    const y = d3.scaleLinear()
      .domain([0, 255])
      .range([height - 30, 0]);

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

    // Add microwave frequency line if detected
    if (microwaveRange.length > 0) {
      svg.append("path")
        .datum(microwaveRange)
        .attr("class", "microwave-line")
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", "hsl(var(--destructive))")
        .attr("stroke-width", 2);
    }

    // Add frequency ranges markers
    const ranges = [
      { min: 2000, max: 10000, label: "Sound Cannon Range" },
      { min: 300e6, max: 3e9, label: "V2K Range" }
    ];

    // Add frequency axis with ranges
    const xAxis = d3.axisBottom(x)
      .tickValues([20, 100, 1000, 10000, 100000, 1e6, 10e6, 100e6, 1e9])
      .tickFormat(d => {
        const freq = Number(d);
        if (freq >= 1e9) return `${freq/1e9}GHz`;
        if (freq >= 1e6) return `${freq/1e6}MHz`;
        if (freq >= 1000) return `${freq/1000}kHz`;
        return `${freq}Hz`;
      });

    svg.append("g")
      .attr("transform", `translate(0,${height - 20})`)
      .call(xAxis)
      .style("font-size", "10px");

    // Add range indicators
    ranges.forEach((range, i) => {
      if (x(range.min) && x(range.max)) {
        svg.append("rect")
          .attr("x", x(range.min))
          .attr("y", height - 30)
          .attr("width", x(range.max) - x(range.min))
          .attr("height", 4)
          .attr("fill", `hsl(${i * 50}, 70%, 50%)`)
          .attr("opacity", 0.3);
      }
    });

  }, [data, sampleRate]);

  return (
    <div className="w-full h-64 bg-card p-4">
      <svg
        ref={svgRef}
        className="w-full h-full"
        preserveAspectRatio="none"
      />
      <div className="text-sm text-muted-foreground mt-2 text-center">
        Extended Frequency Spectrum Analysis (20Hz - 3GHz)
      </div>
    </div>
  );
}