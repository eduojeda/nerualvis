import Neuron from "./Neuron";

export class Link {
    private id: string;
    private weight: number;
    private source: Neuron;
    private target: Neuron;

    constructor(id: string, source: Neuron, target: Neuron, weight: number) {
        this.id = id;
        this.weight = weight;
        this.source = source;
        this.target = target;
    }

    public getWeight(): number {
        return this.weight;
    }

    public getSource(): Neuron {
        return this.source;
    }
}
