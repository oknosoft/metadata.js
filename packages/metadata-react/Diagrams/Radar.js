/**
 * ### Диаграмма Radar
 *
 * @module Radar
 *
 * Created by Evgeniy Malyarov on 18.08.2018.
 */

import React from 'react';
import PropTypes from 'prop-types';

import {chartData} from './Bar';

function Radar({width, height, data, isFullscreen, Recharts}) {
  const {Radar, RadarChart, PolarGrid, Legend, Tooltip, PolarAngleAxis, PolarRadiusAxis} = Recharts;
  if(isFullscreen) {
    width = window.innerWidth - 64;
    height = window.innerHeight - 64;
  }
  else if(!height) {
    height = width <= 600 ? width * 1.2 : width / 2.4;
  }
  const xDataKey = data.points && data.points.length && data.points[0].name || 'name';

  return (
    <RadarChart width={width} height={height} margin={{left: isFullscreen ? 0 : -8, top: 8, bottom: 8}} data={chartData(data)}>
      <PolarGrid />
      {!data.hideXAxis && <PolarAngleAxis dataKey={xDataKey}/>}
      {!data.hideYAxis && <PolarRadiusAxis/>}
      {!data.hideTooltip && <Tooltip/>}
      {!data.hideLegend && <Legend/>}
      {
        data.series.map((ser, key) =>
          <Radar
            name={ser.presentation || ser.name}
            key={`ser-${key}`}
            dataKey={ser.name}
            stroke={ser.color || '#8884d8'}
            fill={ser.color || '#8884d8'}
            fillOpacity={ser.opacity || 0.6}
          />)
      }
    </RadarChart>
  );
}

Radar.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number,
  data: PropTypes.object.isRequired,
  isFullscreen: PropTypes.bool,
  Recharts: PropTypes.func.isRequired,
};

export default Radar;
