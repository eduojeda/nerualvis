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
                    const l = new Link(m.getId() + "-" + n.getId(), m, n, Math.random());
                    m.addOutput(l);
                    n.addInput(l);
                });
            }

            layer.push(n);
        }

        this.layers.push(layer);
    }

    public getInputLayer(): Neuron[] {
        return this.layers[0];
    }

    public getHiddenLayers(): Neuron[][] {
        return this.layers.slice(1, this.layers.length - 1);
    }

    public getOutputLayer(): Neuron[] {
        return this.layers.slice(-1).pop();
    }

    public getLinks(): Link[] {
        let neurons: Neuron[] = this.layers.reduce((ac, layer) => ac.concat(layer));
        let links = neurons.reduce((ac, neuron) => ac.concat(neuron.getOutputs()), []);

        return links;
    }
}
