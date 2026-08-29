class Product:
    def __init__(
        self,
        id=None,
        name=None,
        description=None,
        price=None,
        stock=None,
        category=None,
        image_url=None,
        created_at=None,
        updated_at=None
    ):
        self.id = id
        self.name = name
        self.description = description
        self.price = price
        self.stock = stock
        self.category = category
        self.image_url = image_url
        self.created_at = created_at
        self.updated_at = updated_at

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "price": float(self.price) if self.price is not None else None,
            "stock": self.stock,
            "category": self.category,
            "image_url": self.image_url,
            "created_at": (
                self.created_at.isoformat()
                if self.created_at else None
            ),
            "updated_at": (
                self.updated_at.isoformat()
                if self.updated_at else None
            )
        }