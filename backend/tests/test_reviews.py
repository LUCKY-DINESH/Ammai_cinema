from app.schemas.review import ReviewCreate
import pytest

def test_review_rating_bounds():
    valid = ReviewCreate(rating=8, comment="Great movie!")
    assert valid.rating == 8

    with pytest.raises(Exception):
        ReviewCreate(rating=15, comment="Invalid rating out of bounds")

    with pytest.raises(Exception):
        ReviewCreate(rating=0, comment="Invalid rating out of bounds")
