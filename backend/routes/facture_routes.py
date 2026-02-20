from fastapi import APIRouter, Depends, HTTPException
from datetime import date
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_async_session
from models.facture import Facture
from sqlalchemy.future import select, sum
from sqlalchemy.orm import selectinload
from models.commande import Commande
from sqlalchemy import select, func, delete
from pydantic import BaseModel
from typing import Optional
from decimal import Decimal
from pydantic import condecimal
from typing import List
router = APIRouter()

class FactureCreate(BaseModel):
    date_facture: Optional[date] = None
    montant_commande: Decimal = condecimal(max_digits=10, decimal_places=2)
    frais_service: Decimal = condecimal(max_digits=10, decimal_places=2)
    frais_livraison: Decimal = condecimal(max_digits=10, decimal_places=2)
    remise: Decimal = condecimal(max_digits=10, decimal_places=2)
    montant_total: Decimal = condecimal(max_digits=10, decimal_places=2)

@router.get("/factures")
async def list_factures(db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(
        select(Facture)
        .order_by(Facture.id_facture)
    )
    factures = result.scalars().all()
    return factures

@router.get("/factures/{facture_id}")
async def get_facture(facture_id: int, db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(
        select(Facture)
        .where(Facture.id_facture == facture_id)
    )
    facture = result.scalar_one_or_none()

    if facture is None:
        raise HTTPException(status_code=404, detail="Client not found")

    return facture

@router.get("/factures/client/{id_client}")
async def get_facture_client(id_client: int, db: AsyncSession = Depends(get_async_session)):
    subq = (select(Commande.id_facture).where(Commande.id_client == id_client).scalar_subquery())
    result = await db.execute(select(Facture).where(Facture.id_facture == subq).order_by(Facture.id_facture))
    factures = result.scalars().all()
    return factures

@router.post("/factures")
async def create_facture(facture_data: FactureCreate, db: AsyncSession = Depends(get_async_session)):
    new_facture = Facture(
        date_facture = facture_data.date_facture,
        montant_commande = facture_data.montant_commande,
        frais_service = facture_data.frais_service,
        frais_livraison = facture_data.frais_livraison,
        remise = facture_data.remise,
        montant_total = facture_data.montant_total
    )
    db.add(new_facture)
    await db.commit()
    await db.refresh(new_facture)
    return new_facture

@router.patch("/factures/montanttotal/{facture_id}")
async def calcul_facture(facture_id: int, db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(select(Facture).where(Facture.id_facture == facture_id))

    facture = result.scalar_one_or_none()

    if facture is None:
        raise HTTPException(status_code=404, detail="Client not found")

    setattr(facture, "montant_total", facture.montant_commande + facture.frais_livraison + facture.frais_service - facture.remise)

    await db.commit()
    await db.refresh(facture)

    return facture

@router.delete("/factures/{facture_id}")
async def delete_facture(facture_id: int, db: AsyncSession = Depends(get_async_session)):
    await db.execute(delete(Facture).where(Facture.id_facture == facture_id))
    await db.commit()

    return {"detail": "Client and related data deleted successfully"}

@router.patch("/factures/{facture_id}")
async def update_facture(facture_id: int, facture_data: dict, db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(select(Facture).where(Facture.id_facture == facture_id))

    facture = result.scalar_one_or_none()

    if facture is None:
        raise HTTPException(status_code=404, detail="Client not found")

    for key, value in facture_data.model_dump(exclude_unset = True).items():
        setattr(facture, key, value)

    await db.commit()
    await db.refresh(facture)

    return facture
