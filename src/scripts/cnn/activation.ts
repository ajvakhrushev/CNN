import { Activation, ActivationFn } from './interfaces';

const sigmoidFn: ActivationFn = (value: number): number => 1 / (1 + Math.exp(-value));
const ReLUDFn: ActivationFn = (value: number): number => {
  if (value === 0) {
    return undefined;
  }

  return value > 0 ? 1 : 0;
}

export const sigmoid: Activation = {
  method: sigmoidFn,
  methodD: (value: number): number => {
    const activatedValue: number = sigmoidFn(value);

    return activatedValue * (1 - activatedValue);
  },
  methodDCached: (activatedValue: number): number => activatedValue * (1 - activatedValue)
}

export const ReLU: Activation = {
  method: (value: number): number => Math.max(0, value),
  methodD: ReLUDFn,
  methodDCached: ReLUDFn
}
