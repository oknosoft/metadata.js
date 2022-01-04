import React from "react";

export default class ResizeHorizon extends React.Component {
    static get myName() {
        return "ResizeHorizon";
    }

    render() {
        const id = this.props.id ? this.props.id : "";
        const className = this.props.className ? this.props.className : "";
        const width = this.props.width ? this.props.width : "0";
        const minWidth = this.props.minWidth ? this.props.minWidth : "0";
        const overflow = this.props.overflow ? this.props.overflow : "hidden";
        const show = this.props.show === false ||
            this.props.show === "false" ||
            this.props.show === "off" ||
            this.props.show === "none" ? "none" : "block";

        const style = {
            position: "relative",
            height: "100%",
            width: width,
            float: "left",
            overflow: overflow,
            display: show
        };

        return (
            <div
                id={id}
                className={"resize-horizon " + className}
                data-min-width={minWidth}
                data-show={show}
                style={style}
            >
                {this.props.children}
            </div>
        );
    }
}
