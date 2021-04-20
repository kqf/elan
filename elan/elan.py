import sys

from ui import gui, cmline


def needs_file(argv):
    for f in argv:
        if '.json' in f:
            return f


def main():
    infile = needs_file(sys.argv)
    print(infile)
    msg = "You should specify the path to a .json file with your vocabulary"

    if not infile:
        raise IOError(msg)

    if 'gui' not in ''.join(sys.argv):
        cmline(infile, sys.argv[1], sys.argv[2])
        return

    gui(infile, sys.argv[1], sys.argv[2])


if __name__ == '__main__':
    main()
