from .database import SessionLocal, engine
from . import models, auth
import datetime
import random

def seed_data():
    db = SessionLocal()
    try:
        # Delete existing data to avoid unique constraint errors on re-run
        # Child tables first to avoid ForeignKey violations!
        db.query(models.Payment).delete()
        db.query(models.InvoiceItem).delete()
        db.query(models.Invoice).delete()
        db.query(models.Transaction).delete()
        db.query(models.Batch).delete()
        db.query(models.Product).delete()
        db.query(models.Category).delete()
        db.query(models.Customer).delete()
        db.commit()

        # 1. Categories
        electronics = models.Category(name="Electronics")
        groceries = models.Category(name="Groceries")
        pharmacy = models.Category(name="Pharmacy")
        beverages = models.Category(name="Beverages")
        stationery = models.Category(name="Stationery")
        db.add_all([electronics, groceries, pharmacy, beverages, stationery])
        db.commit()

        # 2. Products
        products_data = [
            ("Laptop Pro X", "LPX-001", electronics.id, 1200.00),
            ("Wireless Mouse", "WMS-002", electronics.id, 25.00),
            ("USB-C Hub", "USB-003", electronics.id, 40.00),
            ("Dairy Milk 1L", "DMK-101", groceries.id, 1.50),
            ("Brown Bread", "BBD-102", groceries.id, 2.00),
            ("Greek Yogurt", "GYG-103", groceries.id, 3.50),
            ("Aspirin 500mg", "ASP-202", pharmacy.id, 5.00),
            ("Paracetamol", "PAR-203", pharmacy.id, 3.00),
            ("Vitamin C", "VIT-204", pharmacy.id, 10.00),
            ("Coca Cola 500ml", "COC-301", beverages.id, 1.25),
            ("Orange Juice", "ORJ-302", beverages.id, 2.50),
            ("A4 Notebook", "NBK-401", stationery.id, 3.00),
            ("Gel Pen Set", "PEN-402", stationery.id, 5.00)
        ]
        
        products = []
        for name, sku, cat_id, price in products_data:
            p = models.Product(name=name, sku=sku, category_id=cat_id, price=price)
            db.add(p)
            products.append(p)
        db.commit()

        # 3. Customers
        customers_data = [
            ("John Doe", "1234567890", "john@example.com"),
            ("Jane Smith", "9876543210", "jane@example.com"),
            ("Ishan", "8329909893", "ishan@example.com"),
            ("Shlok Bam", "7974670370", "shlok@example.com"),
            ("Soham", "98881238638", "soham@example.com")
        ]
        
        customers = []
        for name, phone, email in customers_data:
            c = models.Customer(name=name, phone=phone, email=email)
            db.add(c)
            customers.append(c)
        db.commit()

        # 4. Batches & Transactions (Stock IN)
        admin = db.query(models.User).filter(models.User.username == "admin").first()
        admin_id = admin.id if admin else 1
        
        for p in products:
            # Create a batch
            qty = random.randint(30, 100)
            batch = models.Batch(
                product_id=p.id,
                batch_number=f"B-{p.sku}",
                expiry_date=datetime.datetime.utcnow() + datetime.timedelta(days=random.randint(30, 365)),
                quantity=qty
            )
            db.add(batch)
            
            # Stock IN transaction
            t = models.Transaction(product_id=p.id, type="IN", quantity=qty, user_id=admin_id)
            db.add(t)
            
        db.commit()

        # 5. Simulated Sales (Stock OUT) for Revenue
        # Create some sales over the last 7 days
        for i in range(20):
            p = random.choice(products)
            c = random.choice(customers)
            qty_sold = random.randint(1, 5)
            
            # Check if enough stock
            batches = db.query(models.Batch).filter(models.Batch.product_id == p.id).all()
            total_stock = sum(b.quantity for b in batches)
            
            if total_stock >= qty_sold:
                # Deduct stock from batch
                batches[0].quantity -= qty_sold
                
                # Record transaction
                t = models.Transaction(
                    product_id=p.id, 
                    type="OUT", 
                    quantity=qty_sold, 
                    user_id=admin_id,
                    timestamp=datetime.datetime.utcnow() - datetime.timedelta(days=random.randint(0, 6))
                )
                db.add(t)
                
                # Record payment/ledger if needed (assuming simple case for now)
                
        db.commit()
        print("Database seeded successfully with richer data!")

    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
