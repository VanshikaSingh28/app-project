import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import uuid
from datetime import datetime, timezone

# Sample products data
SAMPLE_PRODUCTS = [
    {
        "id": str(uuid.uuid4()),
        "name": "Premium Wireless Headphones",
        "description": "High-fidelity wireless headphones with active noise cancellation and 30-hour battery life",
        "price": 299.99,
        "category": "Electronics",
        "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
        "stock": 50,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Smart Watch Pro",
        "description": "Advanced fitness tracking with heart rate monitoring and GPS",
        "price": 399.99,
        "category": "Electronics",
        "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
        "stock": 75,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Designer Leather Jacket",
        "description": "Premium Italian leather jacket with contemporary styling",
        "price": 599.99,
        "category": "Fashion",
        "image": "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop",
        "stock": 25,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Luxury Sunglasses",
        "description": "Polarized designer sunglasses with UV protection",
        "price": 249.99,
        "category": "Fashion",
        "image": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop",
        "stock": 100,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Professional Camera",
        "description": "Full-frame mirrorless camera with 4K video recording",
        "price": 1899.99,
        "category": "Electronics",
        "image": "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&h=500&fit=crop",
        "stock": 20,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Premium Yoga Mat",
        "description": "Eco-friendly non-slip yoga mat with carrying strap",
        "price": 79.99,
        "category": "Fitness",
        "image": "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&h=500&fit=crop",
        "stock": 150,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Coffee Maker Deluxe",
        "description": "Programmable coffee maker with thermal carafe",
        "price": 149.99,
        "category": "Home",
        "image": "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500&h=500&fit=crop",
        "stock": 80,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Gaming Laptop",
        "description": "High-performance gaming laptop with RTX graphics",
        "price": 1499.99,
        "category": "Electronics",
        "image": "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&h=500&fit=crop",
        "stock": 30,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Designer Handbag",
        "description": "Elegant leather handbag with gold hardware",
        "price": 899.99,
        "category": "Fashion",
        "image": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&h=500&fit=crop",
        "stock": 40,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Smart Home Speaker",
        "description": "Voice-controlled smart speaker with premium sound",
        "price": 199.99,
        "category": "Electronics",
        "image": "https://images.unsplash.com/photo-1543512214-318c7553f230?w=500&h=500&fit=crop",
        "stock": 120,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Running Shoes",
        "description": "Lightweight running shoes with advanced cushioning",
        "price": 129.99,
        "category": "Fitness",
        "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
        "stock": 200,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Desk Organizer Set",
        "description": "Bamboo desk organizer with multiple compartments",
        "price": 49.99,
        "category": "Home",
        "image": "https://images.unsplash.com/photo-1588516903720-8ceb67f9ef84?w=500&h=500&fit=crop",
        "stock": 180,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Portable Charger",
        "description": "20000mAh power bank with fast charging",
        "price": 59.99,
        "category": "Electronics",
        "image": "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&h=500&fit=crop",
        "stock": 300,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Silk Scarf",
        "description": "Handcrafted silk scarf with unique patterns",
        "price": 89.99,
        "category": "Fashion",
        "image": "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=500&h=500&fit=crop",
        "stock": 90,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Bluetooth Earbuds",
        "description": "True wireless earbuds with noise cancellation",
        "price": 149.99,
        "category": "Electronics",
        "image": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&h=500&fit=crop",
        "stock": 250,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Ceramic Dinnerware Set",
        "description": "16-piece porcelain dinnerware set for 4",
        "price": 119.99,
        "category": "Home",
        "image": "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=500&h=500&fit=crop",
        "stock": 60,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
]

async def seed_products():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client["ecommerce_db"]
    
    # Clear existing products
    await db.products.delete_many({})
    
    # Insert sample products
    await db.products.insert_many(SAMPLE_PRODUCTS)
    
    print(f"Successfully seeded {len(SAMPLE_PRODUCTS)} products!")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_products())
