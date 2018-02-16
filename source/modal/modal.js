import "./modal.css";

const ReactDOM = require("react-dom");


export default class Modal extends BaseComponent {
    static propTypes = {
        onClose: PropTypes.func,
        onScroll: PropTypes.func
    };

    static classNames = {
        root: "rc-modal__root",
        box: "rc-modal__box",
        content: "rc-modal__content"
    };

    static closeReason = {
        BY_ESCAPE_BUTTON: 1,
        BY_OUTSIDE_CLICK: 2
    };

    define() {
        this.events = null;
    }

    componentWillMount() {
        if (this.isClient) {
            this.dom.root = getModalRootElement();
        }
    }

    initialize() {
        this.events = {
            closeByEscape: this.closeByEscape.bind(this),
            closeByOutsideClick: this.closeBy.bind(this, Modal.closeReason.BY_OUTSIDE_CLICK),
            preventPageScrollByScrollbar: preventPageScrollByScrollbar(window.scrollX, window.scrollY)
        };

        window.addEventListener("keyup", this.events.closeByEscape, false);
        window.addEventListener("keydown", preventScrollByKeyboard, false);
        window.addEventListener("scroll", preventPageScrollByScrollbar, false);
        this.dom.element.addEventListener("mousewheel", preventDefault, false);
        this.dom.element.addEventListener("click", this.events.closeByOutsideClick, false);
    }

    unitialize() {
        window.removeEventListener("keyup", this.events.closeByEscape, false);
        window.removeEventListener("keydown", preventScrollByKeyboard, false);
        window.removeEventListener("scroll", preventPageScrollByScrollbar, false);
        this.dom.element.removeEventListener("mousewheel", preventDefault, false);
        this.dom.element.removeEventListener("click", this.events.closeByOutsideClick, false);

        this.events = {};
    }

    closeByEscape({ keyCode }) {
        if (keyCode == KeyCode.Escape) {
            this.closeBy(Modal.closeReason.BY_ESCAPE_BUTTON);
        }
    }

    closeBy(reason) {
        this.invoke("onClose", reason);
    }

    render() {
        if (!this.isClient) return null;

        let modal =
            <div ref={this.getElement("element")} className={Modal.classNames.box}>
                {this.props.children}
            </div>

        return ReactDOM.createPortal(modal, this.dom.root);
    }
}

function getModalRootElement() {
    let modalRootElement = document.querySelector(`.${Modal.classNames.root}`);

    if (!modalRootElement) {
        modalRootElement = document.createElement("div");

        modalRootElement.className = Modal.classNames.root;

        document.body.appendChild(modalRootElement);
    }

    return modalRootElement;
}

function preventDefault(event) {
    event.preventDefault();
}

const exceptionCodes = [
    KeyCode.ArrowLeft, KeyCode.ArrowRight, KeyCode.ArrowUp, KeyCode.ArrowDown,
    KeyCode.PageUp, KeyCode.PageDown, KeyCode.End, KeyCode.Home
];

function preventScrollByKeyboard(event) {
    let { keyCode } = event;

    if (exceptionCodes.some(exceptionCode => keyCode == exceptionCode)) {
        preventDefault(event);
    }
}

function preventPageScrollByScrollbar(x, y) {
    return function () {
        window.scrollTo(x, y);
    };
}
