# utils.py
import re
import emoji
import jieba  # For Chinese text tokenization
from transformers import BertTokenizer
import torch
from sklearn.model_selection import train_test_split

# Function to remove emojis from text


def remove_emoji(text):
    """
    Remove emojis from the input text.
    """
    return emoji.replace_emoji(text, replace="")  # Updated to use the latest emoji library method

# Function to handle Chinese text (tokenization)


def handle_chinese_text(text):
    """
    Tokenize Chinese text using Jieba.
    """
    # Check if the text is in Chinese
    if re.search(r'[\u4e00-\u9fff]', text):  # Detect Chinese characters
        return " ".join(jieba.cut(text))  # Tokenize using Jieba
    else:
        return text  # Return text unchanged if it's not Chinese


def clean_text(text):
    """
    Clean text by removing unwanted characters like special symbols, quotes, and unnecessary commas.
    """
    # Remove extra quotes (empty quotes or excessive quotation marks)
    text = text.replace('""', '')  # Remove empty quotes
    text = text.replace('"', '')   # Remove all remaining quotes

    # Only remove commas if they are at the start or end of the text
    text = text.strip()  # Remove leading/trailing spaces first
    if text.startswith(','):
        text = text[1:]
    if text.endswith(','):
        text = text[:-1]

    # Remove emojis
    text = remove_emoji(text)

    # Handle Chinese text (if applicable)
    text = handle_chinese_text(text)

    # Remove non-alphanumeric characters (keeping spaces and Chinese characters)
    text = re.sub(r'[^A-Za-z0-9\u4e00-\u9fff\s,]+', '',
                  text)  # Keep commas inside sentences

    # Convert to lowercase and strip leading/trailing spaces
    text = text.strip().lower()

    return text

# Function to load and preprocess data


def load_and_preprocess_data(file_path):
    """
    Load the dataset and preprocess the labels.

    Args:
        file_path: Path to the CSV file containing the dataset.

    Returns:
        DataFrame with preprocessed labels and text.
    """
    import pandas as pd

    # Load the CSV file into a DataFrame
    df = pd.read_csv(file_path)

    # Replace string labels with numeric values for 'comment', 'bug', and 'feature_request'
    label_mapping = {'comment': 0, 'bug': 1,
                     'feature_request': 2}  # Adjust labels as needed
    df['label'] = df['label'].map(label_mapping)

    # Split the dataset into features (X) and labels (y)
    X = df['text']
    y = df['label']

    # Split into training and testing data (80-20 split)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2,stratify=y, random_state=42)

    return X_train, X_test, y_train, y_test

# Function to tokenize data


def tokenize_data(X, y, tokenizer, max_length=512):
    """
    Tokenize text data using the BERT tokenizer.

    Args:
        X: Text data (pandas Series).
        y: Labels (pandas Series).
        max_length: maximum token length for BERT input.

    Returns:
        tokenized inputs and tensor of labels.
    """
    # Clean the text data before tokenizing
    cleaned_text = X.apply(clean_text)

    encodings = tokenizer(cleaned_text.tolist(), padding=True,
                          truncation=True, max_length=max_length, return_tensors='pt')
    labels = torch.tensor(y.tolist())

    return encodings, labels

# Function to save the trained model


def save_model(model, tokenizer, path):
    """
    Save the trained model dan tokenizer to the specified path.

    """
    model.save_pretrained(path)
    tokenizer.save_pretrained(path)
    print(f'Model dan tokenizer saved to {path}')
