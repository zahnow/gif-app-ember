import { LRUCache, dasherize as dasherize$1, STRING_DASHERIZE_CACHE } from '@warp-drive/core/utils/string';
import { InflectionRuleDefaults as defaultRules } from './-private.js';
import { macroCondition, getGlobalConfig } from '@embroider/macros';

// eslint-disable-next-line no-useless-escape
const STRING_CAMELIZE_REGEXP_1 = /(\-|\_|\.|\s)+(.)?/g;
const STRING_CAMELIZE_REGEXP_2 = /(^|\/)([A-Z])/g;
const CAMELIZE_CACHE = new LRUCache(key => key.replace(STRING_CAMELIZE_REGEXP_1, (_match, _separator, chr) => chr ? chr.toUpperCase() : '').replace(STRING_CAMELIZE_REGEXP_2, (match /*, separator, chr */) => match.toLowerCase()));
const STRING_UNDERSCORE_REGEXP_1 = /([a-z\d])([A-Z]+)/g;
// eslint-disable-next-line no-useless-escape
const STRING_UNDERSCORE_REGEXP_2 = /\-|\s+/g;
const UNDERSCORE_CACHE = new LRUCache(str => str.replace(STRING_UNDERSCORE_REGEXP_1, '$1_$2').replace(STRING_UNDERSCORE_REGEXP_2, '_').toLowerCase());
const STRING_CAPITALIZE_REGEXP = /(^|\/)([a-z\u00C0-\u024F])/g;
const CAPITALIZE_CACHE = new LRUCache(str => str.replace(STRING_CAPITALIZE_REGEXP, (match /*, separator, chr */) => match.toUpperCase()));

/**
 * Replaces underscores, spaces, or camelCase with dashes.
 *
 * ```js
 * import { dasherize } from '@warp-drive/utilities/string';
 *
 * dasherize('innerHTML');                // 'inner-html'
 * dasherize('action_name');              // 'action-name'
 * dasherize('css-class-name');           // 'css-class-name'
 * dasherize('my favorite items');        // 'my-favorite-items'
 * dasherize('privateDocs/ownerInvoice';  // 'private-docs/owner-invoice'
 * ```
 *
 * @public
 * @since 4.13.0
 */
const dasherize = dasherize$1;

/**
 * Returns the lowerCamelCase form of a string.
 *
 * ```js
 * import { camelize } from '@warp-drive/utilities/string';
 *
 * camelize('innerHTML');                   // 'innerHTML'
 * camelize('action_name');                 // 'actionName'
 * camelize('css-class-name');              // 'cssClassName'
 * camelize('my favorite items');           // 'myFavoriteItems'
 * camelize('My Favorite Items');           // 'myFavoriteItems'
 * camelize('private-docs/owner-invoice');  // 'privateDocs/ownerInvoice'
 * ```
 *
 * @public
 * @since 4.13.0
 */
function camelize(str) {
  return CAMELIZE_CACHE.get(str);
}

/**
 * Returns the lower\_case\_and\_underscored form of a string.
 *
 * ```js
 * import { underscore } from '@warp-drive/utilities/string';
 *
 * underscore('innerHTML');                 // 'inner_html'
 * underscore('action_name');               // 'action_name'
 * underscore('css-class-name');            // 'css_class_name'
 * underscore('my favorite items');         // 'my_favorite_items'
 * underscore('privateDocs/ownerInvoice');  // 'private_docs/owner_invoice'
 * ```
 *
 * @public
 * @since 4.13.0
 */
function underscore(str) {
  return UNDERSCORE_CACHE.get(str);
}

/**
 * Returns the Capitalized form of a string
 *
 * ```js
 * import { capitalize } from '@warp-drive/utilities/string';
 *
 * capitalize('innerHTML')                 // 'InnerHTML'
 * capitalize('action_name')               // 'Action_name'
 * capitalize('css-class-name')            // 'Css-class-name'
 * capitalize('my favorite items')         // 'My favorite items'
 * capitalize('privateDocs/ownerInvoice'); // 'PrivateDocs/ownerInvoice'
 * ```
 *
 * @public
 * @since 4.13.0
 */
