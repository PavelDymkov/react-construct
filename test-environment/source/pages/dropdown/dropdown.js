import Dropdown from "ReactConstruct/dropdown";


export default function () {
    return <div>
        <div id="for-default-test">
            <Dropdown>
                <Dropdown.Element>
                    <div className="element">
                        element
                    </div>
                </Dropdown.Element>
                <Dropdown.Content>
                    <div className="content">
                        content
                    </div>
                </Dropdown.Content>
            </Dropdown>
        </div>

        <div id="for-show-test">
            <Dropdown show={true}>
                <Dropdown.Element>
                    <div className="element">
                        element
                    </div>
                </Dropdown.Element>
                <Dropdown.Content>
                    <div className="content">
                        content
                    </div>
                </Dropdown.Content>
            </Dropdown>
        </div>

        <div id="for-hide-test">
            <Dropdown show={false}>
                <Dropdown.Element>
                    <div className="element">
                        element
                    </div>
                </Dropdown.Element>
                <Dropdown.Content>
                    <div className="content">
                        content
                    </div>
                </Dropdown.Content>
            </Dropdown>
        </div>
    </div>
}
