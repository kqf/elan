import json


def read_file(filename, chapter, vtype):
    with open(filename) as f:
        data = json.load(f)

    vocabulary = {}

    for c in data:
        if chapter in c:
            vocabulary.update(data[c][vtype])

    if 'words' in vtype:
        return vocabulary

    # Fix the issue with muptiple keys
    verbs = {
        vocabulary[k][w]: k + '.\n' + w + ' ... '
        for k in vocabulary for w in vocabulary[k]
    }
    return verbs


class WordsChecker(object):
    _char_mapper = dict(zip(u"éàèùâêîôûç", "eaeuaeiouc"))

    def __init__(self, filename, chapter, option, strict=False):
        super(WordsChecker, self).__init__()
        self.filename = filename
        self.chapter = chapter
        self.option = option
        # Get Default Method
        self.comp = self.compare_strict if strict else self.compare_normal

    def check_dictionary(self, wdict):
        weak_words = {}
        for foreign, native in wdict.items():
            suggestion = input(f'Type in translation for:\n{native}')
            if suggestion != foreign:
                weak_words[foreign] = native
        return weak_words

    def check(self, option):
        self.vocabulary = read_file(self.filename, self.chapter, option)
        self.stack = self.vocabulary.keys()
        test_words = self.vocabulary
        while test_words:
            test_words = self.check_dictionary(test_words)
        # if weak_words: print 'List ouf your weak words:'
        # for k in weak_words: print k
        print('Congrats! Your training is over')

    def compare_normal(self, foreign, translation):
        # zip(u"éàèùâêîôûç", "eaeuaeiouc")

        fr = (u"".join(foreign)).translate(self._char_mapper)
        tr = (u"".join(translation)).translate(self._char_mapper)

        print(tr, fr)
        return fr.lower() == tr.lower()

    def compare_strict(self, foreign, translation):
        return foreign == translation

    def interactive(self, q, a, c, s):
        if not self.vocabulary:
            return

        foreign, native = self.stack[0], self.vocabulary[self.stack[0]]

        suggestion = a.get()
        if not self.comp(foreign, suggestion):
            c.set(foreign)
            s.set(suggestion)
            self.stack.append(foreign)
        else:
            self.stack.pop(0)
            c.set('')
            s.set('')

        if not self.stack:
            q.set("That's all")
            a.set("Congrats, you've finished it!")
            c.set("Bye!!")
            return

        foreign, native = self.stack[0], self.vocabulary[self.stack[0]]
        q.set(native)
        a.set('')
