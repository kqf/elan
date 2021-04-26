import click
from elan.words import WordsChecker


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
        w = WordsChecker(infile, lesson)
        w.test_words()
        return

    from ui import gui
    gui(infile, lesson, objective)


if __name__ == '__main__':
    main()
