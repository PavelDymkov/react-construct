import Slider from "../slider.js";


export default class Range extends BaseComponent {
    static propTypes = {
        Container: PropTypes.func.isRequired,
        Thumb: PropTypes.func.isRequired,
        vertical: PropTypes.bool,
        animate: PropTypes.bool,
        bounce: PropTypes.bool,
        value: PropTypes.arrayOf(PropTypes.number),
        onChange: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.state = {
            sliderValue: [0, 1]
        };

        this.value = getValues(props.value);

        this.leftThumb = {
            track: null, rate: null
        };
        this.rightThumb = {
            track: null, rate: null, offset: null
        };

        this.sliderProps = {
            ref: this.getComponent("slider"),
            Container: props.Container,
            Thumb: props.Thumb, //.bind(null, this.props.Thumb, index => this.getElements("thumb", index)),
            vertical: props.vertical,
            animate: false,
            onChange: this.sliderChange.bind(this)
        };
    }

    initialize() {
        this.position();
    }

    update() {
        this.position();
    }

    position() {
        let { size: sliderSizing } = this.components.slider;

        this.leftThumb.track = sliderSizing.tracks[0] - sliderSizing.thumbs[1];
        this.leftThumb.rate = this.leftThumb.track / sliderSizing.tracks[0];

        this.rightThumb.track = sliderSizing.tracks[1] - sliderSizing.thumbs[0];
        this.rightThumb.rate = this.rightThumb.track / sliderSizing.tracks[1];
        this.rightThumb.offset = sliderSizing.thumbs[0] / sliderSizing.tracks[0];
        
        let sliderValue = [
            this.value[0] * this.leftThumb.rate,
            this.value[1] * this.rightThumb.rate + this.rightThumb.offset
        ];

        this.setSliderValue(sliderValue);
    }

    sliderChange(sliderValue) {
        let [leftSliderValue, rightSliderValue] = sliderValue;

        let leftValue = leftSliderValue / this.leftThumb.rate;
        let rightValue = rightSliderValue / this.rightThumb.rate;

        let value = [leftValue, rightValue];

        if (valueNotEqual(value, this.value)) {
            this.value = value;

            // this.invoke("onChange", value);
        }

        this.setSliderValue(sliderValue);
    }

    setSliderValue(value) {
        if (valueNotEqual(this.state.sliderValue, value)) {
            this.setState({ sliderValue: value });
        }
    }

    render() {
        return <Slider {...this.sliderProps} value={this.state.sliderValue} />
    }
}

function getValues(source) {
    if (!source) return [0, 0];

    return [getValue(source[0]), getValue(source[1])].sort((a, b) => a > b);
}

function getValue(source) {
    if (source >= 0 && source <= 1) return source;

    return source > 1 ? 1 : 0;
}

function valueNotEqual(a, b) {
    return a[0] != b[0] || a[1] != b[1];
}
