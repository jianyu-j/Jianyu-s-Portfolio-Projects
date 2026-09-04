import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';

interface RadarVisProps {
    data: any[];
    dataKey: string;
    gridColor?: string;
    strokeColor?: string;
    fillColor?: string;
    maxDomain?: number;
    onClick?: (data: any) => void;
}

export const RadarVis: React.FC<RadarVisProps> = ({ 
    data, 
    dataKey, 
    gridColor = "#e5e7eb", 
    strokeColor = "#2e7d32", 
    fillColor = "#2e7d32",
    maxDomain = 10,
    onClick
}) => {
    return (
        <div className="w-full h-[300px] cursor-pointer" onClick={() => onClick && onClick(null)}>
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                    <PolarGrid stroke={gridColor} />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#4b5563', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, maxDomain]} tick={false} axisLine={false} />
                    <Radar
                        name="Score"
                        dataKey={dataKey}
                        stroke={strokeColor}
                        fill={fillColor}
                        fillOpacity={0.4}
                        onClick={(e: any) => {
                            if (onClick && e && e.payload) onClick(e.payload);
                        }}
                    />
                    <Tooltip />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
};