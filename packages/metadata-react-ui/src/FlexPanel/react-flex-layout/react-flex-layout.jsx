import React from 'react'
import ReactDOM from 'react-dom'
import LayoutSplitter from './react-flex-layout-splitter.jsx'
import layoutEvents from './react-flex-layout-events.jsx'

export default class Layout extends React.Component {

  static propTypes = {
    hideSelection: React.PropTypes.bool,
    minWidth: React.PropTypes.number,
    minHeight: React.PropTypes.number,
    onResize:React.PropTypes.func
  }

  static defaultProps = {
    minWidth: 50,
    minHeight: 50
  }


  constructor(props) {
    super(props)
    this.state = {
      hideSelection: false
    }
    if (props.layoutWidth !== 'flex') {
      if (props.layoutWidth && !this.isNumber(props.layoutWidth)) {
        throw new Error('layoutWidth should be a number or flex')
      }
      this.state.layoutWidth = props.layoutWidth
    }
    if (props.layoutHeight !== 'flex') {
      if (props.layoutHeight && !this.isNumber(props.layoutHeight)) {
        throw new Error('layoutHeight should be a number or flex')
      }
      this.state.layoutHeight = props.layoutHeight
    }

    this.handleResize = this.handleResize.bind(this)
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
    layoutEvents.addListener('layout-changed', this.handleResize)
    this.handleResize()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
    layoutEvents.removeListener('layout-changed', this.handleResize)
  }

  handleResize() {
    let newWidth = this.state.layoutWidth
    let newHeight = this.state.layoutHeight
    if (this.props.fill === 'window' && window) {
      newWidth = window.innerWidth
      newHeight = window.innerHeight
    } else if (!this.props.layoutWidth && !this.props.layoutHeight) {
        const domNode = ReactDOM.findDOMNode(this)
        newHeight = domNode.parentElement.clientHeight
        newWidth = domNode.parentElement.clientWidth
    }
    // Only setState if the available size has actually changed.
    if (this.state.layoutWidth !== newWidth ||
        this.state.layoutHeight !== newHeight) {
      this.state.layoutWidth = newWidth
      this.state.layoutHeight = newHeight
      this.setState(this.state)
    }
  }

  getWidth() {
    return ReactDOM.findDOMNode(this).offsetWidth;
  }

  setWidth(newWidth) {
    this.state.layoutWidth = newWidth
    this.setState(this.state)
    if (this.props.layoutChanged) {
      this.props.layoutChanged()
    }
  }

  getHeight() {
    return ReactDOM.findDOMNode(this).offsetHeight;
  }

  setHeight(newHeight) {
    this.state.layoutHeight = newHeight
    this.setState(this.state)
    if (this.props.layoutChanged) {
      this.props.layoutChanged()
    }
  }

  childLayoutChanged() {
    // State hasn't changed but render relies on child properties
    this.setState(this.state)
  }

