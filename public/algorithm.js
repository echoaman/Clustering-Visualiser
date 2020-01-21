let start = Object; 
let end = Object; 
let percentage;
var timerId, animationId;
let position = Object;
let prevKmeans = {};
let currKmeans = {};
let context;
let dataFrameLimit;

const updateSections = (type) => {
    sections = document.getElementsByTagName('section');
    for(let i = 0; i < sections.length-1; i++){
        sections[i].style.pointerEvents = type;
    }
}

const k_means_getNewPosOnLine = () => {
    position.x = start.x * (1.0 - percentage) + end.x * percentage;
    position.y = start.y * (1.0 - percentage) + end.y * percentage;
}


const euclideanDist = (point, cen) => {
    return Math.sqrt(Math.pow(point.x - cen.x, 2) + Math.pow(point.y - cen.y, 2))
}

const k_means_updateColor = (point, centroidArray) => {
    let dist = Infinity;
    let index = null;
    for (let i = 0; i < centroidArray.length; i++) {
        let udist = euclideanDist(point, centroidArray[i]);
        if (udist < dist) {
            dist = udist;
            index = i;
        }
    }

    currKmeans[index].push(point);
    return centroidArray[index].color;
}

const k_means_newCentroidCoord = (dataArr) => {
    let x = 0;
    let y = 0;

    dataArr.forEach(d => {
        x += d.x;
        y += d.y;
    });

    x = x / dataArr.length;
    y = y / dataArr.length;

    let point = Object;
    point.x = x;
    point.y = y;
    return point;
}



const k_means_updateCentroid = (canvas,centroidArray, dataArray) => {
    let i = 0;
    percentage = 0.0;
    timerId = setInterval(() => {
        if(percentage <= 1){
            // console.log('within 1')
            percentage += 0.1;
            start = centroidArray[i];
            end = k_means_newCentroidCoord(currKmeans[i]);
            k_means_getNewPosOnLine();
            position.color = start.color;

            clearBoard(canvas);
            dataArray.forEach(d => {
                drawPoint(context,d);
            });

            drawCentroid(context,position);
            for(let j =0; j < centroidArray.length; j++){
                if(j !== i){
                    drawCentroid(context,centroidArray[j]);
                }
            }
        }
        if(percentage > 1.0){
            // console.log('post 1');
            centroidArray[i].x = end.x;
            centroidArray[i].y = end.y;
            i++;
            percentage = 0.0;
        }

        if(i == centroidArray.length){
            clearInterval(timerId)
            if (JSON.stringify(currKmeans) === JSON.stringify(prevKmeans)){
                alert('GG!');
                updateSections('auto');
                data = dataArray;
                centroid = centroidArray;

            }else{
                prevKmeans = currKmeans;
                k_means_clusterMeans(canvas, dataArray, centroidArray);
            }
        }
    }, 1000 / 60);
}

const k_means_clusterMeans = (canvas, dataArray, centroidArray) => {
    // prevKmeans = {};
    currKmeans = {}
    for(let j = 0; j < centroidArray.length; j++)
        currKmeans[j] = [];

    // console.log(currKmeans);

    let i = 0;
    timerId = setInterval(() => {
        dataArray[i].color = k_means_updateColor(dataArray[i], centroidArray);

        clearBoard(canvas);
        for (let j = 0; j < dataArray.length; j++)
            drawPoint(context, dataArray[j]);

        for (let j = 0; j < centroidArray.length; j++)
            drawCentroid(context, centroidArray[j])

        i++;

        //exit/completion condition
        if (i == dataArray.length) {
            clearInterval(timerId)
            k_means_updateCentroid(canvas,centroidArray, dataArray)
        }
    }, dataFrameLimit);
}

const kmeans = (canvas, dataArray, centroidArray) => {
    context = canvas.getContext('2d');

    for(let i = 0; i < centroidArray.length; i++){
        prevKmeans[i] = [];
        currKmeans[i] = [];
    }

    if(dataArray.length < 500){
        dataFrameLimit = 1000 / 144;
    }else dataFrameLimit = 1000 / 240;

    updateSections('none');
    resetBoard(canvas, dataArray, centroidArray);
    k_means_clusterMeans(canvas, data, centroidArray);

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


/*
 
kmeans edge case - empty cluster

 */