import React from "react";

export default class ResizeVertical extends React.Component {
    static get myName() {
        return "ResizeVertical";
    }

    render() {
        const id = this.props.id ? this.props.id : "";
        const className = this.props.className ? this.props.className : "";
        const height = this.props.height ? this.props.height : "0";
        const minHeight = this.props.minHeight ? this.props.minHeight : "0";
        const overflow = this.props.overflow ? this.props.overflow : "hidden";
        const show = this.props.show === false ||
            this.props.show === "false" ||
            this.props.show === "off" ||
            this.props.show === "none" ? "none" : "block";

        const style = {
            position: "relative",
            height: height,
            overflow: overflow,
            display: show
        };

        return (
            <div
                id={id}
                className={"resize-vertical " + className}
                data-height={height}
                data-min-height={minHeight}
                data-show={show}
                style={style}
            >
                {this.props.children}
            </div>
        );
    }
}
