/**
 * ### Диаграмма Line
 *
 * @module Line
 *
 * Created by Evgeniy Malyarov on 18.08.2018.
 */

import React from 'react';
import PropTypes from 'prop-types';

import {chartData} from './Bar';


function Line({width, height, data, isFullscreen, Recharts}) {
  const {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} = Recharts;
  if(isFullscreen) {
    width = window.innerWidth - 16;
    height = window.innerHeight - 64;
  }
  else if(!height) {
    height = width <= 600 ? width * 1.2 : width / 2.6;
  }
  const xDataKey = data.points && data.points.length && data.points[0].name || 'name';

  return (
    <LineChart width={width} height={height} margin={{left: isFullscreen ? 0 : -8, top: 8, bottom: 8}} data={chartData(data)}>
      <CartesianGrid strokeDasharray="3 3"/>
      {!data.hideXAxis && <XAxis dataKey={xDataKey}/>}
      {!data.hideYAxis && <YAxis/>}
      {!data.hideTooltip && <Tooltip/>}
      {!data.hideLegend && <Legend/>}
      {
        data.series.map((ser, key) =>
          <Line
            name={ser.presentation || ser.name}
            key={`ser-${key}`}
            type="monotone"
            dataKey={ser.name}
            stroke={ser.color || '#8884d8'}
            activeDot={{r: ser.dotRadius || 6}}
          />)
      }
    </LineChart>

  );
}

Line.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number,
  data: PropTypes.object.isRequired,
  isFullscreen: PropTypes.bool,
  Recharts: PropTypes.func.isRequired,
};

export default Line;
