import click

from ui import gui, cmline


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
