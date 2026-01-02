import enum
class StatusCommande(enum.Enum):
    to_buy = "to_buy"
    bought = "bought"
    packed = "packed"
    shipped = "shipped"
    arrived = "arrived"
    delivered = "delivered"
    done = "done"


class StatusProduit(enum.Enum):
    in_stock = "in_stock"
    available = "available"
    not_available = "not_available"
    out_of_stock = "out_of_stock"
    free_gift = "free_gift"
    packed = "packed"
    dispatched = "dispatched"
    arrived = "arrived"
    delivered = "delivered"
    other = "other"