function capitalize(str) {
  return CAPITALIZE_CACHE.get(str);
}

/**
 * Sets the maximum size of the LRUCache for all string transformation functions.
 * The default size is 10,000.
 *
 * @public
 * @since 4.13.0
 */
function setMaxLRUCacheSize(size) {
  CAMELIZE_CACHE.size = size;
  UNDERSCORE_CACHE.size = size;
  CAPITALIZE_CACHE.size = size;
  STRING_DASHERIZE_CACHE.size = size;
}
const BLANK_REGEX = /^\s*$/;
const LAST_WORD_DASHED_REGEX = /([\w/-]+[_/\s-])([a-z\d]+$)/;
const LAST_WORD_CAMELIZED_REGEX = /([\w/\s-]+)([A-Z][a-z\d]*$)/;
const CAMELIZED_REGEX = /[A-Z][a-z\d]*$/;
const SINGULARS = new LRUCache(word => {
  return _singularize(word);
});
const PLURALS = new LRUCache(word => {
  return _pluralize(word);
});
const UNCOUNTABLE = new Set(defaultRules.uncountable);
const IRREGULAR = new Map();
const INVERSE_IRREGULAR = new Map();
const SINGULAR_RULES = new Map(defaultRules.singular.reverse());
const PLURAL_RULES = new Map(defaultRules.plurals.reverse());

/**
 * Marks a word as uncountable. Uncountable words are not pluralized
 * or singularized.
 *
 * @public
 * @since 4.13.0
 */
function uncountable(word) {
  UNCOUNTABLE.add(word.toLowerCase());
}

/**
 * Marks a list of words as uncountable. Uncountable words are not pluralized
 * or singularized.
 *
 * @public
 * @since 4.13.0
 */
function loadUncountable(uncountables) {
  uncountables.forEach(word => {
    uncountable(word);
  });
}

/**
 * Marks a word as irregular. Irregular words have unique
 * pluralization and singularization rules.
 *
 * @public
 * @since 4.13.0
 */
function irregular(single, plur) {
  //pluralizing
  IRREGULAR.set(single.toLowerCase(), plur);
  IRREGULAR.set(plur.toLowerCase(), plur);

  //singularizing
  INVERSE_IRREGULAR.set(plur.toLowerCase(), single);
  INVERSE_IRREGULAR.set(single.toLowerCase(), single);
}

/**
 * Marks a list of word pairs as irregular. Irregular words have unique
 * pluralization and singularization rules.
 *
 * @public
 * @since 4.13.0
 */
function loadIrregular(irregularPairs) {
  irregularPairs.forEach(pair => {
    //pluralizing
    IRREGULAR.set(pair[0].toLowerCase(), pair[1]);
    IRREGULAR.set(pair[1].toLowerCase(), pair[1]);

    //singularizing
    INVERSE_IRREGULAR.set(pair[1].toLowerCase(), pair[0]);
    INVERSE_IRREGULAR.set(pair[0].toLowerCase(), pair[0]);
  });
}
loadIrregular(defaultRules.irregularPairs);

/**
 * Clears the caches for singularize and pluralize.
 *
 * @public
 * @since 4.13.0
 */
function clear() {
  SINGULARS.clear();
  PLURALS.clear();
}

/**
 * Resets the inflection rules to the defaults.
 *
 * @public
 * @since 4.13.0
 */
function resetToDefaults() {
  clearRules();
  defaultRules.uncountable.forEach(v => UNCOUNTABLE.add(v));
  defaultRules.singular.forEach(v => SINGULAR_RULES.set(v[0], v[1]));
  defaultRules.plurals.forEach(v => PLURAL_RULES.set(v[0], v[1]));
  loadIrregular(defaultRules.irregularPairs);
}

