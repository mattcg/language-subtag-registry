/**
 * @author Matthew Caruana Galizia <mattcg@gmail.com>
 * @license MIT: http://mattcg.mit-license.org/
 * @copyright Copyright (c) 2013, Matthew Caruana Galizia
 */

/*jshint node:true*/

'use strict';

import assert from 'node:assert';
import * as fs from 'node:fs';

fetch('https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry')
	.then(response => response.text())
	.then(convert);

function convert(iana) {
	const out = 'data/json';
	const records = iana.split('%%');
	const registry = [], index = {}, types = {}, scopes = {};

	function write(name, object) {
		fs.writeFileSync(out + '/' + name + '.json', JSON.stringify(object, null, '\t') + '\n');
	}

	write('meta', parseRecord(records.shift()));

	records.forEach((record) => {
		var i, tag, type;

		record = parseRecord(record);

		// Grandfathered records have only 'Tag'; everything else has 'Subtag'.
		tag = record.Subtag || record.Tag;
		type = record.Type;

		assert(tag);
		assert(type);

		// Registry is a flat array of items, containing all data.
		i = registry.push(record) - 1;
		if (!types[type]) {
			types[type] = {};
		}

		// Convert names to lowercase for predictable lookup. RCF 5646 defines them as being case insensitive anyway. Case formatting is only a convention.
		tag = tag.toLowerCase();

		types[type][tag] = i;

		if (!index[tag]) {
			index[tag] = {};
		} else {

			// Assert that data is not being overwritten.
			assert(!index[tag][type]);
		}

		// Index is a reverse of the registry, for performing lookups by tag.
		index[tag][type] = i;

		// Add convenience scope lists too.
		if (record.Scope) {
			if (!scopes[record.Scope]) {
				scopes[record.Scope] = {};
			}

			scopes[record.Scope][tag] = i;
		}
	});

	write('registry', registry);
	write('index', index);

	Object.keys(types).forEach((type) => write(type, types[type]));
	Object.keys(scopes).forEach((scope) => write(scope, scopes[scope]));
}

function parseRecord(record) {
	var n;

	return record.trim().split('\n').reduce((out, line) => {
		var c, v;

		// Every line after the first in a multiline record starts with two spaces.
		if (line.substr(0, 2) === '  ') {
			c = 0;
		} else {
			c = line.indexOf(':');
			n = line.substr(0, c);
		}

		v = line.substr(c + 2);

		// RFC 5646: Field-names MUST NOT occur more than once per record, with the exception of the 'Description', 'Comments', and 'Prefix' fields.
		switch (n) {
			case 'Description':
			case 'Comments':
			case 'Prefix':
				if (!out[n]) {
					out[n] = [v];
				} else if (0 === c) {

					// Fix for #6.
					out[n][out[n].length - 1] += ' ' + v;
				} else {
					out[n].push(v);
				}
				break;
			default:
				out[n] = v;
		}

		return out;
	}, {});
}
