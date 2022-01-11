const { prepare, hydrateStrings } = require('./clean')
const createElement = require('./element')
const XMEN_XML = require('./xml')

function removeScripts(data) {
    data.scripts = []
    data.text = data.text.replace(/<script[^>]*>(?<script>(.(?!\/script>))*)<\/script>/gs, (str, sc) => {
        if (!sc) return str
        const index = data.scripts.push(sc) - 1
        const start = str.slice(0, 0 - sc.length - 9)
        return start + '_%$' + index + '</script>'
    })
    return data
}

function removeStyle(data) {
    data.styles = []
    data.text = data.text.replace(/<style[^>]*>(?<style>(.(?!\/style>))*)<\/style>/gs, (str, st) => {
        if (!st) return str
        const index = data.styles.push(st) - 1
        const start = str.slice(0, 0 - st.length - 8)
        return start + '_&$' + index + '</style>'
    })
    return data
}

// module.exports = {
//     removeScripts,
//     removeStyle

// }

module.exports = class XMEN_HTML extends XMEN_XML {

    styles = []
    scripts = []

    constructor(dataInStringOrBuffer) {
        let data;
        if (typeof dataInStringOrBuffer === 'string') {
            data = dataInStringOrBuffer
        } else if (dataInStringOrBuffer instanceof Buffer) {
            data = dataInStringOrBuffer.toString()
        } else {
            throw new Error("Invalid data in constructor.")
        }
        const { styles, text: tmp } = removeStyle({ text: data })
        const { scripts, text } = removeScripts({ text: tmp })
        super(text)
        this.styles = styles
        this.scripts = scripts
    }
    querySelectorLimit(selector, limit) {

    }

    querySelector(selector) {
        return querySelectorLimit(selector, 1)
    }
    querySelectorAll(selector) {
        return querySelectorLimit(selector, Infinity)
    }
}