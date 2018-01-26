import Dropdown from "ReactConstruct/dropdown";


function getBox(direction) {
    return <div className={styles.box}>
        box {direction}
    </div>
}

function getContent(isBig) {
    let style = styles.content;

    if (isBig) {
        style += " " + styles["big-content"];
    }

    return <div className={style}>
        content
    </div>
}

const steps = {
    POSITION_NORMAL: 1,
};

console.log("Dropdown test: steps", steps);

export default class extends React.Component {
    constructor(props) {
        super(props);

        this.state = { step: 1 };

        // setTimeout(() => this.setState({ step: 2 }, () => console.log("State updated")), 25);
    }

    nextStep() {
        let step = (this.state.step | 0) + 1;

        setTimeout(() => this.setState({ step }, () => console.log("Dropdown test: steps", steps)), 25);
    }

    updateStep() {

    }

    step1() {
        let u = this.state.step == 1.5;

        return <div className={styles.page}>
            <div>
                <div className={styles.cell}>
                    <Dropdown show box={getBox("↓")} content={getContent()}/>
                </div>
                <div className={styles.cell}>
                    <Dropdown show box={getBox("↓")} content={getContent("BIG")} />
                </div>
                <div className={styles.cell}>
                    <Dropdown show box={getBox("↑")} content={getContent()} invert fitOnScreen={false}/>
                </div>
            </div>
        </div>
    }

    render() {
        switch (this.state.step | 0) {
            case steps.POSITION_NORMAL: return this.step1();

            default: return null;
        }

        let x = this.state.step == 2;

        return <div className={styles.page}>
            <div>
                <div className={styles.cell}>
                    <Dropdown show box={getBox("↓")} content={getContent()}/>
                </div>
                <div className={styles.cell}>
                    <Dropdown show box={getBox("↓")} content={getContent("BIG")} />
                </div>
                <div className={styles.cell}>
                    <Dropdown show box={getBox("↑")} content={getContent()} invert fitOnScreen={false}/>
                </div>
            </div>
            <div className={styles["middle-line"]}>
                <div className={styles.cell}>
                    <Dropdown show box={getBox("↓")} content={getContent("BIG")}/>
                </div>
                <div className={styles.cell}>
                    <Dropdown show box={getBox("↑")} content={getContent("BIG")} invert/>
                </div>
            </div>
            <div className={styles["bottom-line"]}>
                <div className={styles.cell}>
                    <Dropdown show box={getBox("↑")} content={getContent()}/>
                </div>
                <div className={styles.cell}>
                    <Dropdown show box={getBox("↓")} content={getContent()} fitOnScreen={false}/>
                </div>
                <div className={styles.cell}>
                    <Dropdown show box={getBox("↑")} content={getContent()} invert/>
                </div>
            </div>
        </div>
    }
}
