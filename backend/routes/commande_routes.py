from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_async_session
from models.client import Client
from models.contact import Contact
from models.telephone import Telephone
from models.commande import Commande
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
router = APIRouter()

@router.get("/commandes/{id_client}")
async def list_commandes(id_client: int, db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(
        select(Commande)
        .options(
            selectinload(Commande.client)
            .selectinload(Client.contact)
            .selectinload(Contact.telephones)
        ).where(Commande.id_client == id_client)
    )
    commandes = result.scalars().all()
    return commandes

@router.get("/commandes")
async def list_commandes( db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(
        select(Commande)
        .options(
            selectinload(Commande.client)
            .selectinload(Client.contact)
            .selectinload(Contact.telephones)
        )
    )
    commandes = result.scalars().all()
    return commandes