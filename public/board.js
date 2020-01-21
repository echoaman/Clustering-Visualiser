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
const condiv = document.getElementsByClassName('controller');
const board_xcoor = document.getElementById('board-xcoor');
const board_ycoor = document.getElementById('board-ycoor');
const med_slider = document.getElementById('medoid-slider');
const med_text = document.getElementById('medoid-text');

canvas.width = 1500;
canvas.height = 500;
canvas.x = canvas.getBoundingClientRect().x;
canvas.y = canvas.getBoundingClientRect().y;

let data = []
let centroid = []
let selectedAlgo = null;

const updateMedoidSlider = (data_num) => {
    if (data_num == 0)
        data_num = 1;

    if (data_num >= 10)
        med_slider.max = 10;
    else {
        med_slider.max = data_num;
        med_slider.value = data_num;
        med_text.innerHTML = `K = ${data_num}`;
    }
}

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
            updateMedoidSlider(0);
            break;

        case 'visualize':
            if (data.length == 0) {
                alert('Add Data!');
            } else if (centroid.length > data.length) {
                alert('More Centroids than Data!');
                changeController('data');
            } else switch (selectedAlgo) {
                case 'kmeans':
                    // console.log(condiv);
                    if (centroid.length == 0) {
                        alert('Add Centroids!');
                        break;
                    }
                    kmeans(canvas, data, centroid);
                    break;

                case ('kmedoids'):
                    if (centroid.length == 0) {
                        alert('Add Centroids!');
                        break;
                    }
                    kmedoids(canvas, data, centroid);
                    break;

                case ('fcm'):
                    if (centroid.length == 0) {
                        alert('Add Centroids!');
                        break;
                    }
                    fcm(canvas, data, centroid);
                    break;

                case ('dbscan'):
                    dbscan(canvas, data, parseInt(eps_slider.value), parseInt(neighbour_slider.value));
                    break;

                default:
                    break;
            }
            break;
    }
}

canvas.addEventListener('mousemove', (event) => {
    let x = event.x - canvas.x;
    let y = event.y - canvas.y;
    board_xcoor.innerHTML = `X &cong; ${Math.floor(x)}`;
    board_ycoor.innerHTML = `Y &cong; ${Math.floor(y)}`;
})

eps_slider.addEventListener('change', () => {
    eps_text.innerHTML = `&epsilon; = ${eps_slider.value}`;
});

neighbour_slider.addEventListener('change', () => {
    neighbour_text.innerHTML = `N = ${neighbour_slider.value}`;
});

med_slider.addEventListener('change', () => {
    med_text.innerHTML = `K = ${med_slider.value}`;
})

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

    updateMedoidSlider(data_num);

    data = generateNewPoints(canvas, data_num, centroid);
});

random_input.addEventListener('keyup', (event) => {
    if (event.keyCode === 13) {
        random_btn.click();
    }
});

const updateParameterAndController = (arr) => {
    parameters[0].style.display = arr[0];
    parameters[2].style.display = arr[1];
    parameters[4].style.display = arr[2];
    controllers[3].innerHTML = arr[3];
    controllers[2].style.display = arr[4];
}

const changeAlgo = id => {
    for (let i = 0; i < algos.length; i++) {
        if (algos[i].id === id)
            algos[i].style.opacity = 1;
        else algos[i].style.opacity = 0.5;
    }

    selectedAlgo = id;

    switch (id) {
        case 'kmeans':
            updateParameterAndController(['none', 'none', 'none', 'Remove Data/Centroid', 'block']);
            break;
        case 'kmedoids':
            updateParameterAndController(['none', 'flex', 'none', 'Remove Data', 'none']);
            displayPoints(canvas, data);
            centroid = [];
            break;
        case 'fcm':
            updateParameterAndController(['none', 'none', 'none', 'Remove Data', 'none']);
            displayPoints(canvas, data);
            centroid = [];
            break;
        case 'dbscan':
            updateParameterAndController(['flex', 'none', 'flex', 'Remove Data', 'none']);
            displayPoints(canvas, data);
            centroid = [];
            break;
        default:
            break;
    }

    changeController('data');
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
    if (data_count + 1 > 1000) {
        alert('Number of data points cannot be more than 1000!');
    } else {
        data.push(generateSingleData(canvas, event.x - canvas.x, event.y - canvas.y))
        random_input.value = data.length;
        board_data.innerHTML = data.length;

        updateMedoidSlider(data.length);
    }
}

const addCentroid = event => {
    if (centroid.length >= 10) {
        alert('Max number of centroid = 10!');
    } else if (centroid.length + 1 <= data.length) {
        centroid.push(generateCentroid(canvas, event.x - canvas.x, event.y - canvas.y));
    } else {
        alert('More Centroids than Data!');
        changeController('data');
    }
}

const deleteData = event => {
    let { new_data, new_centroid } = removePoint(canvas, event.x - canvas.x, event.y - canvas.y, data, centroid);
    data = new_data;
    centroid = new_centroid;

    updateMedoidSlider(data.length);

    random_input.value = data.length;
    board_data.innerHTML = data.length;
}

init();
