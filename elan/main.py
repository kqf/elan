import click
from elan.words import WordsChecker


@click.command()
@click.option("--infile", type=click.Path(exists=True))
@click.option("--lesson", type=str)
@click.option("--objective", type=str)
def main(infile, mode, lesson, objective):
    w = WordsChecker(infile, lesson)
    w.check(objective)


if __name__ == '__main__':
    main()
