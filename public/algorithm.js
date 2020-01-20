let start, end, percentage, context, animating;
var timer;

// const getNewPosOnLine = () => {
//     position.x = start.x * (1.0 - percentage) + end.x * percentage;
//     position.y = start.y * (1.0 - percentage) + end.y * percentage;
// }

// const drawLine = () => {
//     getNewPosOnLine();
//     percentage += 0.1;
//     context.beginPath();
//     context.moveTo(start.x, start.y);
//     context.lineTo(position.x, position.y);
//     context.strokeStyle = start.color;
//     context.stroke();
//     console.log('draw')
//     if (percentage > 1) {
//         clearInterval(timer);
//         animating = false;
//     }
// }

const euclideanDist = (point, cen) => {
    return Math.sqrt(Math.pow(point.x - cen.x, 2) + Math.pow(point.y - cen.y, 2))
}

const updateColor = (point, centroidArray) => {
    let dist = Infinity;
    let index = null;
    for (let i = 0; i < centroidArray.length; i++) {
        let udist = euclideanDist(point, centroidArray[i]);
        if (udist < dist) {
            dist = udist;
            index = i;
        }
    }

    return centroidArray[index].color;
}

const clusterMeans = (canvas, dataArray, centroidArray) => {
    let context = canvas.getContext('2d');

    let i = 0;
    timer = setInterval(() => {
        dataArray[i].color = updateColor(dataArray[i], centroidArray);

        clearBoard(canvas);
        for (let j = 0; j < dataArray.length; j++)
            drawPoint(context, dataArray[j]);

        for (let j = 0; j < centroidArray.length; j++)
            drawCentroid(context, centroidArray[j])
        i++;
        if (i == dataArray.length) {
            clearInterval(timer)
        }
    }, 1000 / 60);
}

const kmeans = (canvas, dataArray, centroidArray) => {
    resetBoard(canvas, dataArray, centroidArray);
    clusterMeans(canvas, data, centroidArray);
}


const kmedoids = (canvas, dataArray, centroidArray) => {
    resetBoard(canvas, dataArray, centroidArray);
    console.log('kmed')
    console.log(dataArray);
    console.log(centroidArray);
}

const fcm = (canvas, dataArray, centroidArray) => {
    resetBoard(canvas, dataArray, centroidArray);
    console.log('fcm');
    console.log(dataArray);
    console.log(centroidArray);
}

const dbscan = (canvas, dataArray, eps, N) => {
    resetBoard(canvas, dataArray, []);
    console.log('dbscan')
    console.log(dataArray);
    console.log(eps);
    console.log(N);
}