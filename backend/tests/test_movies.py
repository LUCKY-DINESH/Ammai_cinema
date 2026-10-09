from app.schemas.movie import MovieCreate

def test_movie_schema_validation():
    movie_data = {
        "title": "Test Cinema",
        "slug": "test-cinema",
        "description": "Testing cinema description",
        "genre": ["Action", "Drama"],
        "language": "Tamil",
        "duration": 120,
        "status": "now_showing",
        "rating": 9.2
    }
    movie = MovieCreate(**movie_data)
    assert movie.title == "Test Cinema"
    assert movie.duration == 120
    assert "Action" in movie.genre
