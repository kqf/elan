#!/usr/bin/python
# coding=utf-8

import json

from ui import gui, cmline

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