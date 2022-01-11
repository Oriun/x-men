const Xmen = require('@oriun/x-men')
const fs = require('fs')
const path = require('path')
const { XMLParser } = require("fast-xml-parser");

const data = fs.readFileSync(path.join(__dirname, './bitcoin.com-feed.xml'), 'utf-8')
const parser = new XMLParser();


console.time('Xmen')
new Xmen.xml(data)
console.timeEnd('Xmen')
console.time('fxp')
parser.parse(data);
console.timeEnd('fxp')


console.time('fxp')
parser.parse(data);
console.timeEnd('fxp')
console.time('Xmen')
new Xmen.xml(data)
console.timeEnd('Xmen')

console.time('Xmen')
new Xmen.xml(data)
console.timeEnd('Xmen')
console.time('fxp')
parser.parse(data);
console.timeEnd('fxp')