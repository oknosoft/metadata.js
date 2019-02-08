/**
 * Swipeable массив диаграмм
 *
 * @module DiagramsArray
 *
 * Created by Evgeniy Malyarov on 20.08.2018.
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fullscreenable from 'react-fullscreenable';
import Grid from '@material-ui/core/Grid';
import Diagram from './Diagram';

class DiagramsArray extends Component {

  state = {fullscreen: null};

  prev = () => {
    const {props: {diagrams}, state: {fullscreen}} = this;
    if(fullscreen > 0) {
      this.setState({fullscreen: fullscreen - 1});
    }
    else if(fullscreen !== null) {
      this.setState({fullscreen: diagrams.length - 1});
    }
  };

  next = () => {
    const {props: {diagrams}, state: {fullscreen}} = this;
    if(fullscreen !== null) {
      if(fullscreen < diagrams.length - 1) {
        this.setState({fullscreen: fullscreen + 1});
      }
      else {
        this.setState({fullscreen: 0});
      }
    }
  };

  toggleFullscreen(key) {
    this.props.toggleFullscreen();
    this.setState({fullscreen: this.state.fullscreen === key ? null : key});
  }

  renderGrid({width, height, classes, diagrams, isFullscreen, grid}) {
    if(grid == "1" || width <= 600) {
      return diagrams.map((data, key) => this.renderDiagram({width, classes, data, key, isFullscreen}));
    }

    const spacing = 16;
    if(!height) {
      height = width >= 960 ? (width / 5.2).round() : 0;
    }
    return <Grid container>
      {
        diagrams.map((data, key) => {
          let md, w;
          switch (grid) {
          case '2':
            md = 6;
            w = width / 2 - spacing;
            break;
          case '3':
            md = 4;
            w = width / 3 - spacing;
            break;
          case '12':
            md = key === 0 ? 12 : 6;
            w = key === 0 ? width - spacing : width / 2 - spacing;
            break;
          case '13':
            md = key === 0 ? 12 : 4;
            w = key === 0 ? width - spacing : width / 3 - spacing;
            break;
          case '123':
            md = key === 0 ? 12 : (key < 3 ? 6 : 4);
            w = key === 0 ? width - spacing : (key < 3 ? width / 2 : width / 3) - spacing;
            break;
          case '23':
          default:
            md = key < 2 ? 6 : 4;
            w = (key < 2 ? width / 2 : width / 3) - spacing;
            break;
          }

          return <Grid key={`d-${key}`} item  md={md}>
            {this.renderDiagram({width: w, height, classes, data, key, isFullscreen})}
          </Grid>;
        })
      }
    </Grid>;
  }

  renderDiagram({key, ...props}) {
    return <Diagram
      key={`d-${key}`}
      ref={(el) => this[`d-${key}`] = el}
      toggleFullscreen={this.toggleFullscreen.bind(this, key)}
      prev={this.prev}
      next={this.next}
      {...props}
    />;
  }

  render() {
    const {width, classes, diagrams, isFullscreen} = this.props;
    const fullscreen = isFullscreen && this.state.fullscreen;

    return diagrams.length ?
      typeof fullscreen === 'number' ?
        this.renderDiagram({width, classes, data: diagrams[fullscreen], key: fullscreen, isFullscreen})
        :
        this.renderGrid(this.props)
      :
      <div><CircularProgress size={24} /> Загрузка...</div>;
  }
}

DiagramsArray.propTypes = {
  classes: PropTypes.object.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number,
  diagrams: PropTypes.array.isRequired,
  toggleFullscreen: PropTypes.func,
  isFullscreen: PropTypes.bool,
};

export default Fullscreenable()(DiagramsArray);
