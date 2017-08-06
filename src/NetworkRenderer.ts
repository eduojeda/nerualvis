import * as THREE from 'three';
import OrbitControls from 'orbit-controls-es6';
import Network from "./model/Network";

const PIXEL_SIZE = 1;
const NEURON_SIZE = 0.5;

export default class NetworkRenderer {
    private network: Network;
    private scene: THREE.Scene;
    private renderer: THREE.Renderer;
    private raycaster: THREE.Raycaster;
    private camera: THREE.Camera;
    private controls: THREE.OrbitControls;
    private mouse: THREE.Vector2;

    constructor(network: Network) {
        this.network = network;
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.raycaster = new THREE.Raycaster();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.controls = new OrbitControls(this.camera, this.getDomElement());
        this.mouse = new THREE.Vector2();

        this.init();
    }

    init() {
        this.camera.position.set(0, 0, 30);
        this.camera.lookAt(this.scene.position);

        this.renderer.setSize(window.innerWidth, window.innerHeight);

        // THREEx.WindowResize(renderer, camera);    // automatically resize renderer
        // THREEx.FullScreen.bindKey({charCode : 'm'.charCodeAt(0)});

        let light: THREE.Light = new THREE.PointLight(0xffffff);
        light.position.set(100, 250, 100);
        this.scene.add(light);
        this.scene.add(new THREE.AmbientLight(0x111111));

        this.drawAsSquare(this.scene, this.drawPixel, 400, 0);
        this.drawAsSquare(this.scene, this.drawNeuron, 400, 0);
        this.drawAsSquare(this.scene, this.drawNeuron, 25, -10);
        this.drawAsLine(this.scene, this.drawNeuron, 10, -20);
    }

    render() {
        window.requestAnimationFrame(this.render.bind(this));

        this.raycaster.setFromCamera(this.mouse, this.camera);

        let intersects: THREE.Intersection[] = this.raycaster.intersectObjects(this.scene.children);
        if (intersects.length > 0) this.controls.enabled = false;
        for (let i = 0; i < intersects.length; i++) {
            let mesh: THREE.Mesh = intersects[i].object as THREE.Mesh;
            let material: THREE.MeshLambertMaterial = mesh.material as THREE.MeshLambertMaterial;
            material.color.set(0xff0000);
        }

        this.renderer.render(this.scene, this.camera);
    };

    getDomElement(): HTMLCanvasElement {
        return this.renderer.domElement;
    }

    drawAsSquare(scene: THREE.Scene, callback: Function, count: number, z: number) {
        let side: number = Math.sqrt(count);
        let offset: number = -side * PIXEL_SIZE / 2; // todo PIXEL_SIZE -> VOXEL_SIZE?
        for (let i: number = 0 ; i < count ; i++) {
            let x: number = i % (side);
            let y: number = Math.floor(i / side);
            scene.add(callback(x * (NEURON_SIZE * 2) + offset, y * (NEURON_SIZE * 2) + offset, z));
        }
    }

    drawAsLine(scene: THREE.Scene, callback: Function, count: number, z: number) {
        let offset: number = -count * PIXEL_SIZE / 2; // todo PIXEL_SIZE -> VOXEL_SIZE?
        for (let x: number = 0 ; x < count ; x++) {
            scene.add(callback(x * (NEURON_SIZE * 2) + offset, 0, z));
        }
    }

    drawPixel(x: number, y: number, z: number) {
        let geometry: THREE.Geometry = new THREE.BoxGeometry(PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE / 10);
        let material: THREE.Material = new THREE.MeshLambertMaterial({color: 0xaaaaaa, transparent: true, opacity: 0.8});
        let pixel: THREE.Mesh = new THREE.Mesh(geometry, material);
        pixel.position.set(x, y, z);

        return pixel;
    }

    drawNeuron(x: number, y: number, z: number) {
        let geometry: THREE.Geometry = new THREE.SphereGeometry(NEURON_SIZE, 32, 32);
        let material: THREE.Material = new THREE.MeshLambertMaterial({color: 0x3333ff, transparent: true, opacity: 0.8});
        let neuron: THREE.Mesh = new THREE.Mesh(geometry, material);
        neuron.position.set(x, y, z);

        return neuron;
    }

    getControls(): THREE.OrbitControls {
        return this.controls;
    }

    setMouse(x: number, y: number) {
        this.mouse.x = x;
        this.mouse.y = y;
    }
}
