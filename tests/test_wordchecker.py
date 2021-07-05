import json
import pytest
import tempfile

from legacy.words import WordsChecker
from unittest.mock import patch


@pytest.fixture
def infile():
    data = {
        "Chapter1": {
            "words": {
                "aaa": "xxx",
            }
        }
    }
    with tempfile.NamedTemporaryFile() as tmp:
        with open(tmp.name, 'w') as outfile:
            json.dump(data, outfile)
        yield tmp.name


@patch("legacy.words.input", return_value="aaa")
def test_checks_words(input, infile):
    checker = WordsChecker(infile, "Chapter1", {"word": ""})
    checker.check("words")
