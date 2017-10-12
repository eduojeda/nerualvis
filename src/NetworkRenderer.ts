import * as THREE from 'three';
import OrbitControls from 'orbit-controls-es6';
import Network from "./model/Network";
import Neuron from "./model/Neuron";
import {Link} from "./model/Link";

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
    }

    public initScene() {
        this.camera.position.set(0, 0, 30);
        this.camera.lookAt(this.scene.position);

        this.renderer.setSize(window.innerWidth, window.innerHeight);

        // THREEx.WindowResize(renderer, camera);    // automatically resize renderer
        // THREEx.FullScreen.bindKey({charCode : 'm'.charCodeAt(0)});

        let light: THREE.Light = new THREE.PointLight(0xffffff);
        light.position.set(100, 250, 100);
        this.scene.add(light);
        this.scene.add(new THREE.AmbientLight(0x111111));

        this.generateMeshes();
    }

    public render() {
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

    public getDomElement(): HTMLCanvasElement {
        return this.renderer.domElement;
    }

    public getControls(): THREE.OrbitControls {
        return this.controls;
    }

    public setMouse(x: number, y: number) {
        this.mouse.x = x;
        this.mouse.y = y;
    }

    private generateMeshes() {
        this.createPixelMatrix(this.network.getInputLayer().length, 0);

        this.arrangeLayerAsMatrix(this.network.getInputLayer(), -2);

        for (const layer of this.network.getHiddenLayers()) {
            this.arrangeLayerAsMatrix(layer, -10)
        }

        this.arrangeLayerAsLine(this.network.getOutputLayer(), -20);

        this.drawLinks(this.network.getLinks());
    }

    private drawLinks(links: Link[]) {
        links.map(link => {
            if (link.getWeight() < 0.5) {
                return;
            }

            let line: THREE.Line = NetworkRenderer.buildLink(
                link.getSource().getMesh().getWorldPosition(),
                link.getTarget().getMesh().getWorldPosition(),
            );

            this.scene.add(line);
        });
    }

    private arrangeLayerAsMatrix(layer: Neuron[], z: number) {
        const count: number = layer.length;
        const side: number = Math.sqrt(count);
        const offset: number = -side * PIXEL_SIZE / 2;

        for (let i: number = 0 ; i < count ; i++) {
            let x: number = i % (side);
            let y: number = Math.floor(i / side);
            layer[i].setMesh(NetworkRenderer.buildNeuronMesh(x * (NEURON_SIZE * 2) + offset, y * (NEURON_SIZE * 2) + offset, z));

            this.scene.add(layer[i].getMesh());
        }
    }

    private arrangeLayerAsLine(layer: Neuron[], z: number) {
        const count: number = layer.length;
        const offset: number = -count * PIXEL_SIZE / 2;

        for (let x: number = 0 ; x < count ; x++) {
            layer[x].setMesh(NetworkRenderer.buildNeuronMesh(x * (NEURON_SIZE * 2) + offset, 0, z));

            this.scene.add(layer[x].getMesh());
        }
    }

    private createPixelMatrix(count:number, z: number) {
        const side: number = Math.sqrt(count);
        const offset: number = -side * PIXEL_SIZE / 2;

        for (let i: number = 0 ; i < count ; i++) {
            let x: number = i % (side);
            let y: number = Math.floor(i / side);
            this.scene.add(NetworkRenderer.buildPixelMesh(x * PIXEL_SIZE + offset, y * PIXEL_SIZE + offset, z));
        }
    }

    private static buildLink(from: THREE.Vector3, to: THREE.Vector3): THREE.Line {
        let geometry = new THREE.Geometry();
        geometry.vertices.push(from);
        geometry.vertices.push(to);
        let material = new THREE.LineBasicMaterial({color: 0x00ff00});

        return new THREE.Line(geometry, material);
    }

    private static buildPixelMesh(x: number, y: number, z: number): THREE.Mesh {
        let geometry: THREE.Geometry = new THREE.BoxGeometry(PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE / 10);
        let material: THREE.Material = new THREE.MeshLambertMaterial({color: 0xaaaaaa, transparent: true, opacity: 0.8});
        let pixel: THREE.Mesh = new THREE.Mesh(geometry, material);
        pixel.position.set(x, y, z);

        return pixel;
    }

    private static buildNeuronMesh(x: number, y: number, z: number): THREE.Mesh {
        let geometry: THREE.Geometry = new THREE.SphereGeometry(NEURON_SIZE, 32, 32);
        let material: THREE.Material = new THREE.MeshLambertMaterial({color: 0x3333ff, transparent: true, opacity: 0.8});
        let neuron: THREE.Mesh = new THREE.Mesh(geometry, material);
        neuron.position.set(x, y, z);

        return neuron;
    }
}
