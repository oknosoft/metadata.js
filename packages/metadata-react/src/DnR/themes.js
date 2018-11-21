import React from 'react';
import {defaultTheme} from './DnR';

export class Button extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hover: false,
      down: false,
    };
  }

  render() {
    const {
      style,
      hoverStyle,
      downStyle,
      children,
      cursor,
      ...other
    } = this.props;

    const dragging = /resize$/.test(cursor);

    const buttonStyle = {
      ...style,
      ...(this.state.hover && !dragging ? hoverStyle : {}),
      ...(this.state.down && !dragging ? downStyle : {}),
      cursor
    };

    return (
      <button
        onMouseEnter={() => this.setState({hover: true})}
        onMouseLeave={() => this.setState({hover: false, down: false})}
        onMouseDown={() => this.setState({down: true})}
        onMouseUp={() => this.setState({down: false})}
        style={buttonStyle}
        {...other}>
        {children}
      </button>);
  }
}

export const TitleBar = ({
                           children,
                           buttons,
                           button1,
                           button2,
                           button3,
                           button1Children,
                           button2Children,
                           button3Children,
                           dnrState
                         }) =>
  <div>
    <div {...buttons}>
      <Button {...button1} cursor={dnrState.cursor}>
        {button1Children}
      </Button>
      <Button {...button2} cursor={dnrState.cursor}>
        {button2Children}
      </Button>
      <Button {...button3} cursor={dnrState.cursor}>
        {button3Children}
      </Button>
    </div>
    {children}
  </div>;

export let OSXTheme = ({title, onClose, onMinimize, onMaximize}) => {
  const titleHeight = 25;
  const buttonRadius = 6;
  const fontSize = 14;
  const fontFamily = 'Helvetica, sans-serif';

  const style = {
    height: titleHeight,
  };

  const buttonStyle = {
    padding: 0,
    margin: 0,
    marginRight: '4px',
    width: buttonRadius * 2,
    height: buttonRadius * 2,
    borderRadius: buttonRadius,
    content: '',
    border: '1px solid rgba(0, 0, 0, 0.2)',
    outline: 'none',
  };
  const buttons = {
    style: {
      height: titleHeight,
      position: 'absolute',
      float: 'left',
      margin: '0 8px',
      display: 'flex',
      alignItems: 'center'
    }
  };

  const closeButton = {
    style: {
      ...buttonStyle,
      backgroundColor: 'rgb(255, 97, 89)',
    },
    hoverStyle: {
      backgroundColor: 'rgb(230, 72, 64)'
    },
    downStyle: {
      backgroundColor: 'rgb(204, 46, 38)'
    },
    onClick: onClose
  };
  const minimizeButton = {
    style: {
      ...buttonStyle,
      backgroundColor: 'rgb(255, 191, 47)'
    },
    hoverStyle: {
      backgroundColor: 'rgb(230, 166, 22)'
    },
    downStyle: {
      backgroundColor: 'rgb(204, 140, 0)'
    },
    onClick: onMinimize
  };
  const maximizeButton = {
    style: {
      ...buttonStyle,
      backgroundColor: 'rgb(37, 204, 62)'
    },
    hoverStyle: {
      backgroundColor: 'rgb(12, 179, 37)'
    },
    downStyle: {
      backgroundColor: 'rgb(0, 153, 11)'
    },
    onClick: onMaximize
  };
  return {
    theme: {
      title: {
        ...defaultTheme.title,
        borderTopLeftRadius: '5px',
        borderTopRightRadius: '5px',
        background: 'linear-gradient(0deg, #d8d8d8, #ececec)',
        color: 'rgba(0, 0, 0, 0.7)',
        // fontFamily: fontFamily,
        // fontSize: fontSize,
        height: titleHeight,
      },
      frame: {
        ...defaultTheme.frame,
        borderRadius: '5px',
      },
      transition: 'all 0.2s ease-in-out'
    },
    titleBar: (<TitleBar
      style={style}
      buttons={buttons}
      button1={closeButton}
      button2={minimizeButton}
      button3={maximizeButton}>
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        padding: '4px',
        // alignItems: 'center',
        // justifyContent: 'center'
      }}>
        {title}
      </div>
    </TitleBar>),
  };
};

export let WindowsTheme = ({title, onClose, onMinimize, onMaximize, titleBarColor = '#757575'}) => {
  const titleHeight = 30;
  const buttonRadius = 6;
  const fontSize = 14;
  const fontFamily = 'Roboto, Arial, sans-serif';

  const style = {
    height: titleHeight,
  };

  const buttonStyle = {
    padding: 0,
    margin: 0,
    width: titleHeight,
    height: titleHeight,
    outline: 'none',
    border: 'none',
    textAlign: 'center',
    color: 'white'
  };

  const buttons = {
    style: {
      height: titleHeight,
      position: 'absolute',
      right: 0,
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      verticalAlign: 'baseline',
    }
  };

  const closeButton = {
    style: {
      ...buttonStyle,
      fontSize: '30px',
      fontWeight: 100,
      lineHeight: '46px',
      backgroundColor: titleBarColor,
    },
    hoverStyle: {
      backgroundColor: '#ec6060'
    },
    downStyle: {
      backgroundColor: '#bc4040'
    },
    onClick: onClose
  };

  const minimizeButton = {
    style: {
      ...buttonStyle,
      fontSize: '20px',
      lineHeight: '32px',
      backgroundColor: titleBarColor,
    },
    hoverStyle: {
      backgroundColor: 'rgba(0, 0, 0, 0.1)'
    },
    downStyle: {
      backgroundColor: 'rgba(0, 0, 0, 0.2)'
    },
    onClick: onMinimize
  };

  const maximizeButton = {
    style: {
      ...buttonStyle,
      fontSize: '22px',
      lineHeight: '12px',
      backgroundColor: titleBarColor
    },
    hoverStyle: {
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    downStyle: {
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    onClick: onMaximize
  };
  return {
    theme: {
      title: {
        ...defaultTheme.title,
        background: titleBarColor,
        color: 'white',
        // fontFamily: fontFamily,
        // fontSize: fontSize,
        height: titleHeight,
      },
      frame: {
        ...defaultTheme.frame,
      },
      transition: 'all 0.2s ease-in-out'
    },
    titleBar: (<TitleBar
      style={style}
      buttons={buttons}
      button1={minimizeButton}
      button2={maximizeButton}
      button3={closeButton}
      button1Children='‒'
      button2Children='□'
      button3Children='˟'>
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        padding: '4px',
        // alignItems: 'center',
        //justifyContent: 'center'
      }}>
        {title}
      </div>
    </TitleBar>),
  };
};
