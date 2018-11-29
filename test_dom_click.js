// document.write("<script language=javascript src='domElement.js'></script>");

class DomElement {
    constructor(value, id) {

        this.element = document.createElement('div');
        this.element.id = id;
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
var index;

init();

function init() {

    index = 0;
    container = document.createElement('div');
    document.body.appendChild(container);

    var value = 'test';
    info = new DomElement(value, index);
    container.appendChild(info.element);

    document.addEventListener('mousedown', onDocumnetMouseDown, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);

    document.addEventListener()

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

            index++;

            var newInfo = new DomElement('value', index);
            container.appendChild(newInfo.element);
            newInfo.setPos(event.clientX, event.clientY);

        }
        else {

            for(let i=1;i<=index;i++){

                var delDiv=document.getElementById(i);
                if(delDiv!=null){
                    delDiv.parentNode.removeChild(delDiv);
                }
            }

            info.setPos(event.clientX, event.clientY);

        }
    }
}