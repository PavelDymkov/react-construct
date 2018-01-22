import OutsideClick from "ReactConstruct/outside-click";


export default function () {
    return <div>
        <div id="click-inside-test">
            <OutsideClick onOutsideClick={() => { document.getElementById("output-message").textContent = "ERROR"; }}>
                <div className="element">
                    text
                </div>
            </OutsideClick>
            <div id="output-message"></div>
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
