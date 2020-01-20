function Data(x, y, radius, color, centroid) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.isCentroid = centroid;
}

const radius = 5;

const drawPoint = (context, point) => {
    context.beginPath();
    context.arc(point.x, point.y, radius, 0, Math.PI * 2, false);
    context.fillStyle = point.color;
    context.fill();
}

const drawCentroid = (context, centroid) => {
    let rot = Math.PI / 2 * 3;
    let x = centroid.x;
    let y = centroid.y;
    let step = Math.PI / 5;

    // context.strokeStyle = "#000";
    context.beginPath();
    context.moveTo(centroid.x, centroid.y - radius)
    for (i = 0; i < 5; i++) {
        x = centroid.x + Math.cos(rot) * radius;
        y = centroid.y + Math.sin(rot) * radius;
        context.lineTo(x, y)
        rot += step

        x = centroid.x + Math.cos(rot) * 2;
        y = centroid.y + Math.sin(rot) * 2;
        context.lineTo(x, y)
        rot += step
    }
    context.lineTo(centroid.x, centroid.y - radius);
    context.closePath();
    context.lineWidth = 1;
    context.strokeStyle = centroid.color;
    context.stroke();
    context.fillStyle = centroid.color;
    context.fill();
}

const generateNewPoints = (canvas, dataCount, centroid) => {
    let context = canvas.getContext('2d');

    let dataArray = []
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < dataCount; i++) {
        dataArray.push(new Data(Math.random() * (canvas.width - radius * 2) + radius, Math.random() * (canvas.height - radius * 2) + radius, radius, '#000000', false));
        drawPoint(context, dataArray[i]);
    }

    for (let i = 0; i < centroid.length; i++)
        drawCentroid(context, centroid[i]);

    return dataArray;
}

const generateSingleData = (canvas, x, y) => {
    let context = canvas.getContext('2d');
    let point = new Data(x, y, radius, '#000000', false);
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
    let point = new Data(x, y, radius, color, true);
    drawCentroid(context, point);

    return point;
}

const clearBoard = (canvas) => {
    let context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
}

const displayPoints = (canvas, data) => {
    let context = canvas.getContext('2d');

    context.clearRect(0,0,canvas.width,canvas.height);
    for(let i = 0; i<data.length; i++)
        drawPoint(context,data[i])
}

const removePoint = (canvas, x, y, data, centroid) => {
    let minDist = radius;
    let index = null;
    let isCentroid = null;
    let context = canvas.getContext('2d');

    for(let i = 0; i<data.length; i++){
        let dist = Math.sqrt(Math.pow(x - data[i].x,2) + Math.pow(y - data[i].y,2));
        if(dist <= minDist){
            index = i;
            isCentroid = false;
            minDist = dist;
        }
    }

    for(let i = 0; i<centroid.length; i++){
        let dist = Math.sqrt(Math.pow(x - centroid[i].x,2) + Math.pow(y - centroid[i].y,2));
        if(dist <= minDist){
            index = i;
            isCentroid = true;
            minDist = dist;
        }
    }

    if(index !== null){
        if(isCentroid)
            centroid.splice(index,1);
        else data.splice(index,1);
    }


    clearBoard(canvas);
    for(let i = 0; i<data.length; i++)
        drawPoint(context,data[i]);

    for(let i = 0;i<centroid.length; i++)
        drawCentroid(context,centroid[i])
    // displayPoints(canvas,[...data, ...centroid])

    return {
        new_data: data,
        new_centroid: centroid
    }
}