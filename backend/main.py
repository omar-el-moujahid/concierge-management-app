from fastapi import FastAPI , Depends
from database import engine, Base
from models import client, contact, telephone, produit, commande, facture, paiement
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_async_session
from models.client import Client
from models.contact import Contact
from models.telephone import Telephone
from models.produit import Produit
from models.commande import Commande
from models.facture import Facture
from models.paiement import Paiement
from models.categorie import Categorie
from models.detailsCommande import DetailsCommande


app = FastAPI()

@app.get("/")
def root():
    return {"message": "Conciergerie API running"}

@app.get("/clients")
async def list_clients(db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(select(Client).order_by(Client.id_client))
    clients = result.scalars().all()
    return clients

