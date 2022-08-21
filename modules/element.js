class XMENElement {
    $tagName = ""
    $attributes = {}
    $children = []
    #$textContent = ""
    constructor(text, textNode = false) {
        if (typeof text !== "string") {
            throw new Error("Contructor must take a sring as argument")
        }
        if (textNode) {
            this.$tagName = '#text'
            this.#$textContent = text
        } else {
            this.$tagName = text
        }
    }
    $addAttribute(key, value = true) {
        this.$attributes[key] = value
    }
    $addChildren(elemntOrString) {
        if (elemntOrString instanceof XMENElement) {
            this.$children.push(elemntOrString)
        } else if (typeof elemntOrString === 'string') {
            this.$children.push(new XMENElement(elemntOrString))
        }
    }
    get $outerXML() {
        if (this.$tagName === '#text') {
            return this.#$textContent
        } else {
            let attrs = ''
            if (Object.keys(this.$attributes).length) {
                attrs = ' ' + Object.entries(this.$attributes).map(([key, value]) => `${key}="${value}"`).join(" ")
            }
            return `<${this.$tagName}${attrs}>${this.$innerXML}</${this.$tagName}>`
        }
    }
    get $innerXML() {
        if (this.$tagName === '#text') {
            return this.#$textContent
        } else {
            return this.$children.map(child => child.$outerXML).join('')
        }
    }
}

Object.defineProperty(String.prototype, '$attributes', {
    get: function () {
        return this.$attributes
    }
});

class HTMLElement extends XMENElement {
    get $classList (){ return this.$addAttribute.class?.split(' ').filter(Boolean) || [] }
    get $innerHTML() { return this.$innerXML }
    get $outerHTML() { return this.$outerXML }
    get $textContent() {
        if (this.$tagName === '#text') {
            return this.$innerXML
        } else {
            return this.$children.map(child => child.$textContent).join('')
        }
    }
}

const ProxyHandler = {
    get: function (obj, prop) {
        if (prop.startsWith('$')) {
            return obj[prop];
        }
        const children = obj.$children.filter(element => element.$tagName === prop)
        if (children.length) {
            return children.length === 1 ? children[0] : children
        }
        if (prop in obj.$attributes) {
            return obj.$attributes[prop]
        }

        if (('$' + prop) in obj) {
            return obj['$' + prop]
        }
        return undefined

    },
    set: function (obj, prop, valeur) {
        return false;
    }
}

module.exports = {
    createXMLElement: function (text, textNode) {
        const element = new XMENElement(text, textNode)
        return new Proxy(element, ProxyHandler)
    },
    createHTMLElement: function (text, textNode) {
        const element = new HTMLElement(text, textNode)
        return new Proxy(element, ProxyHandler)
    }
}