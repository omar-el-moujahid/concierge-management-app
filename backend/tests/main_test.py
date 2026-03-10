import sys
import os
from fastapi.testclient import TestClient

sys.path.append(os.path.dirname(os.path.dirname(__file__)))
print(sys.path)
from main import app

client = TestClient(app)

def test_root():
    response = client.get("/docs")
    assert response.status_code == 200


# Test de la route pour récupérer les clients
def test_get_clients():
    response = client.get("/clients")
    assert response.status_code == 200
    print(response.json()[0])
    