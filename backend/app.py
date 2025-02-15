from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from routes import setup_routes  # Asegúrate de importar esta función

app = Flask(__name__)

# Configuración de JWT
app.config["JWT_SECRET_KEY"] = "mi_clave_secreta"  # Cambia esta clave por algo seguro
jwt = JWTManager(app)

# Habilitar CORS
CORS(app)

# Inicializar las rutas
setup_routes(app)

if __name__ == "__main__":
    app.run(debug=True)
