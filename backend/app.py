from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from routes import setup_routes
from pymongo import MongoClient

app = Flask(__name__)

# Configuración de JWT
app.config["JWT_SECRET_KEY"] = "mi_clave_secreta"  # Cambia esta clave por algo seguro
jwt = JWTManager(app)

# Habilitar CORS
CORS(app)

# Configuración de MongoDB Atlas
MONGO_URI = "mongodb+srv://nxus:nxusbets@cluster0.zgmij.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
try:
    client = MongoClient(MONGO_URI)
    db = client.nxusbets  # Usa 'nxusbets' como nombre de la base de datos
    print("Conexión a MongoDB Atlas exitosa!")
except Exception as e:
    print(f"Error al conectar a MongoDB Atlas: {e}")
    client = None
    db = None

# Inicializar las rutas y pasar la instancia de la base de datos
setup_routes(app, db)  # Pasa la instancia de la base de datos

if __name__ == "__main__":
    app.run(debug=True)