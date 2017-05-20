const INPUT_DIM = 20;
const PIXEL_SIZE = 0.1;

let mouse = new THREE.Vector2();

function main() {
    let scene = new THREE.Scene();
    let raycaster = new THREE.Raycaster();

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

    for (let x = 0 ; x < INPUT_DIM ; x++) {
        for (let y = 0 ; y < INPUT_DIM ; y++) {
            scene.add(generatePixel(x * (PIXEL_SIZE + 0.01), y * (PIXEL_SIZE + 0.01), 0));
        }
    }

    let update = () => {
        window.requestAnimationFrame(update);

        raycaster.setFromCamera(mouse, camera);

        let intersects = raycaster.intersectObjects(scene.children);
        for (let i = 0; i < intersects.length; i++) {
            intersects[i].object.material.color.set(0xff0000);
        }

        //controls.update(); // todo needed?
        renderer.render(scene, camera);
    };

    document.addEventListener('mousemove', mouseMove, false);
    update();
}

function mouseMove(event) {
    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function generatePixel(x, y, z) {
    let geometry = new THREE.BoxGeometry(0.1, 0.1, 0.01);
    let material = new THREE.MeshStandardMaterial({color: 0xaaaaaa});
    let pixel = new THREE.Mesh(geometry, material);
    pixel.position.set(x, y, z);

    return pixel;
}

window.onload = () => main();
