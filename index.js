const fs = require('fs')
const yaml = require('yaml')
const mongoose = require('mongoose')

const config = yaml.parse(fs.readFileSync('./jangle.yml', 'utf8'))

const fieldTypes = {
  Html: String,
  Number,
  Boolean,
  String
}

const messages = {
  schema: {
    invalidCharacters: name =>
      console.warn(`The name "${name}" has invalid characters, only letters are allowed.`),
    thatsAFieldName: name =>
      console.warn(`The name "${name}" is already a built-in field, please pick another name.`),
    duplicateNames: name =>
      console.warn(`The name "${name}" is already in use.`)
  }
}

const endsIn = char => word =>
  word.indexOf(char) === word.length - 1

const parseField = field =>
  endsIn('?')(field)
    ? ({ type: field.substring(0, field.length - 1), optional: true, unique: false })
    : endsIn('!')(field)
      ? ({ type: field.substring(0, field.length - 1), optional: false, unique: true })
      : ({ type: field, optional: false, unique: false })

const fieldify = (field) => {
  const { type, optional, unique } = parseField(field)
  return fieldTypes[type]
    ? { type: fieldTypes[type], required: !optional, unique }
    : { type: mongoose.Types.ObjectId, ref: type, required: !optional, unique }
}

const schemify = (fields) =>
  Object.keys(fields)
    .reduce((schema, key) => {
      if (typeof fields[key] === 'object') {
        schema[key] = schemify(fields[key])
      } else {
        const field = fieldify(fields[key])
        if (field) {
          schema[key] = field
        }
      }
      return schema
    }, {})

const makeSchema = obj => key =>
  console.log(schemify(obj[key]))

const isLetter = (char) => {
  const code = char.toLowerCase().charCodeAt(0)
  return code >= 'a'.charCodeAt(0) && code <= 'z'.charCodeAt(0)
}

const hasInvalidCharacters = (name) =>
  !(name.split('').every(isLetter))

const isValidListName = name =>
  hasInvalidCharacters(name)
    ? messages.schema.invalidCharacters(name)
    : fieldTypes[name]
      ? messages.schema.thatsAFieldName(name)
      : true

const lists = config =>
  Object.keys(config.lists)
    .filter(isValidListName)
    .map(makeSchema(config.lists))

lists(config)
