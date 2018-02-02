import "./button.css";


export default class Button extends BaseComponent {
    static propTypes = {
        focusable: PropTypes.bool,
        onRelease: PropTypes.func,
        onFocusIn: PropTypes.func,
        onFocusOut: PropTypes.func,
        onFocusChange: PropTypes.func,
        onKey: PropTypes.func
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
            onKeyUp: this.onKeyUp.bind(this)
        };

        this.helperProps = null;

        if (props.focusable !== false) {
            this.helperProps = {
                className: Button.classNames.focusableHelper,
                onKeyUp: this.onKeyUp.bind(this)
            };
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.focusable !== false && !this.helperProps) {
            this.helperProps = {
                className: Button.classNames.focusableHelper,
                onKeyUp: this.onKeyUp.bind(this)
            };
        }
    }

    onClick() {
        if (this.dom.helper) this.dom.helper.focus();

        this.invoke("onRelease");
    }

    onKeyUp({ keyCode: key, shiftKey, ctrlKey, altKey }) {
        this.invoke("onKey", { key, shiftKey, ctrlKey, altKey });

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

            <If true={this.props.focusable !== false}>
                <input ref={this.getElement("helper")} {...this.helperProps} />
            </If>
        </div>
    }
}
