import "./modal.css";

const ReactDOM = require("react-dom");


export default class Modal extends React.Component {
    static propTypes = {
        onClose: PropTypes.func,
        onScroll: PropTypes.func
    };

    static closeReason = {
        BY_ESCAPE_BUTTON: 1,
        BY_OUTSIDE_CLICK: 2
    };

    static MODAL_ROOT_CLASS_NAME = "rc-modal__root";

    constructor(props) {
        super(props);

        this.isReady = false;
        this.dom = {
            root: getModalRootElement()
        };
    }

    componentDidMount() {
        this.initialize();
    }

    getElement(name) {
        return element => this.dom[name] = element;
    }

    initialize() {
        if (this.isReady) return;

        preventScrollByKeyboard.initialScroll = [scrollX, scrollY];

        window.addEventListener("keyup", ({ keyCode }) => keyCode == 27 && this.closeBy(Modal.closeReason.BY_ESCAPE_BUTTON), false);
        window.addEventListener("keydown", preventScrollByKeyboard, false);
        window.addEventListener("scroll",preventPageScrollByScrollbar, false);
        this.dom.box.addEventListener("mousewheel", preventDefault, false);
        this.dom.box.addEventListener("click", this.closeBy.bind(this, Modal.closeReason.BY_OUTSIDE_CLICK), false);

        this.isReady = true;
    }

    closeBy(reason) {
        const { onClose } = this.props;

        if (typeof onClose == "function") {
            onClose(reason);
        }
    }

    render() {
        let modal = <div ref={this.getElement("box")} className="rc-modal__box">
            <div className="rc-modal__content">
                {this.props.children}
            </div>
        </div>

        return ReactDOM.createPortal(modal, this.dom.root);
    }
}

function getModalRootElement() {
    let modalRootElement = document.querySelector(`.${Modal.MODAL_ROOT_CLASS_NAME}`);

    if (!modalRootElement) {
        modalRootElement = document.createElement("div");

        modalRootElement.className = Modal.MODAL_ROOT_CLASS_NAME;

        document.body.appendChild(modalRootElement);
    }

    return modalRootElement;
}

function preventDefault(event) {
    event.preventDefault();
    // event.stopPropagation();
    // event.nativeEvent.stopImmediatePropagation();
}

function preventScrollByKeyboard(event) {
    let { keyCode } = event;

    if ([38, 40, 37, 39, 36, 35, 33, 34].some(exceptionCode => keyCode == exceptionCode)) {
        preventDefault(event);
    }
}

function preventPageScrollByScrollbar() {
    window.scrollTo(...preventPageScrollByScrollbar.initialScroll);
}
