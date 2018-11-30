class DomElement {
    constructor(value) {

        this.element = document.createElement('div');
        // this.element.id = id;
        this.element.style.width = '50px';
        this.element.style.position = 'absolute';
        this.element.style.color = '#00ff00';
        this.element.innerHTML = value;
    }

    setPos(posx, posy) {

        this.element.style.left = posx + 'px';
        this.element.style.top = posy + 'px';
    }
}

var container, info;
var lastMouse = new THREE.Vector2();
// var index;
var indexList = new Array();

init();

function init() {

    // index = 0;
    container = document.createElement('div');
    document.body.appendChild(container);

    var value = 'test';
    info = new DomElement(value);
    container.appendChild(info.element);

    document.addEventListener('mousedown', onDocumnetMouseDown, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);

    // document.addEventListener()

}

function onDocumnetMouseDown(event) {
    event.preventDefault();

    lastMouse.x = event.clientX;
    lastMouse.y = event.clientY;

}

function onDocumentMouseUp(event) {
    event.preventDefault();

    if (lastMouse.x === event.clientX && lastMouse.y === event.clientY) {

        if (event.ctrlKey) {

            // index++;

            var newInfo = new DomElement('value');
            container.appendChild(newInfo.element);
            newInfo.setPos(event.clientX, event.clientY);

            indexList.push(newInfo.element);

        }
        else {

            // for (let i = 0; i < indexList.length; i++) {
            //     element = indexList[i];
            //     if (element!=null){
            //         element.parentNode.removeChild(element);
            //     }
            // }            

            while (indexList.length > 0) {
                var element = indexList.shift();
                if (element != null) {
                    element.parentNode.removeChild(element);
                }
            }

            info.setPos(event.clientX, event.clientY);

        }
    }
}