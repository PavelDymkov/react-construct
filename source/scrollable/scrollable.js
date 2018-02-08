import "./scrollable.css";


const scrollValueObjectType = PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number
});
const scrollValueType = PropTypes.oneOf([PropTypes.number, scrollValueObjectType]);

export default class Scrollable extends BaseComponent {
    static propTypes = {
        value: scrollValueType,
        direction: PropTypes.number,
        ScrollBar: PropTypes.func,
        onScroll: PropTypes.func
    };

    static direction = {
        VERTICAL: 0b01,
        HORIZONTAL: 0b10
    };

    render() {
        const { ScrollBar } = this.props;

        return <div className="rc-scrollable__box" ref={this.getElement("box")}>
            <div className="rc-scrollable__content" ref={this.getElement("content")} onScroll={this.onScroll}>
                {this.props.children}
            </div>

            <If true={ScrollBar}>
                <div className="rc-scrollable__scroll-bar" ref={this.getElement("scrollbar")} onClick={stopPropagation}>
                    <ScrollBar />
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