  recalculateFlexLayout() {
    let newFlexDimentions = {}
    if (this.props.children) {
      let numberOfFlexWidths = 0
      let totalAllocatedWidth = 0
      let numberOfFlexHeights = 0
      let totalAllocatedHeight = 0
      let numberOfSplitters = 0
      let i = 0
      React.Children.map(this.props.children, childDefinition => {
        var childType = childDefinition.type
        if (childType === Layout && !childDefinition.props.layoutWidth && !childDefinition.props.layoutHeight) {
          throw new Error('Child Layouts must have either layoutWidth or layoutHeight set')
        }

        if (childType === LayoutSplitter) {
          numberOfSplitters++
        } else if (childType === Layout) {
          let child = this.refs['layout' + i]
          if (childDefinition.props.layoutWidth === 'flex') { numberOfFlexWidths++ }
          else if (!child && this.isNumber(childDefinition.props.layoutWidth)) { totalAllocatedWidth += childDefinition.props.layoutWidth }
          else if (child && this.isNumber(child.state.layoutWidth)) { totalAllocatedWidth += child.state.layoutWidth }

          if (childDefinition.props.layoutHeight === 'flex') { numberOfFlexHeights++ }
          else if (!child && this.isNumber(childDefinition.props.layoutHeight)) { totalAllocatedHeight += childDefinition.props.layoutHeight }
          else if (child && this.isNumber(child.state.layoutHeight)) { totalAllocatedHeight += child.state.layoutHeight }
        }
        i++
      })

      if (numberOfFlexHeights > 0 && numberOfFlexWidths > 0) {
        throw new Error('Cannot have layout children with both flex widths and heights')
      }
      if (numberOfFlexWidths > 0) {
        var thisWidth = this.state.layoutWidth || this.props.containerWidth
        totalAllocatedWidth = totalAllocatedWidth + numberOfSplitters * LayoutSplitter.defaultSize
        newFlexDimentions.width = (thisWidth - totalAllocatedWidth) / numberOfFlexWidths
      } else if (numberOfFlexHeights > 0) {
        var thisHeight = this.state.layoutHeight || this.props.containerHeight
        totalAllocatedHeight = totalAllocatedHeight + numberOfSplitters * LayoutSplitter.defaultSize
        newFlexDimentions.height = (thisHeight - totalAllocatedHeight) / numberOfFlexHeights
      }

      let isHorizontal = numberOfFlexWidths > 0 || totalAllocatedWidth > 0
      let isVertical = numberOfFlexHeights > 0 || totalAllocatedHeight > 0
      if (isHorizontal && isVertical) {
        throw new Error('You can only specify layoutHeight or layoutWidth at a single level')
      } else if (isHorizontal) {
        newFlexDimentions.orientation = 'horizontal'
      } else if (isVertical) {
        newFlexDimentions.orientation = 'vertical'
      }
    }

    return newFlexDimentions
  }

  render() {
    let width = this.props.layoutWidth === 'flex' ? this.props.calculatedFlexWidth : (this.state.layoutWidth || this.props.containerWidth)
    let height = this.props.layoutHeight === 'flex' ? this.props.calculatedFlexHeight : (this.state.layoutHeight || this.props.containerHeight)

    if (!width || !height) {
      // We don't know our size yet (maybe initial render)
      return <div />
    }
    let count = -1
    let calculatedFlexDimentions = this.recalculateFlexLayout()
    let children = React.Children.map(
      this.props.children,
      child => {
        count++
        if (child.type === Layout) {
          let newProps = {
            layoutChanged: this.childLayoutChanged.bind(this),
            calculatedFlexWidth: calculatedFlexDimentions.width,
            calculatedFlexHeight: calculatedFlexDimentions.height,
            containerHeight: height,
            containerWidth: width,
            ref: 'layout' + count
          }
          if (calculatedFlexDimentions.orientation === 'horizontal') {
            let childStyle = child.props.style || {}
            childStyle.float = 'left'
            newProps.style = childStyle
          }
          let cloned = React.cloneElement(child, newProps)
          return cloned
        } else if (child.type === LayoutSplitter) {
          let newProps = {
            layoutChanged: this.childLayoutChanged.bind(this),
            orientation: calculatedFlexDimentions.orientation,
            containerHeight: height,
            containerWidth: width,
            ref: 'layout' + count,
            hideSelection: () => {
              this.setState({ hideSelection: true })
            },
            restoreSelection: () => {
              this.clearSelection()
              this.setState({ hideSelection: false })
            },
            getPreviousLayout: () => {
              let index = this.props.children.indexOf(child)
              return this.refs['layout' + (index - 1)]
            },
            getNextLayout: () => {
              let index = this.props.children.indexOf(child)
              return this.refs['layout' + (index + 1)]
            }
          }
          let cloned = React.cloneElement(child, newProps)
          return cloned
        }
        return child
      })

    let className = null
    if (this.props.className) {
      className = this.props.className
    }
    if (this.state.hideSelection) {
      if (className) { className += ' ' }
      className += 'hideSelection'
    }
    const style = Object.assign({},
       this.props.style,
       {overflow: 'auto', width: width, height: height},
       this.props.fill === 'window' ? {position: 'absolute', top: 0, left:0}: {}
    )

    return <div style={style} className={className}>{children}</div>
  }

  isNumber(value) {
    return typeof value === 'number';
  }

  clearSelection() {
    if (window.getSelection) {
      if (window.getSelection().empty) {  // Chrome
        window.getSelection().empty();
      } else if (window.getSelection().removeAllRanges) {  // Firefox
        window.getSelection().removeAllRanges();
      }
    } else if (document.selection) {  // IE?
      document.selection.empty();
    }
  }
}

