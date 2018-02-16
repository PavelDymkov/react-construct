import PointerControlledSlider from "./slider/pointer-controlled.js";
import Button from "./button.js";


export default class Slider extends BaseComponent {
    static propTypes = {
        ...PointerControlledSlider.propTypes,
        keyStep: PropTypes.number
    };

    static fromSource = PointerControlledSlider.fromSource;
    static normalizeValueItem = PointerControlledSlider.normalizeValueItem;

    static defaultKeyStep = 0.05;

    define() {
        this.size = {
            box: null,
            thumbs: [],
            tracks: []
        };
        this.Thumb = null;
        this.thumbsOnKeyHandlers = [];
    }

    bind() {
        this.Thumb = Thumb.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    propsToValue(props) {
        return PointerControlledSlider.prototype.propsToValue.call(this, props);
    }

    initialize() {
        this.size = this.components.slider.size;
    }

    position() {
        this.components.slider.position();
    }

    onChange(value) {
        this.value = value;
        this.invoke("onChange", [...value]);
    }

    onKey(index, { key }) {
        switch (key) {
            case 37: // ArrowLeft
                if (!this.props.vertical) this.decrease(index);
                break;
            case 39: // ArrowRight
                if (!this.props.vertical) this.increase(index);
                break;
            case 38: // ArrowUp
                if (this.props.vertical) this.decrease(index);
                break;
            case 40: // ArrowDown
                if (this.props.vertical) this.increase(index);
                break;
        }
    }

    increase(index) {
        this.changeValueItem(this.value[index] + (this.props.keyStep || Slider.defaultKeyStep), index);
    }

    decrease(index) {
        this.changeValueItem(this.value[index] - (this.props.keyStep || Slider.defaultKeyStep), index);
    }

    changeValueItem(valueItem, index) {
        if (this.components.slider.changeValueItem(valueItem, index)) {
            this.onChange([...this.components.slider.value]);
        };
    }

    setValue(value) {
        return this.components.slider.setValue(value);
    }

    render() {
        return <PointerControlledSlider
            ref={this.getComponent("slider")}
            Container={this.props.Container}
            Thumb={this.Thumb}
            value={this.value}
            onChange={this.onChange}
            animate={this.props.animate}
            vertical={this.props.vertical} />
    }
}

function Thumb(props) {
    const { Thumb } = this.props;

    return <Button onKey={this.onKey.bind(this, props.index)}>
        <Thumb />
    </Button>
}
