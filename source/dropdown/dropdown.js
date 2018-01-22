import "./dropdown.css";


const { createElement } = React;
const elementSource = ["div", { className: "rc-dropdown__element" }];
const contentSource = ["div", { className: "rc-dropdown__content" }];

export default class Dropdown extends React.Component {
    static propTypes = {
        Element: PropTypes.arrayOf(PropTypes.node),
        element: PropTypes.node,
        Content: PropTypes.arrayOf(PropTypes.node),
        content: PropTypes.node,
        show: PropTypes.bool
    };

    render() {
        return <div className="rc-dropdown__container">
            {createElement.apply(React, elementSource.concat(this.props.element || this.props.Element))}

            <If true={this.props.show}>
                {createElement.apply(React, contentSource.concat(this.props.content || this.props.Content))}
            </If>
        </div>
    }
}
