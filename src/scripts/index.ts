import * as mnist from 'mnist';
import {
  initialize,
  set,
  run,
  init as viewInit
} from './cnn/index';

const internalNetData = require('../data/net.json');
const mnistSet = mnist.set(8000, 2000);

set(
  internalNetData.layers,
  internalNetData.biases,
  internalNetData.weights,
  internalNetData.layerBiasMap,
  internalNetData.biasBiasWeightMap
);

// initialize(784, 10, [16, 16]);

// train();

let errors: number = 0;

for(let i = 0, length = mnistSet.test.length; i < length; i++) {
  const output = run(mnistSet.test[0].input);
  const index = mnistSet.test[0].output.findIndex(next => next === 1);

  if (output[index] < 0.99) {
    errors++;
  }
}

console.log(`errors count is ${errors}`);

// viewInit();