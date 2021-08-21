from flask import Flask,request
import spacy
import json

app = Flask(__name__)
app.config["CORS_HEADERS"] = "Content-Type"
languages = {"french": spacy.load("fr_core_news_sm"), "english":spacy.load("en_core_web_sm"), "spanish":spacy.load("es_core_news_sm")}

@app.route("/")
def hello_world():
    return "Hello World!"

@app.route('/recogniseEntities', methods=['POST'])
def recognise_entities():
    data = request.get_json()
    nlp = languages[data["lang"]]
    doc = nlp(data["body"])
    result=[{"text":X.text, "label":X.label_} for X in doc.ents]
    return json.dumps(result), 201
