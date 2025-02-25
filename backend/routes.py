from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from bson import ObjectId
import requests
import logging

def setup_routes(app, db):
    logging.basicConfig(level=logging.DEBUG)

    @app.route('/api/register', methods=['POST'])
    def register():
        data = request.get_json()
        usuario = data.get("usuario")
        correo = data.get("correo")
        contrasena = data.get("contrasena")

        if not usuario or not correo or not contrasena:
            return jsonify({"message": "Todos los campos son obligatorios"}), 400

        if db.usuarios.find_one({"usuario": usuario}):
            return jsonify({"message": "El usuario ya está registrado"}), 409
        if db.usuarios.find_one({"correo": correo}):
            return jsonify({"message": "El correo ya está registrado"}), 409

        db.usuarios.insert_one({
            "usuario": usuario,
            "correo": correo,
            "contrasena": contrasena
        })

        return jsonify({"message": "Usuario registrado exitosamente"}), 201

    @app.route('/login', methods=['POST'])
    def login():
        data = request.get_json()
        usuario = data.get("usuario")
        contrasena = data.get("contrasena")

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

    @app.route('/api/pronosticos/<string:id>', methods=['PUT'])
    def modificar_pronostico(id):
        pronostico_actualizado = request.get_json()
        logging.debug(f"ID recibido: {id}")
        logging.debug(f"Datos recibidos: {pronostico_actualizado}")

        try:
            db.pronosticos.update_one({"_id": ObjectId(id)}, {"$set": pronostico_actualizado})
            logging.debug(f"Pronóstico actualizado con ID: {id}")
            return jsonify(pronostico_actualizado)
        except Exception as e:
            logging.error(f"Error al actualizar pronóstico con ID: {id}: {e}")
            return jsonify({"message": "Pronóstico no encontrado o ID inválido"}), 404

    @app.route('/api/pronosticos/<string:id>', methods=['DELETE'])
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

    # Chatbot endpoints.
    @app.route('/api/chatbot/pronostico', methods=['POST'])
    def obtener_pronostico():
        data = request.get_json()
        partido = data.get('partido')
        pronostico = obtener_pronostico_de_api(partido)
        if pronostico:
            return jsonify({"pronostico": pronostico})
        else:
            return jsonify({"pronostico": "No hay pronóstico disponible"}), 404

    def obtener_pronostico_de_api(partido):
        try:
            api_key = "88422437a61b4453ab6d435af42cae30"
            headers = {"X-Auth-Token": api_key}
            response = requests.get("http://api.football-data.org/v4/matches", headers=headers)
            if response.status_code == 200:
                matches = response.json().get("matches", [])
                for match in matches:
                    local = match["homeTeam"]["name"]
                    visitante = match["awayTeam"]["name"]
                    if partido.lower() == f"{local} vs {visitante}".lower():
                        return f"Pronóstico: {local} podría ganar."
                return None
            else:
                return None
        except Exception as e:
            print(f"Error al obtener pronóstico: {e}")
            return None