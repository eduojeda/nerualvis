const INPUT_DIM = 64;

function main() {
    let scene = new THREE.Scene();

    let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 5);
    camera.lookAt(scene.position);

    let renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    // THREEx.WindowResize(renderer, camera);    // automatically resize renderer
    // THREEx.FullScreen.bindKey({charCode : 'm'.charCodeAt(0)});

    let light = new THREE.PointLight(0xffffff);
    light.position.set(100, 250, 100);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x111111));

    let controls = new THREE.OrbitControls(camera, renderer.domElement);

    for (let x = 0 ; x < 7 ; x++) {
        for (let y = 0 ; y < 5 ; y++) {
            scene.add(generatePixel(0 + x * 1.1, 0 + y * 1.1, 0));
        }
    }
    // for (let i = 0 ; i < INPUT_DIM * INPUT_DIM ; i++) {
    //     let x = i % INPUT_DIM;
    //     let y = i / INPUT_DIM;
    //
    //
    // }

    let update = () => {
        window.requestAnimationFrame(update);

        controls.update();
        renderer.render(scene, camera);
    };

    update();
}

function generatePixel(x, y, z) {
    let geometry = new THREE.BoxGeometry(1, 1, 0.1);
    let material = new THREE.MeshStandardMaterial({color: 0xaaaaaa});
    let pixel = new THREE.Mesh(geometry, material);
    pixel.position.set(x, y, z);

    return pixel;
}

window.onload = () => main();
