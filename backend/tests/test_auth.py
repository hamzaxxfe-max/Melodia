import pytest

@pytest.mark.asyncio
async def test_register(client):
    r = await client.post("/api/auth/register", json={"username": "testuser", "email": "test@test.com", "password": "test123"})
    assert r.status_code == 200
    data = r.json()
    assert "access_token" in data
    assert data["username"] == "testuser"

@pytest.mark.asyncio
async def test_register_duplicate(client):
    await client.post("/api/auth/register", json={"username": "dup", "email": "dup@test.com", "password": "test123"})
    r = await client.post("/api/auth/register", json={"username": "dup", "email": "other@test.com", "password": "test123"})
    assert r.status_code == 400

@pytest.mark.asyncio
async def test_login(client):
    await client.post("/api/auth/register", json={"username": "loginuser", "email": "login@test.com", "password": "pass123"})
    r = await client.post("/api/auth/login", json={"username": "loginuser", "password": "pass123"})
    assert r.status_code == 200
    assert r.json()["username"] == "loginuser"

@pytest.mark.asyncio
async def test_login_wrong_password(client):
    await client.post("/api/auth/register", json={"username": "failuser", "email": "fail@test.com", "password": "correct"})
    r = await client.post("/api/auth/login", json={"username": "failuser", "password": "wrong"})
    assert r.status_code == 401
