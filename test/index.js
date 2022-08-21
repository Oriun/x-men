const Xmen = require('../index')

const fs = require('fs')
const path = require('path');
const element = require('../modules/element');


/// Coinbase
// const data = fs.readFileSync(path.join(__dirname, 'coinbase-feed.xml'), 'utf-8')

// console.time('parsing')
// const { root } = new Xmen.xml(data)
// console.timeEnd('parsing')
// console.log(root.rss)

// const items = root.rss.channel.item

// const firstPost = items[0]

// console.log(firstPost)
// console.log(firstPost["content:encoded"].innerXML)

// const { root: content } = new Xmen.xml(firstPost["content:encoded"].innerXML)

// console.log(content.figure[0].img.src)

// const data = fs.readFileSync(path.join(__dirname, 'bitcoin.com-feed.xml'), 'utf-8')

// console.time('parsing')
// const { root } = new Xmen.xml(data)
// console.timeEnd('parsing')
// console.log(root.rss.channel)

// const items = root.rss.channel.item
// console.log(items)
// const firstPost = items[0]

// console.log(firstPost)
// console.log(firstPost["bnmedia:post-thumbnail"].innerXML)

function flatTree(root) {
    if (root.tagName === "#text") return [root];
    else return [root, ...root.children.map(flatTree).flat()];
}

function runTree(root, extract = () => false) {
    if (extract(root)) return;
    if (root.$children?.length) root.$children.forEach(node => { runTree(node, extract) })
}

const data = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8')

console.time('parsing')
const parsed = new Xmen.html(data)
console.timeEnd('parsing')
// console.log(parsed.root.html.body.div.$children.at(-1).div)
const blocs = parsed.getElementsByClassName('ZINbbc luh4tb xpd O9g5cc uUPGi')

console.log(blocs.map(a=>a.children[0].a.attributes.href))
// console.log(blocs.map(a=>a.children[0].a.h3.div.children))
