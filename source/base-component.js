export default class BaseComponent extends React.Component {
    constructor(props) {
        super(props);

        this.isClient = typeof window != "undefined" && window && Boolean(window.document);

        let value = this.propsToValue(props);

        this.value = typeof value != "undefined" ? value : null;

        this.dom = {};
        this.components = {};

        this.define();
        this.bind();
    }

    componentDidMount() {
        if (this.isClient) {
            this.initialize();
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        let value = this.propsToValue(nextProps);
        let undefined;
        let shouldUpdate = value !== undefined;

        if (shouldUpdate) this.value = value;
        else for (let key in nextProps) {
            if (key == "value") continue;
            if (nextProps[key] !== this.props[key]) {
                shouldUpdate = true;
                break;
            }
        }

        return shouldUpdate;
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

    bind() { }

    initialize() { }

    propsToValue(props) { }

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

    invoke(name, data) {
        const handler = this.props[name];

        if (typeof handler == "function") {
            if (arguments.length == 1) handler();
            else handler(data);
        }
    }
}

function emptyFunction() { }
