import mod from './moduleA.js';

export default function B() {
    console.log('B');
    mod();
    
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.001, 0.01);
    console.log(camera, $('body').height());

}

global.B = B;