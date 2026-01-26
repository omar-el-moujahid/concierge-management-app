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
from sqlalchemy import select
from models.produit import Produit
from models.facture import Facture
from fastapi.responses import StreamingResponse
from openpyxl import Workbook
import io
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
@router.get("/commandes/liste/summary/{id_client}")
async def list_cmd_summary_by_client(
    id_client: int,
    db: AsyncSession = Depends(get_async_session)
):
    result = await db.execute(
        select(Commande)
        .where(Commande.id_client == id_client)
        .options(
            selectinload(Commande.client)
                .selectinload(Client.contact)
                .selectinload(Contact.telephones),

            selectinload(Commande.details)
                .selectinload(DetailsCommande.produit),

            selectinload(Commande.facture)
                .selectinload(Facture.paiements)
        )
    )

    return result.scalars().all()

@router.get("/commandes/summary")
async def list_cmd_summary(
    db: AsyncSession = Depends(get_async_session)
):
    result = await db.execute(
        select(Commande)
        .options(
            selectinload(Commande.client)
                .selectinload(Client.contact)
                .selectinload(Contact.telephones),

            selectinload(Commande.details)
                .selectinload(DetailsCommande.produit),

            selectinload(Commande.facture)
                .selectinload(Facture.paiements)
        )
    )

    return result.scalars().all()


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
    print(commande_data.model_dump())
    new_commande = Commande(
        date_commande = commande_data.date_commande,
        date_arriver = commande_data.date_arriver,
        status = commande_data.status,
        note = commande_data.note,
        id_client = commande_data.id_client
    )

    db.add(new_commande)
    await db.commit()
    await db.refresh(new_commande)

    for detail in commande_data.detailscommande:
        db.add(DetailsCommande(
            id_commande = new_commande.id_commande,
            id_produit = detail.id_produit,
            prix_catalogue = detail.prix_catalogue,
            prix_applique = detail.prix_applique,
            quantite = detail.quantite,
            remise = detail.remise
        ))

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

@router.get("/commandes/export/excel")
async def export_commandes_excel(db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(
        select(Commande)
        .options(
            selectinload(Commande.client),
            selectinload(Commande.details),
            selectinload(Commande.facture)
        )
    )
    commandes = result.scalars().all()

    wb = Workbook()
    ws = wb.active
    ws.title = "Commandes"

    ws.append([
        "ID Commande",
        "Client",
        "Date commande",
        "Statut",
        "Nombre d’articles",
        "Total"
    ])

    # 🔹 Données
    for cmd in commandes:
        ws.append([
            cmd.id_commande,
            f"{cmd.client.prenom_client} {cmd.client.nom_client}" if cmd.client else "",
            cmd.date_commande.strftime("%Y-%m-%d") if cmd.date_commande else "",
            cmd.status.value if cmd.status else "",
            len(cmd.details) if cmd.details else 0,
            cmd.facture.montant_total if cmd.facture else 0
        ])

    stream = io.BytesIO()
    wb.save(stream)
    stream.seek(0)

    return StreamingResponse(
        stream,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={
            "Content-Disposition": "attachment; filename=commandes.xlsx"
        }
    )
