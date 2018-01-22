import "./scrollable.css";


const scrollValueObjectType = PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number
});
const scrollValueType = PropTypes.oneOf([PropTypes.number, scrollValueObjectType]);

export default class Scrollable extends React.Component {
    static propTypes = {
        direction: PropTypes.number,
        initialScrollValue: scrollValueType,
        scrollValue: scrollValueType,
        ScrollBar: PropTypes.func,
        onInfo: PropTypes.func,
        onScroll: PropTypes.func
    };

    static direction = {
        VERTICAL: 0b01,
        HORIZONTAL: 0b10
    };

    constructor(props) {
        super(props);

        this.state = {
            update: 0
        };

        this.direction = getDirection(props.direction);

        this.dom = {
            box: null,
            content: null,
            scrollbar: null
        };

        this.scrollData = {
            x: {},
            y: {
                box: null,
                content: null,
                value: null,
                isOverflow: false,
                scrollbar: {
                    props: {
                        value: null,
                        size: null,
                        offset: null,
                        provideScrollbarThumb: element => this.scrollbarThumb.element = element
                    },
                    isVisib: false,
                    isHidden: false,
                    thumb: {}
                }
            }
        };

        this.scrollbarProps = {
            value: null,
            size: null,
            offset: null,
            provideScrollbarThumb: element => this.scrollbarThumb.element = element
        };

        this.scrollbarThumb = {
            element: null,
            isInteract: false,
            initialized: false,
            startScrollValue: null,
            startPosition: null
        };

        this.onScroll = this.onScroll.bind(this);

        this.onScrollbarThumbInteractStart = this.onScrollbarThumbInteractStart.bind(this);
        this.onScrollbarThumbMove = this.onScrollbarThumbMove.bind(this);
        this.onScrollbarThumbInteractStop = this.onScrollbarThumbInteractStop.bind(this);
    }

    componentDidMount() {
        this.initializeScrollData();
        this.initializeScrollbarThumb();
    }

    componentDidUpdate() {
        // this.positioning();
        // this.initializeScrollbarThumb();
    }

    componentWillUnmount() {
        this.uninitializeScrollbarThumb();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.direction) this.direction = getDirection(nextProps.direction);
    }

    getElement(name) {
        return element => this.dom[name] = element;
    }

    onScroll() {

    }

    initializeScrollData() {
        if (this.direction & Scrollable.direction.VERTICAL) {
            let boxHeight = this.dom.box.clientHeight;
            let contentHeight = this.dom.content.scrollHeight;

            // let rate = boxHeight / contentHeight;
            let isOverflow = contentHeight > boxHeight;

            if (isOverflow) {
                let scrollbarWidth = this.dom.scrollbar.getBoundingClientRect().width;

                this.dom.content.style.marginRight = `${scrollbarWidth}px`;
            } else {
                this.dom.content.style.marginRight = `0px`;
            }

            let maxValue = contentHeight - boxHeight;
            let value = this.dom.content.scrollTop / maxValue;

            this.scrollData.y = {
                box: boxHeight,
                content: contentHeight,
                value, isOverflow
            };
        }

        this.setState({ overflowY: this.scrollData.y.isOverflow });
    }

    initializeScrollbarThumb() {
        if (this.scrollbarThumb.element) {
            this.scrollbarThumb.element.addEventListener("mousedown", this.onScrollbarThumbInteractStart, false);

            document.addEventListener("mousemove", this.onScrollbarThumbMove, false);
            document.addEventListener("mouseup", this.onScrollbarThumbInteractStop, false);

            this.scrollbarThumb.initialized = true;
        }
    }

    uninitializeScrollbarThumb() {
        if (this.scrollbarThumb.element) {
            this.scrollbarThumb.element.removeEventListener("mousedown", this.onScrollbarThumbInteractStart);

            document.removeEventListener("mousemove", this.onScrollbarThumbMove);
            document.removeEventListener("mouseup", this.onScrollbarThumbInteractStop);

            this.scrollbarThumb.initialized = false;
        }
    }

    onScrollbarThumbInteractStart(event) {
        event.preventDefault();
        event.stopPropagation();

        this.scrollbarThumb.isInteract = true;
        this.scrollbarThumb.startPosition = event.pageY;
        this.scrollbarThumb.startScrollValue = this.state.scrollValue;

        document.addEventListener("click", preventClick, true);
    }

    onScrollbarThumbMove(event) {
        if (!this.scrollbarThumb.isInteract) return;

        event.preventDefault();
        event.stopPropagation();

        let delta = event.pageY - this.scrollbarThumb.startPosition;

        let { boxHeight } = this.data;
        let realHeight = boxHeight - (boxHeight * this.rate);

        let scrollValue = this.scrollbarThumb.startScrollValue + (delta / realHeight);

        this.setScrollValue(scrollValue);
    }

    onScrollbarThumbInteractStop(event) {
        if (!this.scrollbarThumb.isInteract) return;

        event.preventDefault();
        event.stopPropagation();

        this.scrollbarThumb.isInteract = false;
    }

    render() {
        const { ScrollBar } = this.props;
        const { scrollbarProps } = this;

        if (ScrollBar) {
            scrollbarProps.value = this.scrollData.y;
            scrollbarProps.size = (this.scrollData.y.box / this.scrollData.y.content) * 100;
            scrollbarProps.offset = scrollbarProps.value * (100 - scrollbarProps.size);
        }

        return <div className="rc-scrollable__box" ref={this.getElement("box")}>
            <div className="rc-scrollable__content" ref={this.getElement("content")} onScroll={this.onScroll}>
                {this.props.children}
            </div>

            <If true={ScrollBar}>
                <div className="rc-scrollable__scroll-bar" ref={this.getElement("scrollbar")} onClick={stopPropagation}>
                    <ScrollBar {...scrollbarProps} />
                </div>
            </If>
        </div>
    }
}

function stopPropagation(event) {
    event.preventDefault();
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
}

function preventClick(event) {
    event.stopPropagation();

    document.removeEventListener("click", preventClick, true);
}

function getDirection(sourceValue) {
    if (!sourceValue) return Scrollable.direction.VERTICAL;
    if ((Scrollable.direction.VERTICAL | Scrollable.direction.HORIZONTAL) & sourceValue) return sourceValue;
    return Scrollable.direction.VERTICAL;
}
