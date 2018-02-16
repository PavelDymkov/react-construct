import DragProvider from "../drag-provider.js";
import "./pointer-controlled.css";


export default class PointerControlledSlider extends BaseComponent {
    static propTypes = {
        Container: PropTypes.func.isRequired,
        Thumb: PropTypes.func.isRequired,
        value: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]),
        onChange: PropTypes.func,
        animate: PropTypes.bool,
        vertical: PropTypes.bool
    };

    static classNames = {
        box: "rc-pointer-controlled-slider__box",
        thumb: "rc-pointer-controlled-slider__thumb"
    };

    static fromSource(source) {
        if (!source) return [0];
        if (typeof source == "number") return [PointerControlledSlider.normalizeValueItem(source)];

        return source.map(PointerControlledSlider.normalizeValueItem);
    }

    static normalizeValueItem(source) {
        if (source >= 0 && source <= 1) return source;
        return source > 1 ? 1 : 0;
    }

    define() {
        this.size = {
            box: null,
            thumbs: [],
            tracks: []
        };
        this.dragProviders = null;
    }

    initialize() {
        this.sizing();
        this.position();

        this.dragProviders = this.dom.thumbs.map(createDragProvider, this);
    }

    propsToValue(props) {
        let value = PointerControlledSlider.fromSource(props.value);

        if (!this.value) return value;
        if (this.value.length == value.length && value.some(different, this.value)) return value;
    }

    update() {
        this.position();
    }

    uninitialize() {
        this.dragProviders.forEach(dragProvider => dragProvider.dispose());
        this.dragProviders = null;
    }

    sizing() {
        let sizeProperty = this.props.vertical ? "height" : "width";
        let boxSize = this.dom.box.getBoundingClientRect()[sizeProperty];
        
        this.size.box = boxSize;
        this.size.thumbs = this.dom.thumbs.map(getThumbSizeMapper(sizeProperty));
        this.size.tracks = this.size.thumbs.map(thumbSize => boxSize - thumbSize);
    }

    position() {
        this.dom.thumbs.forEach(setThumbPosition, this);
    }

    setValue(source) {
        let value = PointerControlledSlider.fromSource(source);

        if (!this.value || this.value.length != value.length) return false;

        let updated = value.some(different, this.value);

        if (updated) {
            this.value = value;
            
            if (this.props.animate) this.position();
        }

        return updated;
    }

    changeValueItem(valueItem, index) {
        if (index in this.value == false || this.value[index] == valueItem) return false;

        this.value = [...this.value];
        this.value[index] = valueItem;

        if (this.props.animate) setThumbPosition.call(this, this.dom.thumbs[index], index);

        return true;
    }

    render() {
        const { Container, Thumb } = this.props;

        return <div ref={this.getElement("box")} className={PointerControlledSlider.classNames.box}>
            <Container />

            <For in={this.value}>
                <div ref={this.getElements("thumbs", index)}
                    key={`thumb_${index}`}
                    className={PointerControlledSlider.classNames.thumb}>
                    <Thumb index={index} />
                </div>
            </For>
        </div>
    }
}

function different(value, index) {
    return value != this[index];
}

function getThumbSizeMapper(sizeProperty) {
    return function (element) {
        return element ? element.getBoundingClientRect()[sizeProperty] : null;
    };
}

function setThumbPosition(element, index) {
    if (!element) return;

    let trackSize = this.size.tracks[index];
    let value = this.value[index] || 0;

    element.style[this.props.vertical ? "top" : "left"] = `${trackSize * value}px`;
}

function createDragProvider(thumbElement, index) {
    return new DragProvider({
        element: thumbElement,
        onStart: thumbInteractionStart.bind(this, index),
        onMove: thumbInteract.bind(this)
    });
}

function thumbInteractionStart(index) {
    let trackSize = this.size.tracks[index];
    let startValue = this.value[index] || 0;

    return { index, trackSize, startValue };
}

function thumbInteract(event) {
    let { index, trackSize, startValue } = event;
    let { vertical } = this.props;
    let delta = vertical ? event.deltaY : event.deltaX;
    let valueItem = PointerControlledSlider.normalizeValueItem(startValue + delta / trackSize);

    if (this.changeValueItem(valueItem, index)) this.invoke("onChange", [...this.value]);
}
