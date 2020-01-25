function Data(x, y, radius, color, count, group, visited) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.count = count;
    this.group = group;
    this.visited = visited;
}

const radius = 5;
const defaultColor = '#ffffff';

const drawPoint = (context, point) => {
    context.beginPath();
    context.arc(point.x, point.y, radius, 0, Math.PI * 2, false);
    context.lineWidth = 1;
    context.strokeStyle = defaultColor;
    context.stroke();
    context.fillStyle = point.color;
    context.fill();
}

const drawCentroid = (context, point) => {
    let rot = Math.PI / 2 * 3;
    let x = point.x;
    let y = point.y;
    let step = Math.PI / 5;

    // context.strokeStyle = "#000";
    context.beginPath();
    context.moveTo(point.x, point.y - radius)
    for (i = 0; i < 5; i++) {
        x = point.x + Math.cos(rot) * radius;
        y = point.y + Math.sin(rot) * radius;
        context.lineTo(x, y)
        rot += step

        x = point.x + Math.cos(rot) * 2;
        y = point.y + Math.sin(rot) * 2;
        context.lineTo(x, y)
        rot += step
    }
    context.lineTo(point.x, point.y - radius);
    context.closePath();
    context.lineWidth = 1;
    context.strokeStyle = "#000000";
    context.stroke();
    context.fillStyle = point.color;
    context.fill();
}

const generateNewPoints = (canvas, dataCount, centroidArray) => {
    let context = canvas.getContext('2d');

    let dataArray = []
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < dataCount; i++) {
        dataArray.push(new Data(Math.random() * (canvas.width - radius * 2) + radius, Math.random() * (canvas.height - radius * 2) + radius, radius, defaultColor,0,false,false));
        drawPoint(context, dataArray[i]);
    }

    for (let i = 0; i < centroidArray.length; i++)
        drawCentroid(context, centroidArray[i]);

    return dataArray;
}

const generateSingleData = (canvas, x, y) => {
    let context = canvas.getContext('2d');
    let point = new Data(x, y, radius, defaultColor,0,false,false);
    drawPoint(context, point);

    return (point);
}

const getColor = () => {
    let color = '';
    let palette = '0123456789abcdef';
    while (color.length < 6)
        color += palette[Math.floor(Math.random() * palette.length)];

    return color;
}

const generateCentroid = (canvas, x, y) => {
    let context = canvas.getContext('2d');

    let color = '#' + getColor();
    let point = new Data(x, y, radius, color,0,false,false);
    drawCentroid(context, point);

    return point;
}

const clearBoard = (canvas) => {
    let context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
}

const displayPoints = (canvas, dataArray) => {
    let context = canvas.getContext('2d');

    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < dataArray.length; i++)
        drawPoint(context, dataArray[i])
}

const removePoint = (canvas, x, y, dataArray, centroidArray) => {
    let minDist = radius;
    let index = null;
    let isCentroid = null;
    let context = canvas.getContext('2d');

    for (let i = 0; i < dataArray.length; i++) {
        let dist = Math.sqrt(Math.pow(x - dataArray[i].x, 2) + Math.pow(y - dataArray[i].y, 2));
        if (dist <= minDist) {
            index = i;
            isCentroid = false;
            minDist = dist;
        }
    }

    for (let i = 0; i < centroidArray.length; i++) {
        let dist = Math.sqrt(Math.pow(x - centroidArray[i].x, 2) + Math.pow(y - centroidArray[i].y, 2));
        if (dist <= minDist) {
            index = i;
            isCentroid = true;
            minDist = dist;
        }
    }

    if (index !== null) {
        if (isCentroid)
            centroidArray.splice(index, 1);
        else dataArray.splice(index, 1);
    }


    clearBoard(canvas);
    for (let i = 0; i < dataArray.length; i++)
        drawPoint(context, dataArray[i]);

    for (let i = 0; i < centroidArray.length; i++)
        drawCentroid(context, centroidArray[i])
    // displayPoints(canvas,[...data, ...centroid])

    return {
        new_data: dataArray,
        new_centroid: centroidArray
    }
}

const resetBoard = (canvas, dataArray, centroidArray) => {
    let context = canvas.getContext('2d');

    // console.log('reset')

    context.clearRect(0, 0, canvas.width, canvas.height);

    dataArray.forEach(d => {
        d.color = defaultColor;
        d.count = 0;
        d.group = false;
        d.visited = false;
    });

    for (let i = 0; i < dataArray.length; i++)
        drawPoint(context, dataArray[i]);

    for (let i = 0; i < centroidArray.length; i++)
        drawCentroid(context, centroidArray[i])

}