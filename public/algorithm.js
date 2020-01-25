let start = Object;
let end = Object;
let percentage, dbscanCounter, dataFrameLimit, coreCount, context;
var timerId, animationId;
let position = Object;
let prevKmeans = {};
let currKmeans = {};
let dbscanCores = [];
let dbscanStack = [];

const dbscanPalette = [
    [242, 14, 2],
    [2, 198, 242],
    [20, 242, 22],
    [150, 214, 2],
    [134, 2, 242],
    [237, 100, 5],
    [233, 2, 237]
]

const updateSections = (type) => {
    sections = document.getElementsByTagName('section');
    for (let i = 0; i < sections.length - 1; i++) {
        sections[i].style.pointerEvents = type;
    }
}

const k_means_getNewPosOnLine = () => {
    position.x = start.x * (1.0 - percentage) + end.x * percentage;
    position.y = start.y * (1.0 - percentage) + end.y * percentage;
}

const euclideanDist = (pA, pB) => {
    return Math.sqrt(Math.pow(pA.x - pB.x, 2) + Math.pow(pA.y - pB.y, 2))
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

const k_means_newCentroidCoord = (dataArray) => {
    let x = 0;
    let y = 0;

    dataArray.forEach(d => {
        x += d.x;
        y += d.y;
    });

    x = x / dataArray.length;
    y = y / dataArray.length;

    let point = Object;
    point.x = x;
    point.y = y;
    return point;
}

const k_means_updateCentroid = (canvas, centroidArray, dataArray) => {
    let i = 0;
    percentage = 0.0;
    timerId = setInterval(() => {
        if (percentage <= 1) {
            // console.log('within 1')
            percentage += 0.1;
            start = centroidArray[i];
            end = k_means_newCentroidCoord(currKmeans[i]);
            k_means_getNewPosOnLine();
            position.color = start.color;

            clearBoard(canvas);
            dataArray.forEach(d => {
                drawPoint(context, d);
            });

            drawCentroid(context, position);
            for (let j = 0; j < centroidArray.length; j++) {
                if (j !== i) {
                    drawCentroid(context, centroidArray[j]);
                }
            }
        }
        if (percentage > 1.0) {
            // console.log('post 1');
            centroidArray[i].x = end.x;
            centroidArray[i].y = end.y;
            i++;
            percentage = 0.0;
        }

        if (i == centroidArray.length) {
            clearInterval(timerId)
            if (JSON.stringify(currKmeans) === JSON.stringify(prevKmeans)) {
                alert('GG!');
                updateSections('auto');
                data = dataArray;
                centroid = centroidArray;

            } else {
                prevKmeans = currKmeans;
                k_means_clusterMeans(canvas, dataArray, centroidArray);
            }
        }
    }, 1000 / 60);
}

const k_means_clusterMeans = (canvas, dataArray, centroidArray) => {
    // prevKmeans = {};
    currKmeans = {}
    for (let j = 0; j < centroidArray.length; j++)
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
            k_means_updateCentroid(canvas, centroidArray, dataArray)
        }
    }, dataFrameLimit);
}

