import "./outside-click.css";


export default class OutsideClick extends React.Component {
    static propTypes = {
        onOutsideClick: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.dom = {
            element: null
        };

        this.getElement = this.getElement.bind(this);
        this.outsideClickHandler = this.outsideClickHandler.bind(this);
    }

    componentDidMount() {
        document.addEventListener("click", this.outsideClickHandler, false);
    }

    componentWillUnmount() {
        document.removeEventListener("click", this.outsideClickHandler);
    }

    getElement(element) {
        if (element) this.dom.element = element;
    }

    outsideClickHandler({ target: element }) {
        const { onOutsideClick } = this.props;

        if (typeof onOutsideClick == "function") {
            let { element: targetElement } = this.dom;

            do if (element == targetElement) return;
            while (element = element.parentNode);

            onOutsideClick();
        }
    }

    render() {
        return <div className="rc-outside-click" ref={this.getElement}>
            {this.props.children}
        </div>
    }
}
