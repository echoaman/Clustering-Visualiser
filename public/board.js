const canvas = document.querySelector('canvas');
const algos = document.getElementsByClassName('algo-btn');
const controllers = document.getElementsByClassName('controller-btn');
const parameters = document.getElementsByClassName('parameter-container');
const eps_slider = document.getElementById('eps-slider');
const eps_text = document.getElementById('eps-text');
const neighbour_slider = document.getElementById('neighbour-slider');
const neighbour_text = document.getElementById('neighbour-text');
const random_input = document.getElementById('randomize-num');
const random_btn = document.getElementById('randomize-btn');
const board_data = document.getElementById('board-data');

canvas.width = 1500;
canvas.height = 500;
canvas.x = canvas.getBoundingClientRect().x;
canvas.y = canvas.getBoundingClientRect().y;

let data = []
let centroid = []
let selectedAlgo = null;

const changeEvent = id => {
    canvas.removeEventListener('click', addData, false);
    canvas.removeEventListener('click', addCentroid, false);
    canvas.removeEventListener('click', deleteData, false);

    switch (id) {
        case 'data':
            canvas.addEventListener('click', addData, false);
            break;

        case 'centroid':
            canvas.addEventListener('click', addCentroid, false);
            break;

        case 'remove':
            canvas.addEventListener('click', deleteData, false);
            break;

        case 'clear':
            clearBoard(canvas);
            data = []
            centroid = []
            random_input.value = 0;
            board_data.innerHTML = 0;
            changeController('data');
            break;

        case 'visualize':
            switch (selectedAlgo) {
                case 'kmeans':
                    kmeans(canvas,data,centroid);
                    break;

                case('kmedoids'):
                    kmedoids(canvas,data,centroid);
                    break;

                case('fcm'):
                    fcm(canvas,data,centroid);
                    break;

                case('dbscan'):
                    dbscan(canvas,data,parseInt(eps_slider.value), parseInt(neighbour_slider.value));
                    break;
            
                default:
                    break;
            }
            break;
    }
}

eps_slider.addEventListener('change', () => {
    eps_text.innerHTML = `&epsilon; = ${eps_slider.value}`
});

neighbour_slider.addEventListener('change', () => {
    neighbour_text.innerHTML = `N = ${neighbour_slider.value}`
});

random_btn.addEventListener('click', () => {
    data_num = parseInt(random_input.value);
    if (data_num < 0) {
        alert('Number of data points cannot be negative!');
        data_num = 0;
    } else if (data_num > 1000) {
        alert('Number of data points cannot be more than 1000!');
        data_num = 1000;
    } else if (isNaN(data_num)) {
        alert('Please enter a number!');
        data_num = 0;
    }

    board_data.innerHTML = data_num;
    random_input.value = data_num;
    
    data = generateNewPoints(canvas,data_num,centroid);
});

random_input.addEventListener('keyup', (event) => {
    if (event.keyCode === 13) {
        random_btn.click();
    }
});

const changeAlgo = id => {
    for (let i = 0; i < algos.length; i++) {
        if (algos[i].id === id)
            algos[i].style.opacity = 1;
        else algos[i].style.opacity = 0.5;
    }

    selectedAlgo = id;

    if (id === 'dbscan') {
        parameters[0].style.display = 'flex';
        parameters[2].style.display = 'flex';
        controllers[3].innerHTML = 'Remove Data';
        controllers[2].style.display = 'none';
        displayPoints(canvas,data);
        centroid = [];
    } else {
        parameters[0].style.display = 'none';
        parameters[2].style.display = 'none';
        controllers[3].innerHTML = 'Remove Data/Centroid';
        controllers[2].style.display = 'block';
    }
}

const changeController = id => {
    for (let i = 0; i < controllers.length; i++) {
        if (controllers[i].id === id)
            controllers[i].style.opacity = 1;
        else controllers[i].style.opacity = 0.5;
    }

    changeEvent(id);
}

const init = () => {
    for (let i = 0; i < algos.length; i++) {
        algos[i].addEventListener('click', () => {
            changeAlgo(algos[i].id);
        });
    }

    for (let i = 0; i < controllers.length; i++) {
        controllers[i].addEventListener('click', () => {
            changeController(controllers[i].id);
        });
    }

    changeAlgo('kmeans');
    changeController('data');
    neighbour_slider.value = 5;
    eps_slider.value = 5;
    random_input.value = 100;

    random_btn.click();
}

const addData = event => {
    data_count = parseInt(board_data.innerHTML);
    if(data_count + 1 > 1000){
        alert('Number of data points cannot be more than 1000!');
    }else{
        data.push(generateSingleData(canvas, event.x - canvas.x, event.y - canvas.y))
        random_input.value = data.length;
        board_data.innerHTML = data.length;
    }
}

const addCentroid = event => {
    if(centroid.length >= 10){
        alert('Max number of centroid = 10!');
    }else{
        centroid.push(generateCentroid(canvas, event.x - canvas.x, event.y - canvas.y));
    }
}

const deleteData = event => {
    let { new_data, new_centroid } = removePoint(canvas,event.x - canvas.x, event.y - canvas.y, data, centroid);
    data = new_data;
    centroid = new_centroid;

    random_input.value = data.length;
    board_data.innerHTML = data.length;
}

init();
