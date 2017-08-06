import Neuron from "./Neuron";
import {ActivationFunction} from "./activations/ActivationFunction";
import {Link} from "./Link";

export default class Network {
    private layers: Neuron[][];
    private activation: ActivationFunction;

    constructor(shape: number[], activation: ActivationFunction) {
        shape.forEach(this.createLayer.bind(this));

        this.activation = activation;
    }

    private createLayer(size: number)  {
        if (!this.layers) {
            this.layers = [];
        }

        const previousLayer: Neuron[] = this.layers.slice(-1).pop();
        const layerCount = this.layers.length;
        let layer: Neuron[] = [];

        for (let i = 0 ; i < size ; i++) {
            let n = new Neuron(layerCount + "." + i, Math.random());

            if (previousLayer) {
                previousLayer.forEach(m => {
                    const l = new Link(m.getId() + "-" + n.getId(), m, n, 1);
                    m.addOutput(l);
                    n.addInput(l);
                });
            }

            layer.push(n);
        }

        this.layers.push(layer);
    }
}
