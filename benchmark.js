const Xmen = require('./index.js')
const fs = require('fs')
const path = require('path')
const { XMLParser } = require("fast-xml-parser");

const data = fs.readFileSync(path.join(__dirname, '/test/bitcoin.com-feed.xml'), 'utf-8')
const parser = new XMLParser();


console.time('Xmen')
new Xmen.html(data)
console.timeEnd('Xmen')
console.time('fxp')
parser.parse(data);
console.timeEnd('fxp')


console.time('Xmen')
new Xmen.html(data)
console.timeEnd('Xmen')
console.time('fxp')
parser.parse(data);
console.timeEnd('fxp')

console.time('Xmen')
new Xmen.html(data)
console.timeEnd('Xmen')
console.time('fxp')
parser.parse(data);
console.timeEnd('fxp')