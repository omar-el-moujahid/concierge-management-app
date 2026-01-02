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
from models.commande import Commande
from models.detailsCommande import DetailsCommande
from sqlalchemy.orm import selectinload

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Conciergerie API running"}

@app.get("/clients")
async def list_clients(db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(select(Client).order_by(Client.id_client))
    clients = result.scalars().all()
    return clients
# @app.get("/clients")
# async def list_clients(db: AsyncSession = Depends(get_async_session)):
#     result = await db.execute(select(Client).order_by(Client.id_client))
#     for client in result.scalars():
#         result_contact = await db.execute(
#             select(Contact).where(Contact.id_client == client.id_client)
#         )
#         contact = result_contact.scalars().first()
#         if contact:
#             result_telephones = await db.execute(
#                 select(Telephone).where(Telephone.id_contact == contact.id_contact)
#             )
#             telephones = result_telephones.scalars().all()
#             contact.telephones = telephones
#             client.contact = contact

#     clients = result.scalars().all()
#     return clients

@app.post("/clients")
async def create_client(data: dict, db: AsyncSession = Depends(get_async_session)):
    client = Client(**data)
    db.add(client)
    await db.commit()
    await db.refresh(client)
    return client


@app.get("/clients")
async def list_clients(db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(
        select(Client).options(
            selectinload(Client.contact)
            .selectinload(Contact.telephones),
            selectinload(Client.cartes),
            selectinload(Client.commandes)
        )
    )
    return result.scalars().all()


@app.delete("/clients/{client_id}")
async def delete_client(client_id: int, db: AsyncSession = Depends(get_async_session)):
    client = await db.get(Client, client_id)
    if not client:
        raise HTTPException(404)
    await db.delete(client)
    await db.commit()
    return {"deleted": True}

# ======================================================
# CONTACT CRUD (lié à CLIENT)
# ======================================================

@app.post("/clients/{client_id}/contact")
async def create_contact(client_id: int, data: dict, db: AsyncSession = Depends(get_async_session)):
    contact = Contact(**data, id_client=client_id)
    db.add(contact)
    await db.commit()
    await db.refresh(contact)
    return contact


@app.delete("/contacts/{contact_id}")
async def delete_contact(contact_id: int, db: AsyncSession = Depends(get_async_session)):
    contact = await db.get(Contact, contact_id)
    if not contact:
        raise HTTPException(404)
    await db.delete(contact)
    await db.commit()
    return {"deleted": True}

# ======================================================
# TELEPHONE CRUD (lié à CONTACT)
# ======================================================

@app.post("/contacts/{contact_id}/telephones")
async def create_telephone(contact_id: int, data: dict, db: AsyncSession = Depends(get_async_session)):
    tel = Telephone(**data, id_contact=contact_id)
    db.add(tel)
    await db.commit()
    await db.refresh(tel)
    return tel


@app.delete("/telephones/{telephone_id}")
async def delete_telephone(telephone_id: int, db: AsyncSession = Depends(get_async_session)):
    tel = await db.get(Telephone, telephone_id)
    if not tel:
        raise HTTPException(404)
    await db.delete(tel)
    await db.commit()
    return {"deleted": True}

# ======================================================
# MEMBERSHIP CRUD
# ======================================================

@app.post("/memberships")
async def create_membership(data: dict, db: AsyncSession = Depends(get_async_session)):
    membership = Membership(**data)
    db.add(membership)
    await db.commit()
    await db.refresh(membership)
    return membership


@app.get("/memberships")
async def list_memberships(db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(
        select(Membership).options(selectinload(Membership.cartes))
    )
    return result.scalars().all()

# ======================================================
# CARTE FIDELITE CRUD (lié à CLIENT + MEMBERSHIP)
# ======================================================

@app.post("/clients/{client_id}/cartes")
async def create_carte(client_id: int, data: dict, db: AsyncSession = Depends(get_async_session)):
    carte = CartFidelite(**data, id_client=client_id)
    db.add(carte)
    await db.commit()
    await db.refresh(carte)
    return carte


@app.delete("/cartes/{carte_id}")
async def delete_carte(carte_id: int, db: AsyncSession = Depends(get_async_session)):
    carte = await db.get(CartFidelite, carte_id)
    if not carte:
        raise HTTPException(404)
    await db.delete(carte)
    await db.commit()
    return {"deleted": True}

# ======================================================
# PRODUIT CRUD + CATEGORIE
# ======================================================

@app.post("/produits")
async def create_produit(data: dict, db: AsyncSession = Depends(get_async_session)):
    produit = Produit(**data)
    db.add(produit)
    await db.commit()
    await db.refresh(produit)
    return produit


@app.get("/produits")
async def list_produits(db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(select(Produit))
    return result.scalars().all()

# ======================================================
# COMMANDE CRUD (lié à CLIENT)
# ======================================================

@app.post("/clients/{client_id}/commandes")
async def create_commande(client_id: int, data: dict, db: AsyncSession = Depends(get_async_session)):
    commande = Commande(**data, id_client=client_id)
    db.add(commande)
    await db.commit()
    await db.refresh(commande)
    return commande


@app.get("/commandes/{commande_id}")
async def get_commande(commande_id: int, db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(
        select(Commande)
        .where(Commande.id_commande == commande_id)
        .options(
            selectinload(Commande.details).selectinload(DetailsCommande.produit),
            selectinload(Commande.facture)
        )
    )
    commande = result.scalar_one_or_none()
    if not commande:
        raise HTTPException(404)
    return commande


@app.delete("/commandes/{commande_id}")
async def delete_commande(commande_id: int, db: AsyncSession = Depends(get_async_session)):
    commande = await db.get(Commande, commande_id)
    if not commande:
        raise HTTPException(404)
    await db.delete(commande)
    await db.commit()
    return {"deleted": True}

# ======================================================
# DETAILS COMMANDE CRUD (lié à COMMANDE + PRODUIT)
# ======================================================

@app.post("/commandes/{commande_id}/details")
async def add_detail_commande(commande_id: int, data: dict, db: AsyncSession = Depends(get_async_session)):
    detail = DetailsCommande(**data, id_commande=commande_id)
    db.add(detail)
    await db.commit()
    await db.refresh(detail)
    return detail


@app.delete("/details/{detail_id}")
async def delete_detail(detail_id: int, db: AsyncSession = Depends(get_async_session)):
    detail = await db.get(DetailsCommande, detail_id)
    if not detail:
        raise HTTPException(404)
    await db.delete(detail)
    await db.commit()
    return {"deleted": True}

# ======================================================
# FACTURE CRUD (lié à COMMANDE)
# ======================================================

@app.post("/commandes/{commande_id}/facture")
async def create_facture(commande_id: int, data: dict, db: AsyncSession = Depends(get_async_session)):
    facture = Facture(**data, id_commande=commande_id)
    db.add(facture)
    await db.commit()
    await db.refresh(facture)
    return facture


@app.get("/factures/{facture_id}")
async def get_facture(facture_id: int, db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(
        select(Facture)
        .where(Facture.id_facture == facture_id)
        .options(selectinload(Facture.paiements))
    )
    facture = result.scalar_one_or_none()
    if not facture:
        raise HTTPException(404)
    return facture

# ======================================================
# PAIEMENT CRUD (lié à FACTURE)
# ======================================================

@app.post("/factures/{facture_id}/paiements")
async def create_paiement(facture_id: int, data: dict, db: AsyncSession = Depends(get_async_session)):
    paiement = Paiement(**data, id_facture=facture_id)
    db.add(paiement)
    await db.commit()
    await db.refresh(paiement)
    return paiement


@app.delete("/paiements/{paiement_id}")
async def delete_paiement(paiement_id: int, db: AsyncSession = Depends(get_async_session)):
    paiement = await db.get(Paiement, paiement_id)
    if not paiement:
        raise HTTPException(404)
    await db.delete(paiement)
    await db.commit()
    return {"deleted": True}