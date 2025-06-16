"use client";
import * as d3 from "d3";
import { useState } from "react";
import LinePlot from "@/components/LinePlot/LinePlot";

export default function LinePlotPage() {
    const [data, setData] = useState<number[]>([]);

    function onMouseMove(event: React.MouseEvent<HTMLDivElement>) {
        const [x, y] = d3.pointer(event);
        setData(data.slice(-200).concat(Math.atan2(x, y)));
    }
      return (
        <div onMouseMove={onMouseMove}>
          <LinePlot data={data} />
        </div>
      );
}