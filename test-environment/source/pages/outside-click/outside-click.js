import OutsideClick from "ReactConstruct/outside-click";


export default function () {
    return <div>
        <div id="click-inside-test">
            <OutsideClick onOutsideClick={console.log.bind(console, "click-inside")}>
                <div className="element">
                    text
                </div>
            </OutsideClick>
        </div>

        <div id="click-outside-test">
            <OutsideClick onOutsideClick={console.log.bind(console, "click-outside")}>
                <div className="element">
                    text
                </div>
            </OutsideClick>
            <div className="outside-element">
                outside
            </div>
        </div>
    </div>
}
