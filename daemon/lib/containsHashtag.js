function containsHashtag(text, {entities: {hashtags = []} = {}} = {}) {
  return hashtags.map(({text}) => (text)).includes(text);
}

module.exports = containsHashtag;
