import os
import json
import unittest
import pytest
from elan.words import WordsChecker


class TestWordsChecker(unittest.TestCase):

    def setUp(self):
        self.file = 'testfile.json'
        data = {
            "Chapter1": {
                "words": {
                    "aaa": "xxx",
                    "bbb": "yyy"
                }
            }
        }

        with open(self.file, 'w') as outfile:
            json.dump(data, outfile)

    @pytest.mark.skip("Fix the test logic")
    def test_checks_words(self):
        checker = WordsChecker(self.file, "Chapter1", {"word": ""})
        checker.test_words()

    def tearDown(self):
        os.remove(self.file)
