from app.database import get_connection


def create_product(
    name,
    description,
    price,
    stock,
    category,
    image_url=None
):
    connection = get_connection()

    if not connection:
        raise Exception("Database connection failed")

    cursor = connection.cursor()

    query = """
        INSERT INTO products
        (name, description, price, stock, category, image_url)
        VALUES (%s, %s, %s, %s, %s, %s)
    """

    values = (
        name,
        description,
        price,
        stock,
        category,
        image_url
    )

    cursor.execute(query, values)
    connection.commit()

    product_id = cursor.lastrowid

    cursor.close()
    connection.close()

    return product_id


def get_all_products():
    connection = get_connection()

    if not connection:
        raise Exception("Database connection failed")

    cursor = connection.cursor(dictionary=True)

    query = """
        SELECT
            id,
            name,
            description,
            price,
            stock,
            category,
            image_url,
            created_at,
            updated_at
        FROM products
        ORDER BY id DESC
    """

    cursor.execute(query)

    products = cursor.fetchall()

    cursor.close()
    connection.close()

    return products


def get_product_by_id(product_id):
    connection = get_connection()

    if not connection:
        raise Exception("Database connection failed")

    cursor = connection.cursor(dictionary=True)

    query = """
        SELECT
            id,
            name,
            description,
            price,
            stock,
            category,
            image_url,
            created_at,
            updated_at
        FROM products
        WHERE id = %s
    """

    cursor.execute(query, (product_id,))

    product = cursor.fetchone()

    cursor.close()
    connection.close()

    return product


def update_product(
    product_id,
    name,
    description,
    price,
    stock,
    category,
    image_url
):
    connection = get_connection()

    if not connection:
        raise Exception("Database connection failed")

    cursor = connection.cursor()

    query = """
        UPDATE products
        SET
            name = %s,
            description = %s,
            price = %s,
            stock = %s,
            category = %s,
            image_url = %s
        WHERE id = %s
    """

    values = (
        name,
        description,
        price,
        stock,
        category,
        image_url,
        product_id
    )

    cursor.execute(query, values)
    connection.commit()

    rows_affected = cursor.rowcount

    cursor.close()
    connection.close()

    return rows_affected


def delete_product(product_id):
    connection = get_connection()

    if not connection:
        raise Exception("Database connection failed")

    cursor = connection.cursor()

    query = """
        DELETE FROM products
        WHERE id = %s
    """

    cursor.execute(query, (product_id,))
    connection.commit()

    rows_affected = cursor.rowcount

    cursor.close()
    connection.close()

    return rows_affected