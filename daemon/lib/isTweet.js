const _  = require('lodash');

const isTweet = _.conforms({
	id_str: _.isString,
	text: _.isString,
  entities: _.isObject,
});

module.exports = isTweet;
