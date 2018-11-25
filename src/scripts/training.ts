import * as mnist from 'mnist';
import * as fs from 'fs';
import { initialize, train, get } from './cnn/index';

const dataSet = mnist.set(8000, 2000);
const dir = `${__dirname}/../src/data`;

initialize(784, 10, [392]);

train(mnist.set(8000, 2000).training);

fs.writeFileSync(
  `${dir}/net.json`,
  JSON.stringify(get(), null, 0),
  'utf8'
);

console.log('net has been saved');
