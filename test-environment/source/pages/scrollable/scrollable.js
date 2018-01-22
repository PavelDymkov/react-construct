import Scrollable from "ReactConstruct/scrollable";


class ScrollBar extends React.Component {
    static propTypes = {
        size: PropTypes.number.isRequired,
        offset: PropTypes.number.isRequired,
        provideScrollbarItem: PropTypes.func
    };

    render() {
        let { size, offset, provideScrollbarItem } = this.props;

        return <div className={styles["scroll-bar"]}>
            <div className={styles["scroll-bar-item"]}
                 style={{ height: `${size}%`, top: `${offset}%` }}
                 ref={provideScrollbarItem}>
            </div>
        </div>
    }
}

export default function () {
    return <div>
        <div className={styles.container}>
            <Scrollable ScrollBar={ScrollBar}
                        onInfo={info => console.log("onInfo", info)}
                        onScroll={event => console.log("onScroll", event)}>
                <div>text 1</div>
                <div>text 2</div>
                <div>text 3</div>
                <div>text 4</div>
                <div>text 5</div>
                <div>text 6</div>
                <div>text 7</div>
                <div>text 8</div>
                <div>text 9</div>
                <div>text 10</div>
                <div>text 11</div>
                <div>text 12</div>
                <div>text 13</div>
                <div>text 14</div>
                <div>text 15</div>
                <div>text 16</div>
                <div>text 17</div>
            </Scrollable>
        </div>
    </div>
}
