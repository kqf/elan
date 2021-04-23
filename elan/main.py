import click

from ui import gui, cmline


def needs_file(argv):
    for f in argv:
        if '.json' in f:
            return f


"""
Usage:

words:
    elan/./elan.py "Lesson 1" --words --gui examples/vocabulary.json

verbs:
    elan/./elan.py "Lesson 1" --verbs --gui examples/vocabulary.json

.PHONY: words verbs
"""


@click.command()
@click.option("--infile", type=click.Path(exists=True))
@click.option("--mode", type=click.Choice(["gui", "cli"]), default="cli")
@click.option("--lesson", type=str)
@click.option("--objective", type=str)
def main(infile, mode, lesson, objective):
    if mode == "cli":
        cmline(infile, lesson, objective)
        return

    gui(infile, lesson, objective)


if __name__ == '__main__':
    main()
