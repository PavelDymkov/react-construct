import "./slider.css";


export default class Slider extends BaseComponent {
    static propTypes = {
        Container: PropTypes.func.isRequired,
        Thumb: PropTypes.func.isRequired,
        vertical: PropTypes.bool,
        animate: PropTypes.bool,
        value: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]),
        onChange: PropTypes.func
    };

    define() {
        this.value = null;
        this.size = {
            box: null,
            thumbs: [],
            tracks: []
        };
    }

    initialize() {
        this.initializeSizing();
        this.position();
    }

    handleProps(props) {
        this.value = getValues(props.value);
    }

    update() {
        this.position();
    }

    initializeSizing() {
        let sizeProperty = this.props.vertical ? "height" : "width";
        let boxSize = this.dom.box.getBoundingClientRect()[sizeProperty];
        
        this.size.box = boxSize;
        this.size.thumbs = this.dom.thumbs.map(getThumbSizeMapper(sizeProperty));
        this.size.tracks = this.size.thumbs.map(thumbSize => boxSize - thumbSize);
    }

    position() {
        this.dom.thumbs.forEach((element, index) => {
            if (!element) return;

            let trackSize = this.size.tracks[index];
            let value = this.value[index] || 0;

            element.style[this.props.vertical ? "top" : "left"] = `${trackSize * value}px`;
        });
    }

    onThumbInteractStart(index, event) {
        cancelEvent(event);

        let trackSize = this.size.tracks[index];
        let startPosition = this.props.vertical ? event.pageY : event.pageX;
        let value = this.value[index] || 0;

        const positionCalculator =
            createPositionCalculator(trackSize, startPosition, value);
        const onThumbMove = this.onThumbMove.bind(this, positionCalculator, trackSize, index);
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

    onThumbMove(positionCalculator, trackSize, index, event) {
        event.preventDefault();
        event.stopPropagation();

        let currentPosition = this.props.vertical ? event.pageY : event.pageX;
        let value = positionCalculator(currentPosition);

        if (this.props.animate) {
            this.dom.thumbs[index].style[this.props.vertical ? "top" : "left"] =
                `${trackSize * value}px`;
        }

        this.value[index] = value;

        this.invoke("onChange", [...this.value]);
    }

    render() {
        const { Container, Thumb } = this.props;

        return <div ref={this.getElement("box")} className="rc-slider_container">
            <Container />

            <For in={this.value}>
                <div ref={this.getElements("thumbs", index)} key={`thumb_${index}`}
                     className="rc-slider_thumb"
                     onMouseDown={this.onThumbInteractStart.bind(this, index)}>
                    <Thumb index={index} />
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

function getThumbSizeMapper(sizeProperty) {
    return function (element) {
        return element ? element.getBoundingClientRect()[sizeProperty] : null;
    };
}

function createPositionCalculator(size, startPosition, startValue) {
    return function (currentPosition) {
        let delta = currentPosition - startPosition;

        return getValue(startValue + delta / size);
    };
}
