import "./button.css";


export default class Button extends React.Component {
    static propTypes = {
        focusable: PropTypes.bool,
        onRelease: PropTypes.func,
        onFocusIn: PropTypes.func,
        onFocusOut: PropTypes.func,
        onFocusChange: PropTypes.func,
        onKey: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.dom = {
            helper: null
        };

        this.elementProps = {
            className: "rc-button",
            onClick: this.onClick.bind(this),
            onFocus: this.onFocusIn.bind(this),
            onBlur: this.onFocusOut.bind(this),
            onKeyUp: this.onKeyUp.bind(this)
        };

        this.helperProps = null;

        if (props.focusable !== false) {
            this.helperProps = {
                className: "rc-button__helper",
                ref: this.getHelper.bind(this)
            };
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.focusable !== false && !this.helperProps) {
            this.helperProps = {
                className: "rc-button__helper",
                ref: this.getHelper.bind(this),
                onKeyUp: this.onKeyUp.bind(this)
            };
        }
    }

    invoke(name, data) {
        const handler = this.props[name];

        if (typeof handler == "function") {
            if (arguments.length == 1) handler();
            else handler(data);
        }
    }

    onClick() {
        if (this.dom.helper) this.dom.helper.focus();

        this.invoke("onRelease");
    }

    onKeyUp({ keyCode: key, shiftKey, ctrlKey, altKey }) {
        this.invoke("onKey", { key, shiftKey, ctrlKey, altKey });

        if (key == 13) this.invoke("onRelease");
    }

    onFocusIn() {
        this.invoke("onFocusIn");
        this.invoke("onFocusChange", true);
    }

    onFocusOut() {
        this.invoke("onFocusOut");
        this.invoke("onFocusChange", false);
    }

    getHelper(element) {
        this.dom.helper = element;
    }

    render() {
        return <div {...this.elementProps}>
            {this.props.children}

            <If true={this.props.focusable !== false}>
                <input {...this.helperProps} />
            </If>
        </div>
    }
}
