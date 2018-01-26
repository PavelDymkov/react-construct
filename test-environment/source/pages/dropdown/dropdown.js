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

export default function () {
    return <div className={styles.page}>
        <div>
            <div className={styles.cell}>
                <Dropdown show box={getBox("↓")} content={getContent()} />
            </div>
            <div className={styles.cell}>
                <Dropdown show box={getBox("↓")} content={getContent()} invert />
            </div>
            <div className={styles.cell}>
                <Dropdown show box={getBox("↑")} content={getContent()} invert fitOnScreen={false} />
            </div>
        </div>
        <div className={styles["middle-line"]}>
            <div className={styles.cell}>&nbsp;</div>
            <div className={styles.cell}>&nbsp;</div>
            <div className={styles.cell}>&nbsp;</div>
            <div className={styles.cell}>
                <Dropdown show box={getBox("↓")} content={getContent("BIG")} />
            </div>
            <div className={styles.cell}>
                <Dropdown show box={getBox("↑")} content={getContent("BIG")} invert />
            </div>
        </div>
        <div className={styles["bottom-line"]}>
            <div className={styles.cell}>
                <Dropdown show box={getBox("↑")} content={getContent()} />
            </div>
            <div className={styles.cell}>
                <Dropdown show box={getBox("↓")} content={getContent()} fitOnScreen={false} />
            </div>
            <div className={styles.cell}>
                <Dropdown show box={getBox("↑")} content={getContent()} invert />
            </div>
        </div>
    </div>
}
