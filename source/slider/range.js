import Slider from "../slider.js";


export default class Range extends BaseComponent {
    static propTypes = {
        Container: PropTypes.func.isRequired,
        Thumb: PropTypes.func.isRequired,
        value: PropTypes.arrayOf(PropTypes.number),
        onChange: PropTypes.func,
        vertical: PropTypes.bool,
        animate: PropTypes.bool,
        bounce: PropTypes.bool
    };

    define() {
        this.sliderValue = [0, 1];

        this.leftThumbRate = null;
        this.rightThumbRate = null;
        this.rightThumbOffset = null;
    }

    bind() {
        this.sliderChange = this.sliderChange.bind(this);
    }

    propsToValue(props) {
        let valueSource = Slider.fromSource(props.value);
        let value = valueSource.length == 2 || valueSource[0] <= valueSource[1] ? valueSource : [0, 0];

        if (!this.value || valueNotEqual(this.value, value)) return value;
    }

    initialize() {
        this.position();
    }

    update() {
        this.position();
    }

    position() {
        let { size: sliderSizing } = this.components.slider;

        let leftThumbTrack = sliderSizing.tracks[0] - sliderSizing.thumbs[1];
        let rightThumbTrack = sliderSizing.tracks[1] - sliderSizing.thumbs[0];

        this.leftThumbRate = leftThumbTrack / sliderSizing.tracks[0];

        this.rightThumbRate = rightThumbTrack / sliderSizing.tracks[1];
        this.rightThumbOffset = sliderSizing.thumbs[0] / sliderSizing.tracks[0];

        let sliderValue = [
            this.value[0] * this.leftThumbRate,
            this.value[1] * this.rightThumbRate + this.rightThumbOffset
        ];

        this.setSliderValue(sliderValue, true);
    }

    sliderChange(sliderValue) {
        let [leftSliderValue, rightSliderValue] = sliderValue;
        const normalize = Slider.normalizeValueItem;

        let leftValue = normalize(leftSliderValue / this.leftThumbRate);
        let rightValue = normalize((rightSliderValue - this.rightThumbOffset) / this.rightThumbRate);

        if (this.props.bounce) {
            if (this.value[0] != leftValue && leftValue > rightValue) {
                rightValue = leftValue;
                sliderValue[1] = rightValue * this.rightThumbRate + this.rightThumbOffset;
            }

            if (this.value[1] != rightValue && rightValue < leftValue) {
                leftValue = rightValue;
                sliderValue[0] = leftValue * this.leftThumbRate;
            }
        }

        if (this.value[0] != leftValue && leftValue > rightValue) leftValue = rightValue;
        if (this.value[1] != rightValue && rightValue < leftValue) rightValue = leftValue;

        let value = [leftValue, rightValue];

        if (valueNotEqual(value, this.value)) {
            this.value = value;

            this.invoke("onChange", [...value]);
        }

        this.setSliderValue(sliderValue, false);
    }

    setSliderValue(sliderValue, forceUpdate) {
        if (sliderValue[0] > this.leftThumbRate) sliderValue[0] = this.leftThumbRate;
        if (sliderValue[1] < this.rightThumbOffset) sliderValue[1] = this.rightThumbOffset;

        if (valueNotEqual(this.sliderValue, sliderValue)) {
            this.sliderValue = sliderValue;
            this.components.slider.setValue(sliderValue);

            if (forceUpdate || this.props.animate) this.components.slider.position();
        }
    }

    render() {
        let { props } = this;

        return <Slider ref={this.getComponent("slider")}
            Container={props.Container} Thumb={props.Thumb}
            value={this.sliderValue}
            vertical={props.vertical}
            animate={false}
            onChange={this.sliderChange} />
    }
}

function valueNotEqual(a, b) {
    return a[0] != b[0] || a[1] != b[1];
}
