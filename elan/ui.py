from words import WordsChecker
from tkinter import *
from tkinter import ttk

   
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
