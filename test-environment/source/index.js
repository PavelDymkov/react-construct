import Dropdown from "./pages/dropdown/dropdown.js";
import OutsideClick from "./pages/outside-click/outside-click.js";
import Button from "./pages/button/button.js";
import Scrollable from "./pages/scrollable/scrollable.js";


switch (location.hash) {
    case "#dropdown":
        ReactDOM.render(<Dropdown />, application);
        break;
    case "#outside-click":
        ReactDOM.render(<OutsideClick />, application);
        break;
    case "#button":
        ReactDOM.render(<Button />, application);
        break;
    case "#scrollable":
        ReactDOM.render(<Scrollable />, application);
        break;
}

/*
 TODO:
 Draggable/Droppable
 Overlay (Modal)
 Rotator
 Tabs
 Carousel
 Paginator
 Slider (ползунок) |___^__|
 Infinite Scroll
*/
