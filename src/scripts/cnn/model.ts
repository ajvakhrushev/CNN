import { DataSet } from './interfaces';
import { getRandomTill, getRandomArbitrary } from './utils';

const learningRate: number = 0.3;
const error = 0.005;

let layers: number[] = [];
let biases: number[] = [];
let weights: number[] = [];
let output: number[] = [];
let activation: number[] = [];
let activationD: number[] = [];

let layerBiasMap: number[][] = [];
let biasBiasWeightMap: number[][] = [];
let biasOutputMap: number[] = [];
let biasActivationMap: number[] = [];
let biasActivationDMap: number[] = [];

function calculateCost(input: number[] = [], output: number[] = []) {
  let result = 0;

  for (let i = 0, length = input.length; i < length; i++) {
    result += 0.5 * Math.pow(input[i] - output[i], 2);
  }

  return result;
}

function updateWeights(
  nextWeights: number[],
  layerBiasesPrev: number[],
  biasIndex: number,
  inputD: number,
  output: number[]
) {
  for(let j = 0, jLength = layerBiasesPrev.length; j < jLength; j++) {
    const biasIndexPrev = layerBiasesPrev[j];
    const weightIndexPrev = biasBiasWeightMap[biasIndex][biasIndexPrev];
    const errorDweightD = inputD * output[biasIndexPrev];

    nextWeights[weightIndexPrev] = weights[weightIndexPrev] - learningRate * errorDweightD;
  }
}

function updateBiases(nextBiases: number[], biasIndex: number, errorDbiasD: number) {
  nextBiases[biasIndex] = biases[biasIndex] - learningRate * errorDbiasD;
}

function propogate(input: number[] = [], isTraining: boolean = false) {
  const output: number[] = [];

  for(let i = 0, length = input.length; i < length; i++) {
    output[biasOutputMap[i]] = input[i];
  }

  for (let layerIndex = 1, layersLength = layers.length; layerIndex < layersLength; layerIndex++) {
    const layerBiases: number[] = layerBiasMap[layerIndex];
    const layerBiasesPrev: number[] = layerBiasMap[layerIndex - 1];

    for (let i = 0, iLength = layerBiases.length; i < iLength; i++) {
      const biasIndex: number = layerBiases[i];
      let input: number = 0;

      for (let j = 0, jLength = layerBiasesPrev.length; j < jLength; j++) {
        const biasPrevIndex: number = layerBiasesPrev[j];
        const weightIndex = biasBiasWeightMap[biasIndex][biasPrevIndex];

        input += output[biasPrevIndex] * weights[weightIndex];
      }

      const activatedInput: number = 1 / (1 + Math.exp(-input + biases[biasIndex]));

      output[biasOutputMap[biasIndex]] = activatedInput;

      if (isTraining) {
        activation[biasIndex] = activatedInput;
        activationD[biasIndex] = activatedInput * (1 - activatedInput);
      }
    }
  }

  return output;
}

function propogateBack(target: number[] = [], output: number[]) {
  const nextWeights: number[] = [];
  const nextBiases: number[] = [];
  const inputsD: number[] = [];
  const layerIndex = layerBiasMap.length - 1;
  const layerBiases = layerBiasMap[layerIndex];
  const layerBiasesPrev = layerBiasMap[layerIndex - 1];

  if (!layerBiases || !layerBiasesPrev) {
    return;
  }

  for (let i = 0, length = layerBiases.length; i < length; i++) {
    const biasIndex = layerBiases[i];
    const errorD = -(target[i] - output[biasIndex]);
    const inputD = errorD * activationD[biasIndex];

    inputsD[biasIndex] = inputD;

    nextBiases[biasIndex] = biases[biasIndex] - learningRate * inputD;

    for(let j = 0, jLength = layerBiasesPrev.length; j < jLength; j++) {
      const biasIndexPrev = layerBiasesPrev[j];
      const weightIndexPrev = biasBiasWeightMap[biasIndex][biasIndexPrev];
      const errorDweightD = inputD * output[biasIndexPrev];

      nextWeights[weightIndexPrev] = weights[weightIndexPrev] - learningRate * errorDweightD;
    }
  }

  for(let layerIndex = layers.length - 2; layerIndex > 0; layerIndex--) {
    const layerBiases = layerBiasMap[layerIndex];
    const layerBiasesPrev = layerBiasMap[layerIndex - 1];
    const layerBiasesNext = layerBiasMap[layerIndex + 1];

    for (let i = 0, length = layerBiases.length; i < length; i++) {
      const biasIndex = layerBiases[i];
      const biasWeightsNext = biasBiasWeightMap[biasIndex];
      let errorD = 0;
      let inputD = 0;

      for (let j = 0, jLength = layerBiasesNext.length; j < jLength; j++) {
        const biasIndexNext = layerBiasesNext[j];
        const weightIndexNext = biasWeightsNext[biasIndexNext];

        errorD += inputsD[biasIndexNext] * weights[weightIndexNext];
      }

      inputD = errorD * activationD[biasIndex];
      inputsD[biasIndex] = inputD;

      nextBiases[biasIndex] = biases[biasIndex] - learningRate * inputD;

      for(let j = 0, jLength = layerBiasesPrev.length; j < jLength; j++) {
        const biasIndexPrev = layerBiasesPrev[j];
        const weightIndexPrev = biasBiasWeightMap[biasIndex][biasIndexPrev];
        const errorDweightD = inputD * output[biasIndexPrev];

        nextWeights[weightIndexPrev] = weights[weightIndexPrev] - learningRate * errorDweightD;
      }
    }
  }

  weights = nextWeights;
  biases = nextBiases;
}

