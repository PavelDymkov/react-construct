import "./slider.css";


export default class Slider extends React.Component {
    static propTypes = {
        Container: PropTypes.func.isRequired,
        Thumb: PropTypes.func.isRequired,
        vertical: PropTypes.bool,
        animate: PropTypes.bool,
        value: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]),
        step: PropTypes.number,
        onChange: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.dom = {
            box: null,
            thumbs: []
        };

        this.values = getValues(props.value);

        this.size = {
            box: null,
            thumbs: []
        };

        this.interact = {
            startPositions: []
        };

        this.boxSize = null;
        this.thumbSize = null;
        this.startPosition = null;
    }

    componentDidMount() {
        this.initializeSizing();
    }

    componentDidUpdate() {
        this.initializeSizing();
    }

    componentWillReceiveProps(nextProps) {
    }

    getElement(name) {
        return element => this.dom[name] = element;
    }

    getElements(name, index) {
        return element => this.dom[name][index] = element;
    }

    initializeSizing() {
        if (this.props.vertical) {
            this.size.box = this.dom.box.getBoundingClientRect().height;
            this.size.thumbs = this.dom.thumbs.map(element => element && element.getBoundingClientRect().height);
        } else {
            this.size.box = this.dom.box.getBoundingClientRect().width;
            this.size.thumbs = this.dom.thumbs.map(element => element && element.getBoundingClientRect().width);
        }
    }

    onThumbInteractStart(index, event) {
        cancelEvent(event);

        let startPosition = this.props.vertical ? event.pageY : event.pageX;
        let realSize = this.size.box - this.size.thumbs[index];

        const positionCalculator = createPositionCalculator(realSize, startPosition, this.values[index] || 0);
        const onThumbMove = this.onThumbMove.bind(this, positionCalculator, realSize, index);
        const onThumbInteractStop = function (event) {
            event.preventDefault();
            event.stopPropagation();

            document.removeEventListener("mousemove", onThumbMove, false);
            document.removeEventListener("mouseup", onThumbInteractStop, false);
        };

        document.addEventListener("mousemove", onThumbMove, false);
        document.addEventListener("mouseup", onThumbInteractStop, false);
        document.addEventListener("click", preventClick, true);
    }

    onThumbMove(positionCalculator, realSize, index, event) {
        event.preventDefault();
        event.stopPropagation();

        let currentPosition = this.props.vertical ? event.pageY : event.pageX;
        let value = positionCalculator(currentPosition);

        if (this.props.animate) {
            this.dom.thumbs[index].style[this.props.vertical ? "top" : "left"] =
                `${realSize * value}px`;
        }

        this.values[index] = value;

        const { onChange } = this.props;

        if (typeof onChange == "function") {
            onChange(this.values);
        }
    }

    render() {
        const { Container, Thumb } = this.props;

        return <div ref={this.getElement("box")} className="rc-slider_container">
            <Container />

            <For in={this.values}>
                <div ref={this.getElements("thumbs", index)} key={`thumb_${index}`}
                     className="rc-slider_thumb"
                     onMouseDown={this.onThumbInteractStart.bind(this, index)}>
                    <Thumb />
                </div>
            </For>
        </div>
    }
}

function cancelEvent(event) {
    event.preventDefault();
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
}

function preventClick(event) {
    event.stopPropagation();

    document.removeEventListener("click", preventClick, true);
}

function getValues(source) {
    if (!source) return [0];
    if (typeof source == "number") return [source];
    return source;
}

function getValue(source) {
    if (source >= 0 && source <= 1) return source;
    return source > 1 ? 1 : 0;
}

function createPositionCalculator(size, startPosition, startValue) {
    return function (currentPosition) {
        let delta = currentPosition - startPosition;

        return getValue(startValue + delta / size);
    };
}
