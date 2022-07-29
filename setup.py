from setuptools import find_packages, setup

setup(
    name="elan",
    version="0.0.1",
    packages=find_packages(),
    entry_points={
        "console_scripts": [
            "elan=app.config:main",
        ],
    },
)
