function Data(x, y, radius, color, centroid){
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

const generateNewPoints = (canvas, dataCount, centroid) => {
    let context = canvas.getContext('2d');

    let dataArray = []
    context.clearRect(0,0,canvas.width,canvas.height);
    for(let i = 0; i < dataCount; i++){
        dataArray.push(new Data(Math.random()*(canvas.width-radius*2)+radius,Math.random()*(canvas.height-radius*2)+radius, radius, '#000000', false));
        drawPoint(context, dataArray[i]);
    }

    for(let i = 0; i<centroid.length; i++)
        drawPoint(context, centroid[i]);
    
    return dataArray;
}


const clearBoard = (canvas) => {
    let context = canvas.getContext('2d');
    context.clearRect(0,0,canvas.width,canvas.height);
}

