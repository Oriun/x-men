
# X-men

Dependance-free XML parser


## Features

- XML parsing




## Installation

Install with yarn or npm

```bash
  yarn add @oriun/x-men
```
    
## Usage/Examples

We'll use this XML content as `data` for the examples below :
```xml
<note>
    <to>Tove</to>
    <to>Dany</to>
    <to>Kayle</to>
    <from>Jani</from>
    <heading>Reminder</heading>
    <body>Don't forget me this weekend!</body>
    <date type="unix">
        1639688607324
    </date>
</note>
```

First import the package and call the `xml` class to parse your content, then navigate into the tree as an object :

```javascript
const Xmen = require('@oriun/x-men')

const data = "*** our xml content ***"

const { root } = new Xmen.xml(data)

const noteContent = root.note.body.$innerXML
// "Don't forget me this weekend!"

const recipients = root.note.to.$innerXML
// [ 'Tove', 'Dany', 'Kayle' ]

const date = root.note.date
// { $tagName: "date", $attributes: { "type": "unix"}, "$children": [...]}

let fullDate
if(date.type === "unix"){ // assertion ok
    fullDate = new Date(parseInt(date.$innerXML))
    // Date Thu Dec 16 2021 22:03:27 GMT+0100 ...
}
```
Note that the tree is immutable for now, next versions will add features for tree manipulation.


## Properties
Considering the following XML:
```xml
<article id="42" type="blogpost">
    <title>Hello</title>
    <subtitle>world</subtitle>
</article>
```
#### $tagName
The tag name : `article`
#### $attributes
The tag attributes : `{ id: "42", type: "blogpost" }`
#### $children
The children tags : `[ { $tagName: "title",...}, { $tagName: "subtitle"}]`
#### $innerXML
The content of the tag : 
```xml
<title>Hello</title><subtitle>world</subtitle>
```
#### $outerXML
The content of the tag, including the tag itself : 
```xml
<article id="42" type="blogpost"><title>Hello</title><subtitle>world</subtitle></article>
```


## Naming issues
For ergonomy, navigating into the tree is simplified. For example `root.note.to` will first search for tag `to` in `note.$children`, then for property `to` in `note.$attributes` and finally for property `to` on the `note` object itself.
```javascript
    const data = `
    <note children="todo">
        <children> A child list </children>
        <another> tag </another> 
    </note>`

    const { root } = new Xmen.xml(data)

    const children = root.note.children
    // "A child list"
    // Can't get the full list of child with this syntax
```

If your content may contain overlapping tags or attributes, consider using Xmen class specific properties : `$tagName, $attributes, $children, $innerXML and $outerXML`
```javascript
    const children = root.note.$children
    /* [
        { $tagName: "children", ...},
        { $tagName: "another", ...}
    ] */

    const noteAttribute = root.note.$attributes.children
    // "todo"
```
## License

[MIT](https://choosealicense.com/licenses/mit/)

