const { prepare, hydrateStrings } = require('./clean')
const createElement = require('./element')

function hydrateCDATA(CDATA, text) {
    return text.replace(/_CDATA\$(?<index>\d+)/g, (_, index) => {
        return `${CDATA[index]}`
    })
}

function parseXML(data) {
    const tag = /(?<balise><[^>]+>)(?<text>[^<]*)/g
    const stack = []
    let rootElement = createElement('root')
    const hydrate = (value = "") => hydrateStrings({ strings: data.strings, text: value }, false)
    while ((exec = tag.exec(data.text)) !== null) {
        let { balise, text } = exec.groups
        if (balise[1] !== '?' && balise[1] !== '!') {
            text = hydrateCDATA(data.CDATA, hydrate(text))
            balise = balise.replace(/ *= */g, '=')
            const [tagName, ...attributes] = balise.replace(/((^<\??)|(\??>$))/g, '').split(' ')
            const lastElement = stack[stack.length - 1]

            const element = createElement(tagName.replace(/((^\/)|(\/$))/g, ''))
            if (text) element.$addChildren(createElement(text, true))
            attributes?.forEach(attr => {
                const [key, value] = attr.split('=')
                element.$addAttribute(key, hydrate(value))
            })

            if (lastElement) {
                if ('/' + lastElement.$tagName === tagName) {
                    stack.pop()
                    if (text) {
                        stack[stack.length - 1]?.$addChildren(createElement(text, true))
                    }
                } else if (!tagName.startsWith('/')) {
                    lastElement.$addChildren(element)
                    if (!balise.endsWith('/>')) {
                        stack.push(element)
                    }
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

    constructor(dataInStringOrBuffer) {
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

        const parsed = parseXML({ text, strings, CDATA })
        this.root = parsed.rootElement
    }

}