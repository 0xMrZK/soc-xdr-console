from flask import Blueprint

from app.modules.agents.routes import agents_bp
from app.modules.incidents.routes import incidents_bp
from app.modules.lifecycle.routes import lifecycle_bp

api_bp = Blueprint("api", __name__)

api_bp.register_blueprint(agents_bp)
api_bp.register_blueprint(incidents_bp)
api_bp.register_blueprint(lifecycle_bp)
