/**
 * ### Диаграмма Bar
 *
 * @module Bar
 *
 * Created by Evgeniy Malyarov on 18.08.2018.
 */

import React from 'react';
import PropTypes from 'prop-types';

export function CustomTooltip({payload, label, active}) {
  return active && <div>{`${label} : ${payload[0].value}`}</div>;
}

export function CustomLabel (props) {
  const {x, y, value, width, offset} = props;
  return (value &&
    <text x={x + width / 2} y={y - offset} textAnchor="middle">
      {`${value}`}
    </text>
  );
}

// function getPath (x, y, width, height) {
//   return `M${x},${y + height} L${x},${y} L${x+width},${y} L${x+width},${y + height} Z`;
// }

export function CustomImg(props) {
  const {x, y, width, height, img, value} = props;
  return img &&
    <g>
      <text x={x + width / 2} y={y - 5} textAnchor="middle">
        {`${value}`}
      </text>
      <image href={img} x={x + width / 2 - 24} y={y} height={height*0.9} opacity={0.8}/>
    </g>;
}

export function chartData({rows}) {
  return rows.map((v) => {
    const clone = {};
    for(const fld in v) {
      const val = v[fld];
      clone[fld] = (val && typeof val === 'object') ? (val.value || 0) : val;
    }
    return clone;
  });
}

function Bar({width, height, data, isFullscreen, Recharts}) {
  const {ComposedChart, Bar, Line, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend} = Recharts;
  if(isFullscreen) {
    width = window.innerWidth - 16;
    height = window.innerHeight - 64;
  }
  else if(!height) {
    height = width <= 600 ? width * 1.2 : width / 2.6;
  }
  const xDataKey = data.points && data.points.length && data.points[0].name || 'name';

  return (
    <ComposedChart width={width} height={height} margin={{left: isFullscreen ? 0 : -8, top: 8, bottom: 8}} data={chartData(data)}>
      <CartesianGrid strokeDasharray="3 3"/>
      {!data.hideXAxis && <XAxis dataKey={xDataKey}/>}
      {!data.hideYAxis && <YAxis/>}
      {data.customTooltip ?
        <Tooltip content={<CustomTooltip/>}/>
        :
        !data.hideTooltip && <Tooltip/>
      }
      {!data.hideLegend && <Legend/>}
      {data.customCell ?
        data.series.map((ser, key) => <Bar
          name={ser.presentation || ser.name}
          key={`ser-${key}`}
          dataKey={ser.name}
          fill={ser.color || '#8884d8'}
          fillOpacity={ser.opacity || 0.7}
        >
          {
            data.rows.map((entry, key) => <Cell
              key={`cell-${key}`}
              fill={entry[ser.name].color}
              fillOpacity={ser.opacity || 0.7}
            />)
          }
          </Bar>)
        :
        data.series.map((ser, ind) => {
          const key = `ser-${ind}`;
          switch(ser.type) {
          case 'img':
            return <Bar
              name={ser.presentation || ser.name}
              key={key}
              dataKey={ser.name}
              fill={ser.color || '#8884d8'}
              fillOpacity={ser.opacity || 0.7}
              shape={<CustomImg/>}
            />;
          case 'line':
            return <Line
              name={ser.presentation || ser.name}
              key={key}
              type="monotone"
              dataKey={ser.name}
              stroke={ser.color || '#8884d8'}
              activeDot={{r: ser.dotRadius || 6}}
            />;
          default:
            return <Bar
              name={ser.presentation || ser.name}
              key={key}
              dataKey={ser.name}
              stackId={ser.stack}
              fill={ser.color || '#8884d8'}
              fillOpacity={ser.opacity || 0.7}
            />;
          }
        })
      }
    </ComposedChart>
  );
}

Bar.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number,
  data: PropTypes.object.isRequired,
  isFullscreen: PropTypes.bool,
  Recharts: PropTypes.func.isRequired,
};

export default Bar;
