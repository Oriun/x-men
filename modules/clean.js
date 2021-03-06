
const defaultOptions = {
    noComments: true,
    noNewLine: true,
    singleSpace: true
}
function prepare(data, options = {}) {
    const opt = { ...defaultOptions, options }
    let { strings, text } = removeStrings(data)
    if (opt.noNewLine) {
        text = text.replace(/(\n|\t|\r)/g, '')
    }
    if (opt.noComments) {
        text = text.replace(/<!---[^--->]*--->/, '')
    }
    if (opt.singleSpace) {
        text = text.replace(/ {2,}/g, ' ')
    }
    return { strings, text }
}

const stringDelimiters = {
    '"': {
        closing: '"',
        escapable: "\\",
        empty: true,
        keep: false,
        controlChar: true,
        trim: false,
    },
    "'": {
        closing: "'",
        escapable: "\\",
        empty: true,
        keep: false,
        controlChar: true,
        trim: false,
    },
    ">": {
        closing: '<',
        escapable: false,
        empty: false,
        keep: true,
        controlChar: false,
        trim: true,
    }
}
function removeStrings(data) {
    const strings = []
    let betweenQuotes = false
    let currentQuotes = null
    let currentString = ""
    let text = ""
    for (let i = 0; i < data.length; i++) {
        if (!betweenQuotes) {
            if (data[i] in stringDelimiters) {// === "'" || data[i] === '"') {
                betweenQuotes = true
                currentQuotes = data[i]
            } else {
                text += data[i]
            }
        } else {
            const isClosingChar = data[i] === stringDelimiters[currentQuotes].closing
            const isEscaped = data[i - 1] === stringDelimiters[currentQuotes].escapable
            if (isClosingChar && !isEscaped) {
                if (!stringDelimiters[currentQuotes].controlChar) {
                    currentString = currentString.replace(/(\n|\t|\r)/g, '')
                }
                if (stringDelimiters[currentQuotes].trim) {
                    currentString = currentString.trim()
                }
                if (stringDelimiters[currentQuotes].keep) text += currentQuotes
                if (stringDelimiters[currentQuotes].empty || currentString.length) {
                    const index = strings.push(currentString) - 1
                    text += '_#$' + index
                    currentString = ""
                }
                if (stringDelimiters[currentQuotes].keep) text += stringDelimiters[currentQuotes].closing
                betweenQuotes = false
                currentQuotes = null
            } else {
                currentString += data[i]
            }
        }
    }
    if(currentString) text += currentQuotes + currentString
    else if(currentQuotes) text += currentQuotes
    return { strings, text }
}

function hydrateStrings(data, quotes = '"') {
    const strings = data.strings
    return data.text.replace(/_#\$(?<index>\d+)/g, (_, index) => {
        return `${quotes ? '"' : ""}${strings[index].replace(/(?<!\\)"/g, "\\\"")}${quotes ? '"' : ""}`
    })
}

module.exports = { prepare, hydrateStrings }