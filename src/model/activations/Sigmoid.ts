import {ActivationFunction} from "./ActivationFunction";

export const Sigmoid: ActivationFunction = {
    func: (x: number): number => 1 / (1 + Math.exp(-x)),
    deriv: (x: number): number => {
        let output = Sigmoid.func(x);
        return output * (1 - output);
    },
};
