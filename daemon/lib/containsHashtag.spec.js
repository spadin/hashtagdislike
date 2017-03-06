const containsHashtag = require('./containsHashtag');

describe('containsHashtag', () => {
  it('returns true if text exists in hashtags list', () => {
    const data = {
      in_reply_to_status_id: 834786107392823300,
      in_reply_to_status_id_str: '834786107392823298',
      user: {
        id: 14416982,
        id_str: '14416982',
      },
      entities: {
        hashtags: [
          { text: 'dislike', indices: [ 13, 21 ] }
        ]
      },
    };

    expect(containsHashtag('dislike', data)).toEqual(true);
  });

  it('returns false without failing when data does not match', () => {
    expect(containsHashtag('dislike', {})).toEqual(false);
  });
});

