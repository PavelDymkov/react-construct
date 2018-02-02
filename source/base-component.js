export default class BaseComponent extends React.Component {
    constructor(props) {
        super(props);

        this.isClient = typeof window != "undefined" && Boolean(window.document);

        this.dom = {};
        this.events = {};
    }

    componentDidMount() {
        if (this.isClient) {
            this.initialize();
        }
    }

    componentDidUpdate() {
        this.update();
    }

    componentWillUnmount() {
        if (this.isClient) {
            this.unitialize();
        }
    }

    initialize() { }

    update() { }

    unitialize() { }

    getElement(name) {
        if (!this.isClient) return emptyFunction;

        return element => this.dom[name] = element;
    }

    invoke(name, data) {
        const handler = this.props[name];

        if (typeof handler == "function") {
            if (arguments.length == 1) handler();
            else handler(data);
        }
    }
}

function emptyFunction() { }
