class domElement {
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