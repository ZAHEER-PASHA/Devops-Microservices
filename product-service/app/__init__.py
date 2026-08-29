from flask import Flask
from flask_cors import CORS

from app.routes.product_routes import product_routes


def create_app():
    app = Flask(__name__)

    CORS(app)

    app.register_blueprint(product_routes)

    @app.route("/health", methods=["GET"])
    def health():
        return {
            "success": True,
            "service": "product-service",
            "status": "healthy"
        }, 200

    return app