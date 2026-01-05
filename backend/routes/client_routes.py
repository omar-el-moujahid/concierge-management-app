from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_async_session
from models.client import Client
from models.contact import Contact
from models.telephone import Telephone
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

router = APIRouter()

@router.get("/clients")
async def list_clients(db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(
        select(Client)
        .options(
            selectinload(Client.contact)
            .selectinload(Contact.telephones),
            selectinload(Client.cartes)  # Eagerly load cartes
        )
        .order_by(Client.id_client)
    )
    clients = result.scalars().all()
    return clients

@router.get("/clients/{client_id}")
async def get_client(client_id: int, db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(
        select(Client)
        .options(
            selectinload(Client.contact)
            .selectinload(Contact.telephones),
            selectinload(Client.cartes)  
        )
        .where(Client.id_client == client_id)
    )
    client = result.scalar_one_or_none()

    if client is None:
        raise HTTPException(status_code=404, detail="Client not found")

    return client

@router.post("/clients")
async def create_client(client_data: dict, db: AsyncSession = Depends(get_async_session)):
    new_client = Client(
        nom_client=client_data.get("nom_client"),
        prenom_client=client_data.get("prenom_client")
    )
    new_contact = Contact(
        instagram=client_data.get("instagram"),
        facebook=client_data.get("facebook"),
        email=client_data.get("email"),
        adresse_postale=client_data.get("adresse_postale"),
        client=new_client
    )
    new_telephones = []
    for tel in client_data.get("telephones", []):
        new_telephone = Telephone(
            numero=tel.get("numero"),
            type=tel.get("type"),
            contact=new_contact
        )
        new_telephones.append(new_telephone)
    db.add(new_client)
    db.add(new_contact)
    for tel in new_telephones:
        db.add(tel)
    await db.commit()
    await db.refresh(new_client)
    return new_client

@router.delete("/clients/{client_id}")
async def delete_client(client_id: int, db: AsyncSession = Depends(get_async_session)):
    # Fetch the client
    result = await db.execute(select(Client).where(Client.id_client == client_id))
    client = result.scalar_one_or_none()

    if client is None:
        raise HTTPException(status_code=404, detail="Client not found")

    # Delete the related 'contact' and 'cartes'
    await db.execute(select(Contact).where(Contact.id_client == client_id))
    await db.execute(select(Cartes).where(Cartes.client_id == client_id))

    # Finally, delete the client
    await db.delete(client)
    await db.commit()

    return {"detail": "Client and related data deleted successfully"}


