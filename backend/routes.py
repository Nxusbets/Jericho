from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from bson import ObjectId  # Importa ObjectId para manejar _id de MongoDB

def setup_routes(app, db):  # Acepta la instancia de la base de datos 'db'
    @app.route('/api/register', methods=['POST'])
    def register():
        data = request.get_json()
        usuario = data.get("usuario")
        correo = data.get("correo")
        contrasena = data.get("contrasena")

        if not usuario or not correo or not contrasena:
            return jsonify({"message": "Todos los campos son obligatorios"}), 400

        # Verifica si el usuario o correo ya existen en la base de datos
        if db.usuarios.find_one({"usuario": usuario}):
            return jsonify({"message": "El usuario ya está registrado"}), 409
        if db.usuarios.find_one({"correo": correo}):
            return jsonify({"message": "El correo ya está registrado"}), 409

        # Guarda el usuario en la base de datos
        db.usuarios.insert_one({
            "usuario": usuario,
            "correo": correo,
            "contrasena": contrasena  # En producción, cifra la contraseña
        })

        return jsonify({"message": "Usuario registrado exitosamente"}), 201

    @app.route('/login', methods=['POST'])
    def login():
        data = request.get_json()
        usuario = data.get("usuario")
        contrasena = data.get("contrasena")

        # Verifica que el usuario exista y que las credenciales sean correctas
        user = db.usuarios.find_one({"usuario": usuario, "contrasena": contrasena})
        if user:
            rol = "admin" if usuario == "admin" else "usuario"
            access_token = create_access_token(identity=usuario)
            return jsonify(access_token=access_token, rol=rol), 200
        else:
            return jsonify({"message": "Credenciales incorrectas"}), 401

    @app.route('/api/pronosticos', methods=['GET'])
    def obtener_pronosticos():
        try:
            pronosticos = list(db.pronosticos.find())
            # Serializa ObjectId correctamente
            for pronostico in pronosticos:
                pronostico['_id'] = str(pronostico['_id'])
            return jsonify(pronosticos)
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @app.route('/api/pronosticos', methods=['POST'])
    def agregar_pronostico():
        nuevo_pronostico = request.get_json()
        try:
            db.pronosticos.insert_one(nuevo_pronostico)
            return jsonify(nuevo_pronostico), 201
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @app.route('/api/pronosticos/<string:id>', methods=['PUT'])  # Cambiado a string para manejar ObjectId
    def modificar_pronostico(id):
        pronostico_actualizado = request.get_json()
        try:
            db.pronosticos.update_one({"_id": ObjectId(id)}, {"$set": pronostico_actualizado})
            return jsonify(pronostico_actualizado)
        except Exception as e:
            return jsonify({"message": "Pronóstico no encontrado o ID inválido"}), 404

    @app.route('/api/pronosticos/<string:id>', methods=['DELETE'])  # Cambiado a string para manejar ObjectId
    def borrar_pronostico(id):
        try:
            db.pronosticos.delete_one({"_id": ObjectId(id)})
            return jsonify({"message": "Pronóstico eliminado"})
        except Exception as e:
            return jsonify({"message": "Pronóstico no encontrado o ID inválido"}), 404

    @app.route('/api/usuarios', methods=['GET'])
    def obtener_usuarios():
        try:
            usuarios_sin_contrasena = [{"usuario": u["usuario"], "correo": u["correo"]} for u in db.usuarios.find()]
            return jsonify(usuarios_sin_contrasena), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @app.route('/api/rutas', methods=['GET'])
    def listar_rutas():
        rutas = [str(rule) for rule in app.url_map.iter_rules()]
        return jsonify(rutas)