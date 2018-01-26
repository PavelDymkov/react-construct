import Dropdown from "./pages/dropdown/dropdown.js";
import OutsideClick from "./pages/outside-click/outside-click.js";
import Button from "./pages/button/button.js";
import Scrollable from "./pages/scrollable/scrollable.js";
import Slider from "./pages/slider/slider.js";
import Modal from "./pages/modal/modal.js";


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
    case "#slider":
        ReactDOM.render(<Slider />, application);
        break;
    case "#modal":
        ReactDOM.render(<Modal />, application);
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
