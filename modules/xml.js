const { prepare, hydrateStrings } = require('./clean')
const { createXMLElement } = require('./element')

function hydrateCDATA(CDATA, text) {
    return text.replace(/_CDATA\$(?<index>\d+)/g, (_, index) => {
        return `${CDATA[index]}`
    })
}

function parseXML(data, orphan = [], create) {
    const tag = /(?<balise><[^>]+>)(?<text>[^<]*)/g
    const stack = []
    let rootElement = create('root')
    const hydrate = (value = "") => hydrateStrings({ strings: data.strings, text: value }, false)
    while ((exec = tag.exec(data.text)) !== null) {
        let { balise, text } = exec.groups
        if (balise[1] !== '?' && balise[1] !== '!') {
            text = hydrateCDATA(data.CDATA, hydrate(text))
            balise = balise.replace(/ *= */g, '=')
            const [tagName, ...attributes] = balise.replace(/((^<\??)|(\??>$))/g, '').split(' ')
            const lastElement = stack[stack.length - 1]

            const element = create(tagName.replace(/((^\/)|(\/$))/g, ''))
            if (text) element.$addChildren(create(text, true))
            attributes?.forEach(attr => {
                const [key, value] = attr.split('=')
                element.$addAttribute(key, hydrate(value))
            })

            if (lastElement) {
                if ('/' + lastElement.$tagName === tagName) {
                    stack.pop()
                    if (text) {
                        stack[stack.length - 1]?.$addChildren(create(text, true))
                    }
                } else if (!tagName.startsWith('/')) {
                    if (orphan.includes(lastElement.$tagName)) {
                        // console.log('orphan', stack.length, element.$tagName, lastElement.$tagName)
                        stack.pop()
                        const txt = lastElement.$children[0]
                        lastElement.$children = []
                        const lastElementParent = stack.at(-1)
                        lastElementParent.$addChildren(txt)
                        lastElementParent.$addChildren(element)
                        // console.log('orphanEnd', stack.length, element.$tagName, lastElement.$tagName, lastElementParent.$tagName)
                    } else {
                        lastElement.$addChildren(element)
                    }
                    if (!balise.endsWith('/>')) {
                        stack.push(element)
                    }
                } else if (stack.find(a => ('/' + a.$tagName) === tagName)) {
                    while (stack.length && ('/' + stack.at(-1).$tagName) !== tagName) {
                        stack.pop()
                    }
                    stack.pop()
                }
            } else {
                rootElement.$addChildren(element)
                stack.push(element)
            }
        }

    }
    return { rootElement }
}

function extractCDATA(data) {
    const CDATA = []
    const text = data.replace(
        /<!\[CDATA\[((?!\]\]>).)*\]\]>/gs,
        (match) => {
            return '_CDATA$' + (CDATA.push(match.slice(9, -3)) - 1)
        })
    return { CDATA, text }
}

module.exports = class XMEN_XML {

    CDATA = []
    strings = []
    root = null
    originalData = null
    text = null
    orphanTags = []

    constructor(dataInStringOrBuffer, orphanTags = [], create = createXMLElement) {
        this.orphanTags = orphanTags
        let data;
        if (typeof dataInStringOrBuffer === 'string') {
            data = dataInStringOrBuffer
        } else if (dataInStringOrBuffer instanceof Buffer) {
            data = dataInStringOrBuffer.toString()
        } else {
            throw new Error("Invalid data in constructor.")
        }
        this.originalData = data

        const { CDATA, text: tmp } = extractCDATA(data)
        this.CDATA = [...CDATA]

        let { strings, text } = prepare(tmp)
        this.strings = [...strings]
        this.text = '' + text
        const parsed = parseXML({ text, strings, CDATA }, this.orphanTags, create)
        this.root = parsed.rootElement
    }

}