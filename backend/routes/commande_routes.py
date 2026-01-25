from datetime import date
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_async_session
from models.client import Client
from models.contact import Contact
from models.commande import Commande
from models.detailsCommande import DetailsCommande
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from pydantic import BaseModel
from typing import Optional
from decimal import Decimal
from pydantic import condecimal
from typing import List
router = APIRouter()

class DetailsCommandeCreate(BaseModel):
    id_commande: Optional[int] = None
    id_produit: Optional[int] = None
    prix_catalogue: Decimal = condecimal(max_digits=10, decimal_places=2)
    prix_applique: Decimal = condecimal(max_digits=10, decimal_places=2)
    quantite: Optional[int] = None
    remise: Decimal = condecimal(max_digits=5, decimal_places=2)


class CommandeUpdate(BaseModel):
    date_commande: Optional[date] = None
    date_arriver: Optional[date] = None
    status: Optional[str] = None
    note: Optional[str] = None
    id_client: Optional[int] = None

class CommandeCreate(BaseModel):
    date_commande: Optional[date] = None
    date_arriver: Optional[date] = None
    status: Optional[str] = None
    note: Optional[str] = None
    id_client: Optional[int] = None
    detailscommande: List[DetailsCommandeCreate]

@router.get("/commandes/liste/{id_client}")
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

@router.get("/commandes/listestatus/{status}")
async def list_commandes_by_state(status: str, db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(select(Commande).where(Commande.status == status))
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

@router.get("/commande/{id_commande}")
async def get_commande(id_commande: int, db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(select(Commande).where(Commande.id_commande == id_commande))
    commande = result.scalar_one_or_none()

    if commande is None:
        raise HTTPException(status_code=404, detail="Commande not found")

    return commande

@router.post("/commande")
async def create_commande(commande_data: CommandeCreate, db: AsyncSession = Depends(get_async_session)):
    new_commande = Commande(
        date_commande = commande_data.date_commande,
        date_arriver = commande_data.date_arriver,
        status = commande_data.status,
        note = commande_data.note,
        id_client = commande_data.id_client
    )

    new_details_commande = []
    for detail in commande_data.detailscommande:
        new_details_commande.append(DetailsCommande(
            id_commande = detail.id_commande,
            id_produit = detail.id_produit,
            prix_catalogue = detail.prix_catalogue,
            prix_applique = detail.prix_applique,
            quantite = detail.quantite,
            remise = detail.remise
        ))
    db.add(new_commande)
    await db.commit()
    await db.refresh(new_commande)

    return new_commande

@router.delete("/commande/{id_commande}")
async def delete_commande(id_commande: int, db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(select(Commande).where(Commande.id_commande == id_commande))
    commande = result.scalar_one_or_none()
    
    if commande is None:
        raise HTTPException(status_code=404, detail="Commande not found")

    await db.delete(commande)
    await db.commit()

    return {"detail": "Commande and related data deleted successfully"}

@router.patch("/commande/{id_commande}")
async def update_commande(id_commande: int, commande_data: CommandeUpdate, db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(select(Commande).where(Commande.id_commande == id_commande))
    commande = result.scalar_one_or_none()
    
    if commande is None:
        raise HTTPException(status_code=404, detail="Commande not found")

    for key, value in commande_data.model_dump(exclude_unset = True).items():
        setattr(commande, key, value)
    
    await db.commit()
    await db.refresh(commande)

    return commande