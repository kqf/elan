import json
import pytest
import tempfile

from elan.words import WordsChecker


@pytest.fixture
def infile():
    data = {
        "Chapter1": {
            "words": {
                "aaa": "xxx",
                "bbb": "yyy"
            }
        }
    }
    with tempfile.NamedTemporaryFile() as tmp:
        with open(tmp, 'w') as outfile:
            json.dump(data, outfile)
        yield tmp


@pytest.mark.skip("Fix the test logic")
def test_checks_words(self):
    checker = WordsChecker(self.file, "Chapter1", {"word": ""})
    checker.test_words()
