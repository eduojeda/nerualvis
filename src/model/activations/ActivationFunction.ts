export interface ActivationFunction {
    func: (x: number) => number,
    deriv: (x: number) => number
}
