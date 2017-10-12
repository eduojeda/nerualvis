import {Link} from "./Link";
import {ActivationFunction} from "./activations/ActivationFunction";

export default class Neuron {
    private id: string;
    private activation: number;
    private bias: number; //todo better to model as an extra input from a neuron of activation 1?
    private inputs: Link[];
    private outputs: Link[];
    private activationFunction: ActivationFunction;
    private mesh: THREE.Mesh;

    constructor(id: string, bias: number) {
        this.id = id;
        this.bias = bias;
        this.activation = Math.random();
        this.inputs = [];
        this.outputs = [];
    }

    public addInput(l: Link) {
        this.inputs.push(l);
    }

    public addOutput(l: Link) {
        this.outputs.push(l);
    }

    public getOutputs(): Link[] {
        return this.outputs;
    }

    public update(): void {
        for (const input of this.inputs) {
            this.activation += input.getWeight() * this.activationFunction.func(input.getSource().activation);
        }
    }

    public getId(): string {
        return this.id;
    }

    public getMesh(): THREE.Mesh {
        return this.mesh;
    }

    public setMesh(mesh: THREE.Mesh) {
        this.mesh = mesh;
    }
}
