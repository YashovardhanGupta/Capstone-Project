import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const DataChart = ({ data, isDarkMode }) => {
  if (!data || data.length === 0) {
    return null;
  }

  // Very basic heuristic to find X and Y axes
  // A real BI tool would let the user configure this!
  const columns = Object.keys(data[0]);
  
  // We need at least 2 columns to make a meaningful chart
  if (columns.length < 2) return null;

  // Let's assume the first string/date column is the X-axis (category). If none exists, use the first column.
  let xAxisKey = columns.find(col => typeof data[0][col] === 'string') || columns[0];
  
  // For the Y-axis, look for a numeric column that is NOT the X-axis. 
  // Favor columns that sound like metrics (sum, total, count, etc.)
  let numericColumns = columns.filter(col => typeof data[0][col] === 'number' && col !== xAxisKey);
  
  let yAxisKey = numericColumns.find(col => 
    col.toLowerCase().includes('sum') || 
    col.toLowerCase().includes('total') || 
    col.toLowerCase().includes('count') || 
    col.toLowerCase().includes('avg')
  ) || numericColumns[0] || columns[columns.length > 1 ? 1 : 0];

  // Colors based on Everforest palette and current theme
  const gridColor = isDarkMode ? '#232a2e' : '#f4ebd8';
  const textColor = isDarkMode ? '#d3c6aa' : '#5c6a72';
  const barColor = isDarkMode ? '#a7c080' : '#8a9a5b'; // Everforest Green
  const tooltipBg = isDarkMode ? '#2b3339' : '#fdf6e3';

  return (
    <div className="w-full h-80 mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis 
            dataKey={xAxisKey} 
            stroke={textColor} 
            tick={{ fill: textColor }}
            axisLine={{ stroke: gridColor }}
            tickLine={false}
          />
          <YAxis 
            stroke={textColor} 
            tick={{ fill: textColor }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            cursor={{ fill: isDarkMode ? '#323d43' : '#f4ebd8', opacity: 0.4 }}
            contentStyle={{ 
              backgroundColor: tooltipBg,
              borderColor: gridColor,
              borderRadius: '0.75rem',
              color: textColor,
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Bar 
            dataKey={yAxisKey} 
            fill={barColor} 
            radius={[6, 6, 0, 0]} 
            name={yAxisKey.replace(/_/g, ' ').toUpperCase()}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DataChart;
