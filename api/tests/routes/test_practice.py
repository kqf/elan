import app.models as users


def test_retrieves_users(client, headers):
    response = client.get(
        "/practice/1", headers=headers, follow_redirects=True
    )
    assert response.status_code == 200
