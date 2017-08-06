import Network from "./model/Network";
import {Sigmoid} from "./model/activations/Sigmoid";
import NetworkRenderer from "./NetworkRenderer";

function main() {
    let isDrawing: boolean;

    let network = new Network([400, 20, 10], Sigmoid);
    let renderer = new NetworkRenderer(network);

    document.body.appendChild(renderer.getDomElement());

    document.addEventListener('mousedown', () => {isDrawing = true; }, false);

    document.addEventListener('mousemove', (event: any) => {
        event.preventDefault();
        renderer.setMouse(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1
        );
    }, false);

    document.addEventListener('mouseup', () => {
        isDrawing = false;
        renderer.getControls().enabled = true;
    }, false);

    renderer.render();
}

window.onload = () => main();
