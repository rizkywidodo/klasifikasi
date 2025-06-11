from flask import Blueprint, request, jsonify, session
from transformers import BertTokenizer, BertForSequenceClassification
import torch
import numpy as np
import pandas as pd
import io

from utils import clean_text
from models import db, Review

# --- 1. MUAT SEMUA MODEL SAAT APLIKASI DIMULAI ---
# Kita gunakan dictionary untuk menyimpan beberapa model sekaligus
models = {}
tokenizers = {}

MODEL_PATHS = {
    'bert_custom': 'mrizkywidodo/klasifikasi-bert',  # Model custom-mu
    # CONTOH: Nanti kamu bisa taruh model lain di sini
    'distilbert': './distilbert_model'
}

try:
    for name, path in MODEL_PATHS.items():
        print(f"Memuat model: {name} dari path: {path}")
        tokenizers[name] = BertTokenizer.from_pretrained(path)
        models[name] = BertForSequenceClassification.from_pretrained(path)
        models[name].eval()
    print(">>> Semua model dan tokenizer berhasil dimuat! <<<")
except Exception as e:
    print(f"XXX Error saat memuat salah satu model: {e} XXX")

LABEL_MAP = {0: "comment", 1: "bug", 2: "feature_request"}
prediction_bp = Blueprint('prediction', __name__)

# --- 2. UPDATE FUNGSI PREDIKSI ---
# Sekarang fungsi ini butuh tahu model mana yang harus dipakai


def predict_text(text: str, model_name: str = 'bert_custom') -> str:
    if model_name not in models:
        return "Error: Model tidak ditemukan"

    # Pilih model dan tokenizer yang sesuai dari dictionary
    active_model = models[model_name]
    active_tokenizer = tokenizers[model_name]

    cleaned_text = clean_text(text)
    inputs = active_tokenizer(
        cleaned_text, return_tensors="pt", truncation=True, padding=True, max_length=512)

    with torch.no_grad():
        outputs = active_model(**inputs)

    logits = outputs.logits.detach().numpy()
    predicted_class_id = np.argmax(logits, axis=1)[0]

    return LABEL_MAP.get(predicted_class_id, "Unknown")

# --- 3. UPDATE ENDPOINT API ---
# Endpoint sekarang harus tahu model mana yang diminta oleh frontend


# VERSI BARU
@prediction_bp.route('/predict', methods=['POST'])
def handle_prediction():
    # ---- BLOK TAMBAHAN UNTUK CEK LOGIN ----
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'User not logged in'}), 401
    # -----------------------------------------

    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({'error': 'Input tidak valid, field "text" dibutuhkan'}), 400

    review_text = data['text']
    model_choice = data.get('model', 'bert_custom')

    try:
        prediction_result = predict_text(review_text, model_choice)
        return jsonify({'prediction': prediction_result})
    except Exception as e:
        print(f"Error saat prediksi: {e}")
        return jsonify({'error': 'Terjadi kesalahan di server saat melakukan prediksi'}), 500


@prediction_bp.route('/predict-csv', methods=['POST'])
def handle_csv_prediction():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    user_id = session.get('user_id')
    # Ambil pilihan model dari form data
    model_choice = request.form.get('model', 'bert_custom')
    # Ambil nama kolom dari form data
    column_name = request.form.get('column', None)

    if not user_id:
        return jsonify({'error': 'User not logged in'}), 401
    if not column_name:
        return jsonify({'error': 'Nama kolom review harus dipilih'}), 400

    if file and file.filename.endswith('.csv'):
        try:
            csv_data = io.StringIO(file.stream.read().decode("UTF8"))
            df = pd.read_csv(csv_data)

            if column_name not in df.columns:
                return jsonify({'error': f"Kolom '{column_name}' tidak ditemukan di file"}), 400

            for text in df[column_name]:
                prediction_result = predict_text(str(text), model_choice)
                new_review = Review(
                    text=str(text), prediction=prediction_result, user_id=user_id)
                db.session.add(new_review)

            db.session.commit()
            return jsonify({'message': f'{len(df)} review berhasil diproses!'})
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': f'Gagal memproses file: {e}'}), 500

    return jsonify({'error': 'Format file tidak valid'}), 400