function propogateTrainCallback(biasIndex: number, value: number, activatedValue: number) {
  
}

function propogateTrain(input: number[] = []) {
  activation = [];
  activationD = [];
  output = [];
  // output = propogate(input, propogateTrainCallback);

  return propogate(input, true);
}

export function train(data: DataSet[], options?: any) {
  const max: number = (options && options.maxIterations) || 1000;

  for (let i = 0, iLength = data.length; i < iLength; i++) {
    let length: number = max;
    let index: number = 0;
    let dataSet: DataSet = data[i];
    let output: number[] = propogateTrain(dataSet.input);
    let lastLayerOutput: number[] = output.slice(-layers[layers.length - 1]);
    let cost: number = calculateCost(lastLayerOutput, dataSet.output);

    while(cost > error && length--, ++index) {
      propogateBack(dataSet.output, output);

      dataSet = data[getRandomTill(data.length)];
      output = propogateTrain(dataSet.input);
      lastLayerOutput = output.slice(-layers[layers.length - 1]);
      cost = calculateCost(lastLayerOutput, dataSet.output);
    }

    console.log(`${i}: ${index} - ${cost}`);
  }

  
}

export function run(input: number[] = []) {
  const lastLayerSize = layers[layers.length - 1];

  return propogate(input).slice(-lastLayerSize);
}

export function set(
  layersInput: number[],
  biasesInput: number[],
  weightsInput: number[],
  layerBiasMapInput: number[][],
  biasBiasWeightMapInput: number[][]
) {
  layers = layersInput;
  biases = biasesInput;
  weights = weightsInput;
  layerBiasMap = layerBiasMapInput;
  biasBiasWeightMap = biasBiasWeightMapInput;

  for (let i = 0, length = biases.length; i < length; i++) {
    biasOutputMap[i] = i;
    biasActivationMap[i] = i;
    biasActivationDMap[i] = i;
  }
}

export function get() {
  return {
    layers,
    biases,
    weights,
    layerBiasMap,
    biasBiasWeightMap
  };
}

export function initialize(inputSize: number = 0, outputSize: number = 0, layersSizes: number[] = []) {
  layers = [inputSize, ...layersSizes, outputSize];
  biases = [];
  weights = [];
  layerBiasMap = [];
  biasBiasWeightMap = [];
  biasOutputMap = [];
  biasActivationMap = [];
  biasActivationDMap = [];

  let biasIndex: number = 0;
  let weightIndex: number = 0;
  let layerBiases: number[] = [];

  // set layers and layer mappings
  for (let i = 0, iLength = layers.length; i < iLength; i++) {
    const layerBiasesPrevIndex = i - 1;
    const layerBiasesPrev = layerBiasMap[layerBiasesPrevIndex] ? layerBiasMap[layerBiasesPrevIndex] : [];

    layerBiases = layerBiasMap[i] = [];

    for (let j = 0, jLength = layers[i]; j < jLength; j++, biasIndex++) {
      biases[biasIndex] = getRandomArbitrary(-1, 1);
      biasOutputMap[biasIndex] = biasIndex;
      biasActivationMap[biasIndex] = biasIndex;
      biasActivationDMap[biasIndex] = biasIndex;

      layerBiases.push(biasIndex);

      biasBiasWeightMap[biasIndex] = [];

      for (let k = 0, kLength = layerBiasesPrev.length; k < kLength; k++, weightIndex++) {
        const prevBiasIndex = layerBiasesPrev[k];

        weights[weightIndex] = getRandomArbitrary(-1, 1);
        biasBiasWeightMap[prevBiasIndex][biasIndex] = weightIndex;
        biasBiasWeightMap[biasIndex][prevBiasIndex] = weightIndex;
      }
    }
  }
}
