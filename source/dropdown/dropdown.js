import "./dropdown.css";


export default class Dropdown extends BaseComponent {
    static propTypes = {
        box: PropTypes.node,
        content: PropTypes.node,
        show: PropTypes.bool,
        invert: PropTypes.bool,
        fitOnScreen: PropTypes.bool,
        onClose: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.inverted = false;
    }

    componentDidUpdate() {
        this.position();
    }

    initialize() {
        this.position();
    }

    position() {
        if (!this.dom.content) return;

        if (this.props.invert) this.positionInvert();
        else this.positionNormal();

        if (this.props.fitOnScreen === false) {
            if (this.props.invert) this.invert();

            return;
        }

        let contentRect = this.dom.content.getBoundingClientRect();
        let screenTop = window.pageYOffset;
        let screenBottom = screenTop + document.documentElement.clientHeight;

        if (this.props.invert) {
            if (contentRect.top > screenTop) {
                let boxRect = this.dom.box.getBoundingClientRect();

                if (contentRect.top - boxRect.height - contentRect.height >= screenTop) {
                    this.invert();
                } else {
                    this.cancelInvert();
                }
            } else {
                this.cancelInvert();
            }
        } else {
            if (contentRect.bottom > screenBottom) {
                let boxRect = this.dom.box.getBoundingClientRect();

                if (contentRect.top - boxRect.height - contentRect.height >= screenTop) {
                    this.invert();
                } else {
                    this.cancelInvert();
                }
            } else {
                this.cancelInvert();
            }
        }
    }

    positionNormal() {
        if (this.props.fitOnScreen === false) return;

        let contentRect = this.dom.content.getBoundingClientRect();
        let screenTop = window.pageYOffset;
        let screenBottom = screenTop + document.documentElement.clientHeight;

        if (contentRect.bottom > screenBottom) {
            let boxRect = this.dom.box.getBoundingClientRect();

            if (contentRect.top - boxRect.height - contentRect.height >= screenTop) {
                this.invert();
            } else {
                this.cancelInvert();
            }
        } else {
            this.cancelInvert();
        }
    }

    positionInvert() {
        if (this.props.fitOnScreen === false) {
            this.invert();

            return;
        }

        let contentRect = this.dom.content.getBoundingClientRect();
        let screenTop = window.pageYOffset;
        let screenBottom = screenTop + document.documentElement.clientHeight;

        if (contentRect.top > screenTop) {
            let boxRect = this.dom.box.getBoundingClientRect();

            if (contentRect.top - boxRect.height - contentRect.height >= screenTop) {
                this.invert();
            } else {
                this.cancelInvert();
            }
        } else {
            this.cancelInvert();
        }
    }

    invert() {
        if (this.inverted) return;
        else this.inverted = true;

        this.dom.content.style.top = "inherit";
        this.dom.content.style.bottom = "100%";
    }

    cancelInvert() {
        if (!this.inverted) return;
        else this.inverted = false;

        this.dom.content.style.top = "100%";
        this.dom.content.style.bottom = "";
    }

    render() {
        return <div ref={this.getElement("box")} className="rc-dropdown__box">
            {this.props.box}

            <If true={this.props.show}>
                <div ref={this.getElement("content")} className="rc-dropdown__content">
                    {this.props.content}
                </div>
            </If>
        </div>
    }
}