/**
 * Clears all inflection rules
 * and resets the caches for singularize and pluralize.
 *
 * @public
 * @since 4.13.0
 */
function clearRules() {
  SINGULARS.clear();
  PLURALS.clear();
  UNCOUNTABLE.clear();
  IRREGULAR.clear();
  INVERSE_IRREGULAR.clear();
  SINGULAR_RULES.clear();
  PLURAL_RULES.clear();
}

/**
 * Singularizes a word.
 *
 * @public
 * @since 4.13.0
 */
function singularize(word) {
  macroCondition(getGlobalConfig().WarpDrive.env.DEBUG) ? (test => {
    if (!test) {
      throw new Error(`singularize expects to receive a non-empty string`);
    }
  })(typeof word === 'string' && word.length > 0) : {};
  if (!word) return '';
  return SINGULARS.get(word);
}

/**
 * Pluralizes a word.
 *
 * @public
 * @since 4.13.0
 */
function pluralize(word) {
  macroCondition(getGlobalConfig().WarpDrive.env.DEBUG) ? (test => {
    if (!test) {
      throw new Error(`pluralize expects to receive a non-empty string`);
    }
  })(typeof word === 'string' && word.length > 0) : {};
  if (!word) return '';
  return PLURALS.get(word);
}
function unshiftMap(v, map) {
  // reorder
  const rules = [v, ...map.entries()];
  map.clear();
  rules.forEach(rule => {
    map.set(rule[0], rule[1]);
  });
}

/**
 * Adds a pluralization rule.
 *
 * @public
 * @since 4.13.0
 */
function plural(regex, string) {
  // rule requires reordering if exists, so remove it first
  if (PLURAL_RULES.has(regex)) {
    PLURAL_RULES.delete(regex);
  }

  // reorder
  unshiftMap([regex, string], PLURAL_RULES);
}

/**
 * Adds a singularization rule.
 *
 * @public
 * @since 4.13.0
 */
function singular(regex, string) {
  // rule requires reordering if exists, so remove it first
  if (SINGULAR_RULES.has(regex)) {
    SINGULAR_RULES.delete(regex);
  }

  // reorder
  unshiftMap([regex, string], SINGULAR_RULES);
}
function _pluralize(word) {
  return inflect(word, PLURAL_RULES, IRREGULAR);
}
function _singularize(word) {
  return inflect(word, SINGULAR_RULES, INVERSE_IRREGULAR);
}
function inflect(word, typeRules, irregulars) {
  // empty strings
  const isBlank = !word || BLANK_REGEX.test(word);
  if (isBlank) {
    return word;
  }

  // basic uncountables
  const lowercase = word.toLowerCase();
  if (UNCOUNTABLE.has(lowercase)) {
    return word;
  }

  // adv uncountables
  const wordSplit = LAST_WORD_DASHED_REGEX.exec(word) || LAST_WORD_CAMELIZED_REGEX.exec(word);
  const lastWord = wordSplit ? wordSplit[2].toLowerCase() : null;
  if (lastWord && UNCOUNTABLE.has(lastWord)) {
    return word;
  }

  // handle irregulars
  const isCamelized = CAMELIZED_REGEX.test(word);
  for (let [rule, substitution] of irregulars) {
    if (lowercase.match(rule + '$')) {
      if (isCamelized && lastWord && irregulars.has(lastWord)) {
        substitution = capitalize(substitution);
        rule = capitalize(rule);
      }
      return word.replace(new RegExp(rule, 'i'), substitution);
    }
  }

  // do the actual inflection
  for (const [rule, substitution] of typeRules) {
    if (rule.test(word)) {
      return word.replace(rule, substitution);
    }
  }
  return word;
}
export { singular as a, plural as b, loadUncountable as c, clear as d, clearRules as e, dasherize as f, camelize as g, capitalize as h, irregular as i, underscore as j, setMaxLRUCacheSize as k, loadIrregular as l, pluralize as p, resetToDefaults as r, singularize as s, uncountable as u };