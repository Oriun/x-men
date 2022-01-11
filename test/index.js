const Xmen = require('../index')

const fs = require('fs')
const path = require('path')


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


const data = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8')

console.time('parsing')
const parsed = new Xmen.html(data)
console.timeEnd('parsing')
console.log(parsed.root.html.body.div)

// const items = root.rss.channel.item
// console.log(items)
// const firstPost = items[0]

// console.log(firstPost)
// console.log(firstPost["bnmedia:post-thumbnail"].innerXML)

