import Modal from "./modal.js";
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

    static classNames = {
        box: "rc-dropdown__box",
        content: "rc-dropdown__content"
    };

    define() {
        this.inverted = null;
        this.boxRect = null;
        this.contentRect = null;
    }

    initialize() {
        this.position();
    }

    update() {
        this.position();
    }

    position() {
        if (!this.dom.content) return;

        this.boxRect = this.dom.box.getBoundingClientRect();

        this.dom.content.style.width = `${this.boxRect.width}px`;
        this.dom.content.style.left = `${this.boxRect.left}px`;

        if (this.props.invert) this.positionInvert();
        else this.positionNormal();
    }

    positionNormal() {
        if (this.props.fitOnScreen === false) {
            this.cancelInvert();

            return;
        }

        let contentRect = this.dom.content.getBoundingClientRect();
        let screenTop = window.pageYOffset;
        let screenBottom = screenTop + document.documentElement.clientHeight;

        if (contentRect.bottom > screenBottom) {
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
        if (this.inverted === true) return;
        else this.inverted = true;

        contentStyles.top = "";
        contentStyles.bottom = `${this.boxRect.top}px`;
    }

    cancelInvert() {
        if (!this.inverted === false) return;
        else this.inverted = false;

        this.dom.content.style.top = `${this.boxRect.bottom}px`;
        this.dom.content.style.bottom = "";
    }

    render() {
        return <div ref={this.getElement("box")} className={Dropdown.classNames.box}>
            {this.props.box}

            <If true={this.props.show}>
                <Modal>
                    <div ref={this.getElement("content")} className={Dropdown.classNames.content}>
                        {this.props.content}
                    </div>
                </Modal>
            </If>
        </div>
    }
}
