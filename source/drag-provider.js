export default class DragProvider {
    constructor(options) {
        this.options = options;

        this.startX = null;
        this.startY = null;

        this.interactionStart = this.interactionStart.bind(this);

        options.element.addEventListener("mousedown", this.interactionStart, false);
    }

    dispose() {
        options.element.removeEventListener("mousedown", this.interactionStart, false);
    }

    interactionStart(event) {
        cancel(event);

        let initialData = {
            startX: event.pageX,
            startY: event.pageY
        };

        const { onStart } = this.options;

        if (typeof onStart == "function") {
            Object.assign(initialData, onStart());
        }

        const onMove = onMoveHandler.bind(this, initialData);
        const onEnd = function (event) {
            cancel(event);

            document.removeEventListener("mousemove", onMove, false);
            document.removeEventListener("mouseup", onEnd, false);
        };

        document.addEventListener("mousemove", onMove, false);
        document.addEventListener("mouseup", onEnd, false);
        document.addEventListener("click", preventClick, true);
    }
}

function onMoveHandler(initialData, event) {
    cancel(event);

    const { onMove } = this.options;

    if (typeof onMove == "function") {
        let eventData = {
            x: event.pageX, y: event.pageY,
            deltaX: event.pageX - initialData.startX, deltaY: event.pageY - initialData.startY,
            ...initialData
        };

        onMove(eventData);
    }
}

function cancel(event) {
    event.preventDefault();
    event.stopPropagation();
}

function preventClick(event) {
    event.stopPropagation();

    document.removeEventListener("click", preventClick, true);
}
