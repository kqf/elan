import click
from elan.words import WordsChecker


@click.command()
@click.option("--infile", type=click.Path(exists=True))
@click.option("--mode", type=click.Choice(["gui", "cli"]), default="cli")
@click.option("--lesson", type=str)
@click.option("--objective", type=str)
def main(infile, mode, lesson, objective):
    if mode == "gui":
        from ui import gui
        gui(infile, lesson, objective)
        return

    w = WordsChecker(infile, lesson, objective)
    w.check()


if __name__ == '__main__':
    main()
