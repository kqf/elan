#!/usr/bin/python
# coding=utf-8

from random import choice
import json

# TODO: check version?
import string 


class WordsChecker(object):
	def __init__(self, filename, chapter, option, strict = False):
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
		print self.symbols_table



	def convert_for_verbs(self):
		if 'word' in self.option:
			return

		# Fix the issue with muptiple keys
		res = {self.vocabulary[k][w] : k  + '.\n' + w + ' ... ' for k in self.vocabulary for w in self.vocabulary[k]}

		# This is a version to debug
		# res = {}
		# for k in self.vocabulary:
		# 	print k
		# 	for w in self.vocabulary[k]:
		# 		print self.vocabulary[k][w]
		# 		res.update({self.vocabulary[k][w]: k  + '.\n' + w + ' ... ' })

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
		for foreign, native in wdict.iteritems():
			suggestion = raw_input('Type in translation for ' + native + ' : ')
			if suggestion != foreign: weak_words[foreign] = native
		return weak_words

	def test_words(self):
		test_words = self.vocabulary
		while test_words:
			test_words = self.test_dictionary(test_words)

		# if weak_words: print 'List ouf your weak words:'
		# for k in weak_words: print k
		print 'Congrats! Your training is over'

	def compare_normal(self, foreign, translation):
		# zip(u"éàèùâêîôûç", "eaeuaeiouc")

		fr = (u"".join(foreign)).translate(self.symbols_table)
		tr = (u"".join(translation)).translate(self.symbols_table)

		print tr, fr
		return fr.lower() == tr.lower()


	def compare_strict(self, foreign, translation):
		return foreign == translation


	def interactive(self, q, a, c, s):
		if not self.vocabulary: return

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

from Tkinter import *
import ttk
   
def gui(infile, chapter, option):
	root = Tk()
	root.title("Train your brain")

	mainframe = ttk.Frame(root, padding="3 3 12 12")
	mainframe.grid(column=0, row=0, sticky=(N, W, E, S))
	mainframe.columnconfigure(0, weight=1)
	mainframe.rowconfigure(0, weight=1)

	w = WordsChecker(infile, chapter, option)
	if not w.vocabulary: 
		print 'Empty file:' + infile + ' !'
		return

	question = StringVar()
	question.set(w.vocabulary[w.stack[0]])
	answer   = StringVar()
	correct  = StringVar()
	suggestion  = StringVar()

	process_word = lambda *args:  w.interactive(question, answer, correct, suggestion)

	ttk.Label(mainframe, text="Please translate: ").grid(column=1, row=1, sticky=E)
	ttk.Label(mainframe, textvariable=question).grid(column=2, row=1, sticky=(W, E))
	main_entry = ttk.Entry(mainframe, width=38, textvariable=answer)
	main_entry.grid(column=2, row=2, sticky=(W, E))

	ttk.Button(mainframe, text="Check", command=process_word).grid(column=3, row=4, sticky=W)

	ttk.Label(mainframe, text="Correct answer: ").grid(column=1, row=3, sticky=E)
	ttk.Label(mainframe, textvariable=correct).grid(column=2, row=3, sticky=(W, E))

	ttk.Label(mainframe, text="Your suggestion: ").grid(column=1, row=4, sticky=E)
	ttk.Label(mainframe, textvariable=suggestion).grid(column=2, row=4, sticky=(W, E))


	for child in mainframe.winfo_children(): child.grid_configure(padx=5, pady=5)

	root.bind('<Return>', process_word)

	root.attributes("-topmost", True)
	main_entry.focus()
	root.mainloop()


def cmline(infile, chapter):
	w = WordsChecker(infile, chapter)
	w.test_words()

def needs_file(argv):
	for f in argv:
		if '.json' in f: 
			return f

import sys
def main():
	infile = needs_file(sys.argv)
	print infile
	assert infile, "You should specify the path to a .json file with your vocabulary"
	if 'gui' not in ''.join(sys.argv):
		cmline(infile, sys.argv[1], sys.argv[2])
		return
	gui(infile, sys.argv[1], sys.argv[2])



if __name__ == '__main__':
	main()