// document.write("<script language=javascript src='domElement.js'></script>");

class DomElement {
    constructor(value) {

        this.element = document.createElement('div');
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

init();

function init() {
    container = document.createElement('div');
    document.body.appendChild(container);

    var value = 'test';
    info = new DomElement(value);
    container.appendChild(info.element);

    document.addEventListener('click', onDocumnetClick, false);

    document.addEventListener()

}

function onDocumnetClick(event) {
    event.preventDefault();

    var posx = event.clientX;
    var posy = event.clientY;

    info.setPos(posx, posy);
}