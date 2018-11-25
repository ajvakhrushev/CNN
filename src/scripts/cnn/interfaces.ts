export interface DataSet {
  input: number[],
  output: number[]
}

export interface ActivationFn {
  (value: number): number
}

export interface Activation {
  method: ActivationFn,
  methodD: ActivationFn,
  methodDCached?: ActivationFn
}

export type Coords = [number, number];
