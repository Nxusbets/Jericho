from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity

# Inicializar Flask
app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = "supersecretkey"  # Cambia esto en producción
jwt = JWTManager(app)
CORS(app)  # Habilita CORS para toda la app

# Simulación de una base de datos en memoria
usuarios = {
    "admin": {"usuario": "admin", "correo": "admin@example.com", "contrasena": "admin123"}  # Usuario por defecto
}

USUARIO = "admin"
CONTRASENA = "admin123"

# Lista de pronósticos (simulación en memoria)
pronosticos = [
    {"id": 1, "equipoLocal": "Equipo A", "equipoVisitante": "Equipo B", "fecha": "2025-02-15", "pronostico": "Victoria de Equipo A"},
    {"id": 2, "equipoLocal": "Equipo C", "equipoVisitante": "Equipo D", "fecha": "2025-02-16", "pronostico": "Victoria de Equipo D"}
]

def setup_routes(app):
    # Ruta para registrar un nuevo usuario
    @app.route('/api/register', methods=['POST'])
    def register():
        data = request.get_json()
        usuario = data.get("usuario")
        correo = data.get("correo")
        contrasena = data.get("contrasena")

        if not usuario or not correo or not contrasena:
            return jsonify({"message": "Todos los campos son obligatorios"}), 400

        if usuario in usuarios:
            return jsonify({"message": "El usuario ya está registrado"}), 409
        if any(u["correo"] == correo for u in usuarios.values()):
            return jsonify({"message": "El correo ya está registrado"}), 409

        # Guardar usuario en la "base de datos"
        usuarios[usuario] = {
            "usuario": usuario,
            "correo": correo,
            "contrasena": contrasena  # En producción, cifra la contraseña
        }

        return jsonify({"message": "Usuario registrado exitosamente"}), 201

    # Ruta para iniciar sesión
    @app.route('/login', methods=['POST'])
    def login():
        data = request.get_json()
        usuario = data.get("usuario")
        contrasena = data.get("contrasena")

        # Verifica que el usuario exista y que las credenciales sean correctas
        if usuario in usuarios and usuarios[usuario]["contrasena"] == contrasena:
            # Agregar el rol a la respuesta
            rol = "admin" if usuario == "admin" else "usuario"
            access_token = create_access_token(identity=usuario)
            return jsonify(access_token=access_token, rol=rol), 200
        else:
            return jsonify({"message": "Credenciales incorrectas"}), 401

    # Rutas para gestionar pronósticos (GET, POST, PUT, DELETE)
    @app.route('/api/pronosticos', methods=['GET'])
    def obtener_pronosticos():
        return jsonify(pronosticos)

    @app.route('/api/pronosticos', methods=['POST'])
    @jwt_required()
    def agregar_pronostico():
        current_user = get_jwt_identity()
        if current_user != USUARIO:
            return jsonify({"message": "No autorizado"}), 403

        nuevo_pronostico = request.get_json()
        nuevo_pronostico['id'] = len(pronosticos) + 1
        pronosticos.append(nuevo_pronostico)
        return jsonify(nuevo_pronostico), 201

    @app.route('/api/pronosticos/<int:id>', methods=['PUT'])
    @jwt_required()
    def modificar_pronostico(id):
        current_user = get_jwt_identity()
        if current_user != USUARIO:
            return jsonify({"message": "No autorizado"}), 403

        pronostico_actualizado = request.get_json()
        for p in pronosticos:
            if p['id'] == id:
                p.update(pronostico_actualizado)
                return jsonify(p)
        return jsonify({"message": "Pronóstico no encontrado"}), 404

    @app.route('/api/pronosticos/<int:id>', methods=['DELETE'])
    @jwt_required()
    def borrar_pronostico(id):
        current_user = get_jwt_identity()
        if current_user != USUARIO:
            return jsonify({"message": "No autorizado"}), 403

        global pronosticos
        pronosticos = [p for p in pronosticos if p['id'] != id]
        return jsonify({"message": "Pronóstico eliminado"})

    # Ruta para obtener usuarios (SIN AUTENTICACIÓN)
    @app.route('/api/usuarios', methods=['GET'])
    def obtener_usuarios():
        usuarios_sin_contrasena = [
            {"usuario": u["usuario"], "correo": u["correo"]}
            for u in usuarios.values()
        ]
        return jsonify(usuarios_sin_contrasena), 200

    # Ruta para listar todas las rutas disponibles
    @app.route('/api/rutas', methods=['GET'])
    def listar_rutas():
        rutas = [str(rule) for rule in app.url_map.iter_rules()]
        return jsonify(rutas)


# Inicializar la aplicación
setup_routes(app)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
