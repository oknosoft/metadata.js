import React from "react";
import Hammer from "hammerjs";

// generate <resize> component unique id
function createId() {
    let id = -1;
    return function () {
        id = id + 1;
        return id;
    };
}
const getResizeId = createId();

// default handle style
const default_handle_width = "5px";
const default_handle_color = "#999";

export default class Resize extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      resizeType: '',
      resizeId: getResizeId(),
      handleWidth: default_handle_width,
      handleColor: default_handle_color,
      onResizeStart: function () {},
      onResizeStop: function () {},
      onResizeMove: function () {},
      onResizeWindow: function () {},
    };

    this.updateState = this.updateState.bind(this);
    this.getResize = this.getResize.bind(this);
    this.getResizeInf = this.getResizeInf.bind(this);
    this.moveHandleMouseStyle = this.moveHandleMouseStyle.bind(this);
    this.eventHandle = this.eventHandle.bind(this);
    this.initialResize = this.initialResize.bind(this);
    this.initialVertical = this.initialVertical.bind(this);
    this.initialHorizon = this.initialHorizon.bind(this);

    this.resizeVertical = this.resizeVertical.bind(this);
    this.resizeHorizon = this.resizeHorizon.bind(this);
    this.windowResizeVertical = this.windowResizeVertical.bind(this);
    this.windowResizeHorizon = this.windowResizeHorizon.bind(this);
  }

    updateState(props) {
      const nstate = Resize.getDerivedStateFromProps(props, this.state);
      this.setState(nstate);
    }

    getResize() {
        const $resize = document.querySelectorAll(".resize");
        const id = this.state.resizeId;
        let index = -1;
        for (let i = 0; i < $resize.length; i++) {
            if (id == $resize[i].getAttribute("data-resize-id")) {
                index = i;
            }
        }
        return $resize[index];
    }

    getResizeElement(className) {
        const $resize = this.getResize();
        if (className === "resize") {
            return $resize;
        }

        const $child = $resize.childNodes;
        let list = [];
        for (let i = 0; i < $child.length; i++) {
            if ($child[i].classList.contains(className)) {
                if ($child[i].getAttribute("data-show") != "none") {
                    list.push($child[i]);
                }
            }
        }
        return list;
    }

    getResizeInf() {
        const type = this.state.resizeType;
        let childs = [];
        if (type === "vertical") {
            const $vertical = this.getResizeElement("resize-vertical");
            for (let i = 0; i < $vertical.length; i++) {
                childs.push({ height: $vertical[i].getBoundingClientRect().height });
            }
        } else if (type === "horizon") {
            const $horizon = this.getResizeElement("resize-horizon");
            for (let i = 0; i < $horizon.length; i++) {
                childs.push({ width: $horizon[i].getBoundingClientRect().width });
            }
        }

        return {
            type: type,
            resizeId: this.state.resizeId,
            resizeChilds: childs
        };
    }

    stopUserSelect() {
        document.body.style.userSelect = "none";
        document.body.style.webkitUserSelect = "none";
        document.body.style.mozUserSelect = "none";
        document.body.style.msUserSelect = "none";
    }

    deselect() {
        if (window.getSelection) {
            const selection = window.getSelection();
            selection.collapse(document.body, 0);
        }
    }

    onUserSelect() {
        document.body.style.userSelect = "";
        document.body.style.webkitUserSelect = "";
        document.body.style.mozUserSelect = "";
        document.body.style.msUserSelect = "";
    }

    endHandleMouseStyle() {
        document.onmouseover = () => { };
        Array.from(document.querySelectorAll(".react-resize-cursor"), ele => {
            ele.style.cursor = ele.getAttribute("data-react-resize-cursor");
            ele.removeAttribute("data-react-resize-cursor");
            ele.classList.remove("react-resize-cursor");
        });
    }

    moveHandleMouseStyle(e) {
        const type = this.state.resizeType;
        const ele = e.target;
        if (!ele.classList.contains("react-resize-cursor")) {
            const cursor = ele.style.cursor ? ele.style.cursor : "";
            ele.setAttribute("data-react-resize-cursor", cursor);
            ele.classList.add("react-resize-cursor");
            ele.style.cursor = type === "vertical" ? "s-resize" : "w-resize";
        }
    }

    eventHandle() {
        const type = this.state.resizeType;
        let $handle = [];
        if (type === "vertical") {
            $handle = this.getResizeElement("resize-handle-vertical");
        } else if (type === "horizon") {
            $handle = this.getResizeElement("resize-handle-horizon");
        }

        for (let i = 0; i < $handle.length; i++) {
            const hammertime = new Hammer($handle[i]);
            hammertime.get("pan").set({ threshold: 1 });

            hammertime.on("panstart", ev => {
                this.stopUserSelect();
                this.deselect();
                this.state.onResizeStart(this.getResizeInf());
            });
            hammertime.on("panend", ev => {
                this.endHandleMouseStyle();
                this.onUserSelect();
                this.deselect();
                this.state.onResizeStop(this.getResizeInf());
            });
            hammertime.on("panmove", ev => {
                document.onmouseover = this.moveHandleMouseStyle;
                this.deselect();
                if (type === "vertical") {
                    this.resizeVertical(ev);
                    this.state.onResizeMove(this.getResizeInf());
                } else if (type === "horizon") {
                    this.resizeHorizon(ev);
                    this.state.onResizeMove(this.getResizeInf());
                }
            });
        }
    }

    initialVertical() {
        const $resize = this.getResizeElement("resize");
        const $vertical = this.getResizeElement("resize-vertical");
        if (!$resize || $vertical.length === 0) return;

        // remove handle
        const $handleVertical = this.getResizeElement("resize-handle-vertical");
        for (let i = 0; i < $handleVertical.length; i++) {
            $handleVertical[i].parentNode.removeChild($handleVertical[i]);
        }

        const handleHeight = parseInt(this.state.handleWidth);
        const handleColor = this.state.handleColor;
        let sumHeight = 0;

        for (let i = 0; i < $vertical.length; i++) {
            // vertical
            const minHeight = $vertical[i].getAttribute("data-min-height");
            $vertical[i].setAttribute("min-height", minHeight);

            // handle style
            const $handle = document.createElement("div");
            $handle.className = "resize-handle-vertical";
            $handle.style.height = handleHeight + "px";
            $handle.style.cursor = "s-resize";
            $handle.style.backgroundColor = handleColor;

            if ($vertical[i + 1]) {
                $vertical[i].parentNode.insertBefore(
                    $handle,
                    $vertical[i].nextSibling
                );
                sumHeight += handleHeight;
            }

            if ($vertical.length - 1 != i) {
                sumHeight += $vertical[i].getBoundingClientRect().height;
            }
        }
        $vertical[$vertical.length - 1].style.height =
            $resize.getBoundingClientRect().height - sumHeight + "px";
    }

    resizeVertical(e) {
        if (e.velocityY === 0) return;
        const $resize = this.getResizeElement("resize");
        const $vertical = this.getResizeElement("resize-vertical");
        const $handle = this.getResizeElement("resize-handle-vertical");
        if (!$resize || $vertical.length === 0 || $handle.length === 0) return;

        const direction = e.velocityY > 0 ? "down" : "up";
        const indx_hand = $handle.indexOf(e.target);
        let $prev = $vertical[indx_hand];
        let $next = $vertical[indx_hand + 1];
        let prevMinHeight = parseInt($prev.getAttribute("min-height"));
        let nextMinHeight = parseInt($next.getAttribute("min-height"));

        if (direction === "up") {
            const indx_prev = $vertical.indexOf($prev);
            for (let i = $vertical.length - 1; 0 <= i; i--) {
                if (indx_prev >= i) {
                    if ($prev.getBoundingClientRect().height <= prevMinHeight) {
                        $prev = $vertical[i];
                        prevMinHeight = parseInt(
                            $prev.getAttribute("min-height")
                        );
                    }
                }
            }
        } else if (direction === "down") {
            const indx_next = $vertical.indexOf($next);
            for (let i = 0; i < $vertical.length; i++) {
                if (indx_next <= i) {
                    if ($next.getBoundingClientRect().height <= nextMinHeight) {
                        $next = $vertical[i];
                        nextMinHeight = parseInt(
                            $next.getAttribute("min-height")
                        );
                    }
                }
            }
        }

        let prevHeight = 0;
        let nextHeight = 0;
        let sumPrevHeight = 0;
        let sumHeight = 0;
        let flag = true;
        for (let i = 0; i < $vertical.length; i++) {
            if (flag) {
                if ($handle[i] === e.target) {
                    flag = false;
                }
                if ($vertical[i] != $prev) {
                    sumPrevHeight += $vertical[i].getBoundingClientRect().height;
                    sumPrevHeight += $handle[i].getBoundingClientRect().height;
                }
            }

            if ($vertical[i] !== $prev && $vertical[i] !== $next) {
                sumHeight += $vertical[i].getBoundingClientRect().height;
            }

            if ($handle[i]) {
                sumHeight += $handle[i].getBoundingClientRect().height;
            }
        }
        prevHeight =
            e.center.y - sumPrevHeight - $resize.getBoundingClientRect().top;
        nextHeight = $resize.getBoundingClientRect().height - (sumHeight + prevHeight);

        if (prevHeight < prevMinHeight) prevHeight = prevMinHeight;
        if (nextHeight < nextMinHeight) nextHeight = nextMinHeight;

        if (direction === "down") {
            prevHeight = $resize.getBoundingClientRect().height - sumHeight - nextHeight;
            if (prevHeight < prevMinHeight) prevHeight = prevMinHeight;
        } else if (direction === "up") {
            nextHeight = $resize.getBoundingClientRect().height - sumHeight - prevHeight;
            if (nextHeight < nextMinHeight) nextHeight = nextMinHeight;
        }

        if ($resize.getBoundingClientRect().height === sumHeight + prevHeight + nextHeight) {
            $prev.style.height = prevHeight + "px";
            $next.style.height = nextHeight + "px";
        }
    }

    windowResizeVertical() {
        const $resize = this.getResizeElement("resize");
        const $vertical = this.getResizeElement("resize-vertical");
        const $handle = this.getResizeElement("resize-handle-vertical");
        if (!$resize || $vertical.length === 0) return;

        if ($vertical.length === 1) {
            $vertical[0].style.height = $resize.getBoundingClientRect().height + "px";
            return;
        }

        let sum = 0;
        let remain = 0;
        for (let i = 0; i < $vertical.length; i++) {
            sum += $vertical[i].getBoundingClientRect().height;
        }
        for (let i = 0; i < $handle.length; i++) {
            sum += $handle[i].getBoundingClientRect().height;
        }
        remain = $resize.getBoundingClientRect().height - sum;

        if (remain > 0) {
            const last_idx = $vertical.length - 1;
            $vertical[last_idx].style.height =
                remain + $vertical[last_idx].getBoundingClientRect().height + "px";
        } else if (remain < 0) {
            for (let i = $vertical.length - 1; 0 <= i; i--) {
                var min_height = parseInt(
                    $vertical[i].getAttribute("min-height")
                );
                remain += $vertical[i].getBoundingClientRect().height - min_height;

                if (remain >= 0) {
                    $vertical[i].style.height = remain + min_height + "px";
                    break;
                }
                $vertical[i].style.height = min_height + "px";
            }
        }

        this.state.onResizeWindow(this.getResizeInf());
    }

    initialHorizon() {
        const $resize = this.getResizeElement("resize");
        const $horizon = this.getResizeElement("resize-horizon");
        if (!$resize || $horizon.length === 0) return;

        // remove handle
        const $handleHorizon = this.getResizeElement("resize-handle-horizon");
        for (let i = 0; i < $handleHorizon.length; i++) {
            $handleHorizon[i].parentNode.removeChild($handleHorizon[i]);
        }

        const handleWidth = parseInt(this.state.handleWidth);
        const handleColor = this.state.handleColor;
        let sumWidth = 0;

        for (let i = 0; i < $horizon.length; i++) {
            // horizon
            const minWidth = $horizon[i].getAttribute("data-min-width");
            $horizon[i].setAttribute("min-width", minWidth);

            // handle style
            const $handle = document.createElement("div");
            $handle.className = "resize-handle-horizon";
            $handle.style.width = handleWidth + "px";
            $handle.style.cursor = "w-resize";
            $handle.style.backgroundColor = handleColor;
            $handle.style.height = "100%";
            $handle.style.float = "left";

            if ($horizon[i + 1]) {
                $horizon[i].parentNode.insertBefore(
                    $handle,
                    $horizon[i].nextSibling
                );
                sumWidth += handleWidth;
            }
            if ($horizon.length - 1 != i) {
                sumWidth += $horizon[i].getBoundingClientRect().width;
            }
        }
        $horizon[$horizon.length - 1].style.width =
            $resize.getBoundingClientRect().width - sumWidth + "px";
    }

    resizeHorizon(e) {
        if (e.velocityX === 0) return;
        const $resize = this.getResizeElement("resize");
        const $horizon = this.getResizeElement("resize-horizon");
        const $handle = this.getResizeElement("resize-handle-horizon");
        if (!$resize || $horizon.length === 0 || $handle.length === 0) return;

        const direction = e.velocityX > 0 ? "right" : "left";
        const indx_hand = $handle.indexOf(e.target);
        let $prev = $horizon[indx_hand];
        let $next = $horizon[indx_hand + 1];
        let prevMinWidth = parseInt($prev.getAttribute("min-width"));
        let nextMinWidth = parseInt($next.getAttribute("min-width"));

        if (direction === "left") {
            const indx_prev = $horizon.indexOf($prev);
            for (let i = $horizon.length - 1; 0 <= i; i--) {
                if (indx_prev >= i) {
                    if ($prev.getBoundingClientRect().width <= prevMinWidth) {
                        $prev = $horizon[i];
                        prevMinWidth = parseInt(
                            $prev.getAttribute("min-width")
                        );
                    }
                }
            }
        } else if (direction === "right") {
            const indx_next = $horizon.indexOf($next);
            for (let i = 0; i < $horizon.length; i++) {
                if (indx_next <= i) {
                    if ($next.getBoundingClientRect().width <= nextMinWidth) {
                        $next = $horizon[i];
                        nextMinWidth = parseInt(
                            $next.getAttribute("min-width")
                        );
                    }
                }
            }
        }

        let prevWidth = 0;
        let nextWidth = 0;
        let sumPrevWidth = 0;
        let sumWidth = 0;
        let flag = true;
        for (let i = 0; i < $horizon.length; i++) {
            if (flag) {
                if ($handle[i] === e.target) {
                    flag = false;
                }
                if ($horizon[i] != $prev) {
                    sumPrevWidth += $horizon[i].getBoundingClientRect().width;
                    sumPrevWidth += $handle[i].getBoundingClientRect().width;
                }
            }

            if ($horizon[i] !== $prev && $horizon[i] !== $next) {
                sumWidth += $horizon[i].getBoundingClientRect().width;
            }

            if ($handle[i]) {
                sumWidth += $handle[i].getBoundingClientRect().width;
            }
        }
        prevWidth =
            e.center.x - sumPrevWidth - $resize.getBoundingClientRect().left;
        nextWidth = $resize.getBoundingClientRect().width - (sumWidth + prevWidth);

        if (prevWidth < prevMinWidth) prevWidth = prevMinWidth;
        if (nextWidth < nextMinWidth) nextWidth = nextMinWidth;

        if (direction === "right") {
            prevWidth = $resize.getBoundingClientRect().width - sumWidth - nextWidth;
            if (prevWidth < prevMinWidth) prevWidth = prevMinWidth;
        } else if (direction === "left") {
            nextWidth = $resize.getBoundingClientRect().width - sumWidth - prevWidth;
            if (nextWidth < nextMinWidth) nextWidth = nextMinWidth;
        }

        if ($resize.getBoundingClientRect().width === sumWidth + prevWidth + nextWidth) {
            $prev.style.width = prevWidth + "px";
            $next.style.width = nextWidth + "px";
        }
    }

    windowResizeHorizon(e) {
        const $resize = this.getResizeElement("resize");
        const $horizon = this.getResizeElement("resize-horizon");
        const $handle = this.getResizeElement("resize-handle-horizon");
        if (!$resize || $horizon.length === 0 || $handle.length === 0) return;

        let sum = 0;
        let remain = 0;
        for (let i = 0; i < $horizon.length; i++) {
            sum += $horizon[i].getBoundingClientRect().width;
        }
        for (let i = 0; i < $handle.length; i++) {
            sum += $handle[i].getBoundingClientRect().width;
        }
        remain = $resize.getBoundingClientRect().width - sum;

        if (remain > 0) {
            $horizon[$horizon.length - 1].style.width =
                remain + $horizon[$horizon.length - 1].getBoundingClientRect().width + "px";
        } else if (remain < 0) {
            for (let i = $horizon.length - 1; 0 <= i; i--) {
                var min_width = parseInt($horizon[i].getAttribute("min-width"));
                remain += $horizon[i].getBoundingClientRect().width - min_width;
                0;

                if (remain >= 0) {
                    $horizon[i].style.width = remain + min_width + "px";
                    break;
                }
                $horizon[i].style.width = min_width + "px";
            }
        }

        this.state.onResizeWindow(this.getResizeInf());
    }

  initialResize() {
    const type = this.state.resizeType;
    if(type === 'vertical') {
      this.initialVertical();
      this.eventHandle();
      this.windowResizeVertical();
    }
    else if(type === 'horizon') {
      this.initialHorizon();
      this.eventHandle();
      this.windowResizeHorizon();
    }
  }

  componentDidMount() {
    this.initialResize();
    const type = this.state.resizeType;
    if(type === 'vertical') {
      window.addEventListener('resize', this.windowResizeVertical);
    }
    else if(type === 'horizon') {
      window.addEventListener('resize', this.windowResizeHorizon);
    }
  }

  componentWillUnmount() {
    const type = this.state.resizeType;
    if(type === 'vertical') {
      window.removeEventListener('resize', this.windowResizeVertical);
    }
    else if(type === 'horizon') {
      window.removeEventListener('resize', this.windowResizeHorizon);
    }
  }

  static getDerivedStateFromProps(props, state) {
    const handleWidth = props.handleWidth ? props.handleWidth : state.handleWidth;
    const handleColor = props.handleColor ? props.handleColor : state.handleColor;
    const onResizeStart = props.onResizeStart ? props.onResizeStart : state.onResizeStart;
    const onResizeStop = props.onResizeStop ? props.onResizeStop : state.onResizeStop;
    const onResizeMove = props.onResizeMove ? props.onResizeMove : state.onResizeMove;
    const onResizeWindow = props.onResizeWindow ? props.onResizeWindow : state.onResizeWindow;

    let resizeType = state.resizeType;
    if(props.children.length > 0) {
      if(props.children[0].type.myName === 'ResizeHorizon') {
        resizeType = 'horizon';
      }
      else if(props.children[0].type.myName === 'ResizeVertical') {
        resizeType = 'vertical';
      }
    }

    return {
      resizeType: resizeType,
      handleWidth: handleWidth,
      handleColor: handleColor,
      onResizeStart: onResizeStart,
      onResizeStop: onResizeStop,
      onResizeMove: onResizeMove,
      onResizeWindow: onResizeWindow
    };
  }

    // componentWillMount() {
    //     this.updateState(this.props);
    // }
    //
    // componentWillReceiveProps(nextProps) {
    //     this.updateState(nextProps);
    // }

    componentDidUpdate() {
        this.initialResize();
    }

    render() {
        const id = this.state.resizeId;
        const type = this.state.resizeType;

        // resize style
        let style = {
            position: "absolute",
            top: "0",
            bottom: "0",
            left: "0",
            right: "0"
        };
        if (type === "horizon") {
            style.overflow = "hidden";
        }

        return (
            <div className="resize" data-resize-id={id} style={style}>
                {this.props.children}
            </div>
        );
    }
}
