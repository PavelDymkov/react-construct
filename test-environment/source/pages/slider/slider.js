import Slider from "ReactConstruct/slider";


function Container(props) {
    return <div className={styles.container}></div>
}

function VerticalContainer(props) {
    return <div className={styles.vertical_container}></div>
}

function Thumb(props) {
    return <div className={styles.thumb}></div>
}

function onChange(values) {
    console.log(values[0]);
}

export default function () {
    return <div>
        <div id="horizontal-slider">
            <Slider Container={Container} Thumb={Thumb} onChange={onChange} animate />
        </div>
        <div id="vertical-slider">
            <Slider vertical Container={VerticalContainer} Thumb={Thumb} animate />
        </div>
    </div>
}
