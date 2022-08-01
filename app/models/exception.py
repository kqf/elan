import functools
from typing import Any

from flask import request


class ValidationError(ValueError):
    ...


def response_requires_fields(*fields):
    def decorator(f):
        @functools.wraps(f)
        def wrapper(*args, **kwargs):
            data: dict[str, str] | Any = request.json
            if missing := ",".join(a for a in fields if a not in data):
                raise ValidationError(
                    f"Missing fields detected {missing}. Got {data}"
                )
            return f(*args, **kwargs)

        return wrapper

    return decorator
