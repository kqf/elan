.PHYONY: words verbs

words:
	elan/./elan.py "Lesson 1" --words --gui examples/vocabulary.json

verbs:
	elan/./elan.py "Lesson 1" --verbs --gui examples/vocabulary.json
