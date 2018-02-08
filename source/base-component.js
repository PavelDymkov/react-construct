export default class BaseComponent extends React.Component {
    constructor(props) {
        super(props);

        this.isClient = typeof window != "undefined" && Boolean(window.document);

        this.data = {};
        this.dom = {};
        this.components = {};
        this.events = {};

        this.define();
        this.handleProps(props);
    }

    componentDidMount() {
        if (this.isClient) {
            this.initialize();
        }
    }

    componentWillReceiveProps(nextProps) {
        this.handleProps(nextProps);
    }

    componentDidUpdate() {
        this.update();
    }

    componentWillUnmount() {
        if (this.isClient) {
            this.unitialize();
        }
    }

    define() { }

    initialize() { }

    handleProps(props) { } // applyProps

    update() { }

    unitialize() { }

    getElement(name) {
        if (!this.isClient) return emptyFunction;

        return element => this.dom[name] = element;
    }

    getElements(name, index) {
        if (!this.isClient) return emptyFunction;

        return element => {
            if (!this.dom[name]) this.dom[name] = [];

            this.dom[name][index] = element;
        };
    }

    getComponent(name) {
        if (!this.isClient) return emptyFunction;

        return component => this.components[name] = component;
    }

    rerender() {
        this.setState({ __update__: Math.random() });
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
