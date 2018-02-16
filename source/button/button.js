import "./button.css";


let tabIndex = 0;

export default class Button extends BaseComponent {
    static propTypes = {
        focusable: PropTypes.bool,
        onRelease: PropTypes.func,
        onFocusIn: PropTypes.func,
        onFocusOut: PropTypes.func,
        onFocusChange: PropTypes.func,
        onKey: PropTypes.func,
        onKeyPress: PropTypes.func
    };

    static classNames = {
        element: "rc-button",
        focusableHelper: "rc-button__helper"
    };

    constructor(props) {
        super(props);

        this.elementProps = {
            className: Button.classNames.element,
            onClick: this.onClick.bind(this),
            onFocus: this.onFocusIn.bind(this),
            onBlur: this.onFocusOut.bind(this),
            onKeyUp: this.onKey.bind(this, "onKey"),
            onKeyPress: this.onKey.bind(this, "onKeyPress")
        };

        if (props.focusable !== false) {
            this.elementProps.tabIndex = String(++tabIndex);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.focusable !== false && !this.helperProps) {
            this.elementProps.tabIndex = String(++tabIndex);
        }
    }

    onClick() {
        if (this.dom.helper) this.dom.helper.focus();

        this.invoke("onRelease");
    }

    onKey(type, { keyCode: key, shiftKey, ctrlKey, altKey }) {
        this.invoke(type, { key, shiftKey, ctrlKey, altKey });

        if (key == KeyCode.Enter) this.invoke("onRelease");
    }

    onFocusIn() {
        this.invoke("onFocusIn");
        this.invoke("onFocusChange", true);
    }

    onFocusOut() {
        this.invoke("onFocusOut");
        this.invoke("onFocusChange", false);
    }

    render() {
        return <div {...this.elementProps}>
            {this.props.children}
        </div>
    }
}
