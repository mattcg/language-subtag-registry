'use strict';

const collection = require('./data/json/collection.json');
const extlang = require('./data/json/extlang.json');
const grandfathered = require('./data/json/grandfathered.json');
const index = require('./data/json/index.json');
const language = require('./data/json/language.json');
const macrolanguage = require('./data/json/macrolanguage.json');
const meta = require('./data/json/meta.json');
const privateUse = require('./data/json/private-use.json');
const region = require('./data/json/region.json');
const registry = require('./data/json/registry.json');
const script = require('./data/json/script.json');
const special = require('./data/json/special.json');
const variant = require('./data/json/variant.json');

module.exports = {
  collection,
  extlang,
  grandfathered,
  index,
  language,
  macrolanguage,
  meta,
  privateUse,
  region,
  registry,
  script,
  special,
  variant
};
