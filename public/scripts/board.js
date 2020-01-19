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

let data = []
let centroid = []

const changeEvent = id => {
    canvas.removeEventListener('click', generateSingleData, false);
    canvas.removeEventListener('click', generateCentroid, false);
    canvas.removeEventListener('click', deleteData, false);

    switch (id) {
        case 'data':
            canvas.addEventListener('click', generateSingleData, false);
            break;

        case 'centroid':
            canvas.addEventListener('click', generateCentroid, false);
            break;

        case 'remove':
            canvas.addEventListener('click', deleteData, false);
            break;

        case 'clear':
            break;

        case 'visualize':
            break;
    }
}

const changeAlgo = id => {
    for (let i = 0; i < algos.length; i++) {
        if (algos[i].id === id)
            algos[i].style.opacity = 1;
        else algos[i].style.opacity = 0.5;
    }
    
    if(id === 'dbscan'){
        parameters[0].style.display = 'flex';
        parameters[2].style.display = 'flex';
        controllers[3].innerHTML = 'Remove Data';
        controllers[2].style.display = 'none';
    }else{
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
            changeController(controllers[i].id)
        });
    }

    changeAlgo('kmeans');
    changeController('data');
    neighbour_slider.value = 5;
    eps_slider.value = 5;
    random_input.value = 100;
}

const generateSingleData = event => {
    alert('single');
}

const generateCentroid = event => {
    alert('centroid');
}

const deleteData = event => {
    alert('delete');
}

const generateRandomData = num => {
    alert(num);
}

//Events

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
        random_input.value = 0;
    } else if (data_num > 1000) {
        alert('Number of data points cannot be more than 1000!');
        data_num = 1000;
        random_input.value = 1000;
    } else if (isNaN(data_num)) {
        alert('Please enter a number!');
        data_num = 0;
        random_input.value = 0;
    }
    
    board_data.innerHTML = data_num;
    generateRandomData(data_num)
});

random_input.addEventListener('keyup', (event) => {
    if (event.keyCode === 13) {
        random_btn.click();
    }
})


init();