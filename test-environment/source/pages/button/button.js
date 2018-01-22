import Button from "ReactConstruct/button";


export default function () {
    return <div>
        <div id="release-test">
            <input className="input" />
            <Button onRelease={console.log.bind(console, "button-release")}>
                <div className="element">button</div>
            </Button>
        </div>
        <div id="non-focusable-test">
            <Button focusable={false}>
                <div className="element">button</div>
            </Button>
        </div>
        <div id="focus-in-out-test">
            <Button focusable={false}
                    onFocusIn={console.log.bind(console, "button-focus-in")}
                    onFocusOut={console.log.bind(console, "button-focus-out")}
                    onFocusChange={console.log.bind(console, "button-focus-change")}>
                <input className="element" />
            </Button>
            <input className="input" />
        </div>
        <div id="focus-test">
            <input className="input-1" />
            <Button onFocusIn={console.log.bind(console, "button-focus-in")}
                    onFocusOut={console.log.bind(console, "button-focus-out")}
                    onFocusChange={console.log.bind(console, "button-focus-change")}>
                <div className="element">button</div>
            </Button>
            <input className="input-2" />
        </div>
        <div id="key-test">
            <Button onKey={console.log.bind(console, "button-key")}>
                <div className="element">button</div>
            </Button>
        </div>
    </div>
}