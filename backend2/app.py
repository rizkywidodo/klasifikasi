# backend/app.py
from flask import Flask
from flask_cors import CORS
from models import db
from auth import auth_bp
from prediction import prediction_bp

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret123'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite3'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# --- TAMBAHAN KONFIGURASI COOKIE DI SINI ---
# Memaksa cookie untuk bisa dikirim antar port di localhost
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
# Set 'False' HANYA untuk development di HTTP
app.config['SESSION_COOKIE_SECURE'] = False

# Konfigurasi CORS yang sudah kita perbaiki kemarin
CORS(app, origins=["http://localhost:5173",
     "http://127.0.0.1:5173"], supports_credentials=True)

db.init_app(app)
app.register_blueprint(auth_bp)
app.register_blueprint(prediction_bp)

with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)
