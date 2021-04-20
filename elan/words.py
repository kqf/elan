import json


class WordsChecker(object):
    def __init__(self, filename, chapter, option, strict=False):
        super(WordsChecker, self).__init__()
        self.option = option
        self.vocabulary = []
        self.vtype = 'words' if 'word' in self.option else 'verbs'
        self.read_file(filename, chapter)
        # For interactive mode
        # TODO: try to avoid this
        self.stack = self.vocabulary.keys()
        # Get Default Method
        self.comp = self.compare_strict if strict else self.compare_normal

        self.symbols_table = dict(zip(u"éàèùâêîôûç", "eaeuaeiouc"))
        # self.symbols_table = dict(zip(map(ord, u"éàèùâêîôûç"), "eaeuaeiouc"))
        print(self.symbols_table)

    def convert_for_verbs(self):
        if 'word' in self.option:
            return

        # Fix the issue with muptiple keys
        res = {
            self.vocabulary[k][w]: k + '.\n' + w + ' ... '
            for k in self.vocabulary for w in self.vocabulary[k]
        }

        # This is a version to debug
        # res = {}
        # for k in self.vocabulary:
        #   print k
        #   for w in self.vocabulary[k]:
        #       print self.vocabulary[k][w]
        #       res.update({self.vocabulary[k][w]: k  + '.\n' + w + ' ... ' })

        self.vocabulary = res

    def read_file(self, filename, chapter):
        with open(filename) as f:
            data = json.load(f)

        self.vocabulary = {}

        for c in data:
            if chapter in c:
                self.vocabulary.update(data[c][self.vtype])

        self.convert_for_verbs()

    def test_dictionary(self, wdict):
        weak_words = {}
        for foreign, native in wdict.items():
            suggestion = input(f'Type in translation for:\n{native}')
            if suggestion != foreign:
                weak_words[foreign] = native
        return weak_words

    def test_words(self):
        test_words = self.vocabulary
        while test_words:
            test_words = self.test_dictionary(test_words)

        # if weak_words: print 'List ouf your weak words:'
        # for k in weak_words: print k
        print('Congrats! Your training is over')

    def compare_normal(self, foreign, translation):
        # zip(u"éàèùâêîôûç", "eaeuaeiouc")

        fr = (u"".join(foreign)).translate(self.symbols_table)
        tr = (u"".join(translation)).translate(self.symbols_table)

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

        # print self.stack

        foreign, native = self.stack[0], self.vocabulary[self.stack[0]]
        q.set(native)
        a.set('')
