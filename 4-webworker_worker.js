var self = this;

function vector3(x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
}
Object.assign(vector3.prototype, {
    length: function () {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    },
    clone: function () {

        return new this.constructor(this.x, this.y, this.z);

    },
    subVectors: function (a, b) {

        this.x = a.x - b.x;
        this.y = a.y - b.y;
        this.z = a.z - b.z;

        return this;

    },
    normalize: function () {

        return this.divideScalar(this.length() || 1);

    },
    divideScalar: function (scalar) {

        return this.multiplyScalar(1 / scalar);

    },
    multiplyScalar: function (scalar) {

        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;

        return this;

    },
    crossVectors: function (a, b) {

        var ax = a.x, ay = a.y, az = a.z;
        var bx = b.x, by = b.y, bz = b.z;

        this.x = ay * bz - az * by;
        this.y = az * bx - ax * bz;
        this.z = ax * by - ay * bx;

        return this;

    },
    dot: function (v) {

        return this.x * v.x + this.y * v.y + this.z * v.z;

    },

    isZero: function () {
        return this.x === 0 && this.y === 0 && this.z === 0;
    }
})

self.addEventListener('message', function (e) {
    var param = e.data;
    //var t = param;

    let direction = param.rayDirection;
    let origin = param.rayOrigin;
    let positions = param.linePositions

    let x1 = origin.x, y1 = origin.y, z1 = origin.z;
    let a1 = direction.x, b1 = direction.y, c1 = direction.z;

    let pointPositions = [];
    // var scales  =[];  
    let pointColors = [];

    for (let i = 0; i < positions.length; i += 6) {

        let p1 = new vector3(positions[i], positions[i + 1], positions[i + 2]);
        let p2 = new vector3(positions[i + 3], positions[i + 4], positions[i + 5]);
        let lineDirection = new vector3().subVectors(p1, p2).normalize();

        let normal = new vector3().crossVectors(direction, lineDirection);

        let a2 = lineDirection.x, b2 = lineDirection.y, c2 = lineDirection.z;
        let a3 = normal.x, b3 = normal.y, c3 = normal.z;
        let x3 = p1.x, y3 = p1.y, z3 = p1.z;
        let x5 = (a3 * x3 + b3 * b3 / a3 * x1 - b3 * (y1 - y3) + c3 * c3 / a3 * x1 - c3 * (z1 - z3)) / (a3 + b3 * b3 / a3 + c3 * c3 / a3);
        let y5 = b3 / a3 * (x5 - x1) + y1;
        let z5 = c3 / a3 * (x5 - x1) + z1;

        let x6 = (b1 / a1 * x5 - y5 - (b2 / a2) * x3 + y3) / (b1 / a1 - b2 / a2);
        let y6 = b1 / a1 * (x6 - x5) + y5;
        let z6 = c1 / a1 * (x6 - x5) + z5;

        let o = new vector3(x6, y6, z6);
        let op1 = new vector3().subVectors(p1, o);
        let op2 = new vector3().subVectors(p2, o);
        if (!op1.isZero() && !op2.isZero()) {
            let sameDirection = (op1.dot(op2)) / (op1.length() * op2.length()) > 0;//判断是否同向
            if (sameDirection) {
                if (op1.length() < op2.length()) {
                    x6 = p1.x;
                    y6 = p1.y;
                    z6 = p1.z;
                } else {
                    x6 = p2.x;
                    y6 = p2.y;
                    z6 = p2.z;
                }
            }
        }

        pointPositions.push(x6, y6, z6);
        pointColors.push(1, 0, 0);
    }

    let output = {
        'pointPositions': pointPositions,
        'pointColors': pointColors
    }
    self.postMessage(output);
}, false);