var Tokenizer = require('../../../../src/common/lexicon/Tokenizer').Tokenizer;

// var specIsRunningTooLong = 5000;

describe('Tokenizer construction', function() {

  it('should load', function() {
    expect(Tokenizer).toBeDefined();
  });

  it('should create an array of tokens (words and symbols) on white space', function() {
    var doc = Tokenizer.tokenizeInput({
      orthography: 'There\'s a user-defined text: with ‘some’ stuff. And another. -too,  2011- ᖑᑎᓪᓗᒍ. again.',
    });
    expect(doc.orthographyArray).toEqual(['There', '\'', 's', 'a', 'user-defined', 'text', ':', 'with', '‘', 'some', '’', 'stuff', '.', 'And', 'another', '.', '-', 'too', ',', '2011', '-', 'ᖑᑎᓪᓗᒍ', '.', 'again', '.']);
    expect(doc.orthographicWords).toEqual(['There', 's', 'a', 'user-defined', 'text', 'with', 'some', 'stuff', 'And', 'another', 'too', '2011', 'ᖑᑎᓪᓗᒍ', 'again']);
    // expect(doc.tokenizeOnTheseRegExp.toString()).toEqual('/[!-,.-/:-@[-`{-~〱-〵゛゜゠ーｰ\s]+/');
    // expect(doc.wordExternalPunctuationRegExp.toString()).toEqual('/(^[-\'\u2000-\u206F]+|[-\'\u2000-\u206F]+$)/');
  });

  it('should create an array of tokens (words and symbols word boundary morphemes) on white space', function() {
    var doc = Tokenizer.tokenizeInput({
      orthography: 'nospaceshere',
      wordBoundaryMorphemes: ['s']
    });
    expect(doc.orthographyArray).toEqual(['no', 's', 'pace', 's', 'here']);
  });

  it('should tokenize obvious punctionation in a word', function() {
    var doc = Tokenizer.tokenizeInput({
      orthography: ''
    });
    expect(doc.orthographyArray).toEqual([]);
  });

  it('should permit the user to define cleaning re-write rules prior to tokenization', function() {
    var doc = Tokenizer.tokenizeInput({
      orthography: 'This has AAA rewrite rules.',
      userDefinedCleaningReWriteRules: [{
        source: 'AAA',
        relation: 'isCleanedAs',
        target: 'BBB'
      }]
    });
    expect(doc.orthographicWords).toEqual(['This', 'has', 'BBB', 'rewrite', 'rules']);
  });

});
