from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_async_session
from models.client import Client
from models.contact import Contact
from models.telephone import Telephone
from models.cart_fedelite import CartFidelite
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy import select, func
from models.commande import Commande
from models.detailsCommande import DetailsCommande
from pydantic import BaseModel
from typing import Optional
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


@router.get("/clients/total-spent")
async def total_spent(db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(
        select(
            Client.id_client,
            func.coalesce(
                func.sum(
                    (DetailsCommande.prix_applique * DetailsCommande.quantite)
                    - DetailsCommande.remise
                ),
                0
            ).label("total_spent")
        )
        .outerjoin(Commande, Commande.id_client == Client.id_client)
        .outerjoin(DetailsCommande, DetailsCommande.id_commande == Commande.id_commande)
        .group_by(Client.id_client)
    )

    return [
        {
            "id_client": r.id_client,
            "total_spent": float(r.total_spent)
        }
        for r in result
    ]
@router.get("/clients/summary")
async def clients_summary(db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(
        select(
            Client.id_client,
            func.count(func.distinct(Commande.id_commande)).label("orders_count"),
            func.coalesce(
                func.sum(
                    (DetailsCommande.prix_applique * DetailsCommande.quantite)
                    - DetailsCommande.remise
                ),
                0
            ).label("total_spent")
        )
        .outerjoin(Commande, Commande.id_client == Client.id_client)
        .outerjoin(DetailsCommande, DetailsCommande.id_commande == Commande.id_commande)
        .group_by(Client.id_client)
    )

    return [
        {
            "id_client": r.id_client,
            "orders_count": r.orders_count,
            "total_spent": float(r.total_spent)
        }
        for r in result
    ]


@router.get("/clients/totalSpent")
async def total_spent(db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(
        select(
            Client.id_client,
            func.coalesce(
                func.sum(
                    (DetailsCommande.prix_applique * DetailsCommande.quantite)
                    - DetailsCommande.remise
                ),
                0
            ).label("total_spent")
        )
        .join(Commande, Commande.id_client == Client.id_client)
        .join(DetailsCommande, DetailsCommande.id_commande == Commande.id_commande)
        .group_by(Client.id_client)
    )

    return [
        {
            "id_client": row.id_client,
            "total_spent": float(row.total_spent)
        }
        for row in result
    ]

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
    await db.execute(select(CartFidelite).where(CartFidelite.client_id == client_id))

    # Finally, delete the client
    await db.delete(client)
    await db.commit()


    return {"detail": "Client and related data deleted successfully"}

# nouveau code

class ClientUpdate(BaseModel):
    nom_client: Optional[str] = None
    prenom_client: Optional[str] = None

@router.patch("/clients/{client.id}")
async def update_client(client_id: int, client_data: ClientUpdate, db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(select(Client).where(Client.id_client == client_id))

    client = result.scalar_one_or_none()

    if client is None:
        raise HTTPException(status_code=404, detail="Client not found")

    for key, value in client_data.model_dump(exclude_unset = True).items():
        setattr(client, key, value)

    await db.commit()
    await db.refresh(client)

    return client

@router.patch("/clients/{client.id}/membership")
async def upgrade_membership(client_id: int, new_membership: int, db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(select(CartFidelite).where(CartFidelite.id_client == client_id))

    client = result.scalar_one_or_none()

    if client is None:
        raise HTTPException(status_code=404, detail="Client not found")
    
    setattr(client, "id_membership", new_membership)

    await db.commit()
    await db.refresh(client)

    return client