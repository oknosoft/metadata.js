/**
 * ### Диаграмма
 * Рисует диаграмму
 *
 * @module Diagram
 *
 * Created by Evgeniy Malyarov on 16.08.2018.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import {Swipeable, LEFT, RIGHT} from 'react-swipeable';
import Bar from './Bar';
import Line from './Line';
import Radar from './Radar';
import Table from './Table';
import MuiTable from './MuiTable';

let Recharts;

function TypedDiagram(props) {
  let diagram;
  switch (props.data.kind) {
  case 'line':
    diagram = Line(props);
    break;
  case 'radar':
    diagram = Radar(props);
    break;
  case 'bar':
  case 'pie':
    diagram = Bar(props);
    break;
  case 'table':
    diagram = Table(props);
    break;
  case 'muitable':
    diagram = MuiTable(props);
    break;
  default:
    diagram = <div>{`Неизвестный тип диаграммы '${props.data.kind}'`}</div>;
  }
  return <Swipeable
    onSwiping={({dir}) => {
      if(dir === LEFT) props.swipingLeft();
      if(dir === RIGHT) props.swipingRight();
    }}
    delta={20}>{diagram}</Swipeable>;
}

class Diagram extends React.Component {

  componentDidMount() {
    if(!Recharts) {
      import('recharts')
        .then((module) => {
          Recharts = module;
          !this._unmount && this.forceUpdate();
        });
    }
  }

  componentWillUnmount() {
    this._unmount = true;
  }

  render() {
    const {width, height, data, classes, isFullscreen, toggleFullscreen, prev, next} = this.props;
    return [
      <div key="title" className={classes.container}>
        <Typography variant="h6" component="h3" color="primary" className={classes.flex}>{data.title}</Typography>
        <IconButton title={isFullscreen ? 'Свернуть' : 'Развернуть'} onClick={toggleFullscreen}>
          {isFullscreen ? <FullscreenExitIcon/> : <FullscreenIcon/>}
        </IconButton>
      </div>,
      !Recharts && <div key="loading"><CircularProgress size={24} /> Загрузка...</div>,
      Recharts && <TypedDiagram
        key="diagram"
        classes={classes}
        Recharts={Recharts}
        swipingLeft={prev}
        swipingRight={next}
        width={width}
        height={height}
        data={data}
        isFullscreen={isFullscreen}/>,
      ];
  }
}

TypedDiagram.propTypes = {
  data: PropTypes.object.isRequired,
  swipingLeft: PropTypes.func.isRequired,
  swipingRight: PropTypes.func.isRequired,
};

Diagram.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number,
  data: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  isFullscreen: PropTypes.bool,
  toggleFullscreen: PropTypes.func,
  prev: PropTypes.func,
  next: PropTypes.func,
};

export default Diagram;