const kmeans = (canvas, dataArray, centroidArray) => {
    context = canvas.getContext('2d');

    for (let i = 0; i < centroidArray.length; i++) {
        prevKmeans[i] = [];
        currKmeans[i] = [];
    }

    if (dataArray.length < 500) {
        dataFrameLimit = 1000 / 144;
    } else dataFrameLimit = 1000 / 240;

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

const RGBAToHexA = (r, g, b, a) => {
    r = r.toString(16);
    g = g.toString(16);
    b = b.toString(16);

    if (r.length == 1)
        r = "0" + r;
    if (g.length == 1)
        g = "0" + g;
    if (b.length == 1)
        b = "0" + b;

    if (a === 0)
        return '#' + r + g + b;

    a = Math.round(a * 255).toString(16);
    if (a.length == 1)
        a = "0" + a;

    return "#" + r + g + b + a;
}

const hexToDec = (color) => {
    console.log(typeof color);
    let r = parseInt(color.substring(1, 3), 16);
    let g = parseInt(color.substring(3, 5), 16);
    let b = parseInt(color.substring(5, 7), 16);

    console.log(r);
    console.log(g);
    console.log(b);
    return RGBAToHexA(r, g, b, 0.2)
}

const getUnvisitedCore = () => {
    for (let i = 0; i < dbscanCores.length; i++)
        if (!dbscanCores[i].visited) {
            dbscanCores[i].visited = true;
            return i;
        }

    return null;
}

const getNeighbouringCluster = (eps) => {
    let currClusterIndex = dbscanStack[dbscanStack.length - 1];
    let pA = dbscanCores[currClusterIndex];
    // console.log(pA)
    // console.log(currCluster);

    for (let i = 0; i < dbscanCores.length; i++) {
        if (i !== currClusterIndex && !dbscanCores[i].visited) {
            let pB = dbscanCores[i];
            let dist = euclideanDist(pA, pB);
            if (dist <= 2 * eps) {
                pB.visited = true;
                return i;
            }
        }
    }

    return null;
}

const formDBSCANClusters = (dataArray, eps) => {
    timerId = setInterval(() => {
        if (coreCount !== 0) {
            if (dbscanStack.length === 0) {
                let index = getUnvisitedCore();
                dbscanStack.push(index);
                coreCount--;
                dbscanCounter++;
                let point = dbscanCores[index];
                let palette = dbscanPalette[dbscanCounter % 7];
                point.color = RGBAToHexA(palette[0], palette[1], palette[2], 0);
                context.beginPath();
                context.fillStyle = RGBAToHexA(palette[0], palette[1], palette[2], 0.2);
                context.arc(point.x, point.y, point.radius + eps, 0, Math.PI * 2, false);
                context.fill();

                clearInterval(timerId);
                formDBSCANClusters(dataArray, eps);
                return;
            } else {
                let index = getNeighbouringCluster(eps);
                if (index !== null) {
                    dbscanStack.push(index);
                    coreCount--;
                    let point = dbscanCores[index];
                    let palette = dbscanPalette[dbscanCounter % 7];
                    point.color = RGBAToHexA(palette[0], palette[1], palette[2], 0);
                    context.beginPath();
                    context.fillStyle = RGBAToHexA(palette[0], palette[1], palette[2], 0.2);
                    context.arc(point.x, point.y, point.radius + eps, 0, Math.PI * 2, false);
                    context.fill();

                    clearInterval(timerId);
                    formDBSCANClusters(dataArray, eps);
                    return;

                } else {
                    dbscanStack.pop();
                    clearInterval(timerId);
                    formDBSCANClusters(dataArray, eps);
                    return;
                }
            }
        } else {
            clearInterval(timerId);

            context.clearRect(0, 0, canvas.width, canvas.height);
            for (let a = 0; a < dataArray.length; a++) {
                if (!dataArray[a].visited)
                    drawPoint(context, dataArray[a]);
            }

            // console.log(dbscanCores);

            for (let a = 0; a < dbscanCores.length; a++) {
                context.beginPath();
                context.fillStyle = hexToDec(dbscanCores[a].color);
                context.arc(dbscanCores[a].x, dbscanCores[a].y, dbscanCores[a].radius + eps, 0, Math.PI * 2, false);
                context.fill();
            }
            for (let a = 0; a < dbscanCores.length; a++) {
                drawCentroid(context, dbscanCores[a]);
            }
            updateSections('auto');
            data = dataArray;
            centroid = [];
            alert('GG!');
        }
    }, 1000 / 30);
}

const dbscan = (canvas, dataArray, eps, neighbours) => {
    resetBoard(canvas, dataArray, []);
    context = canvas.getContext('2d');
    dbscanCores = [];
    dbscanCounter = -1;
    updateSections('none');

    for (let i = 0; i < dataArray.length - 1; i++) {
        for (let j = i + 1; j < dataArray.length; j++) {
            if (euclideanDist(dataArray[i], dataArray[j]) <= eps) {
                dataArray[i].count++;
                dataArray[j].count++;

                if (dataArray[i].count >= neighbours - 1) {
                    if (!dataArray[i].group) {
                        dataArray[i].group = true;
                        dbscanCores.push(dataArray[i]);
                    }
                }

                if (dataArray[j].count >= neighbours - 1) {
                    if (!dataArray[j].group) {
                        dataArray[j].group = true;
                        dbscanCores.push(dataArray[j]);
                    }
                }
            }
        }
    }

    coreCount = dbscanCores.length;
    dbscanCounter = -1;

    if (coreCount !== 0)
        formDBSCANClusters(dataArray, eps);
    else {
        updateSections('auto');
        data = dataArray;
        centroid = [];
        alert('GG!');
    }

}


/*

kmeans edge case - empty cluster

 */