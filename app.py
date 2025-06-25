from flask import Flask, render_template
import json

app = Flask(__name__)

@app.route("/")
def home():
    with open("ebooks.json") as f:
        books = json.load(f)
    return render_template("index.html", books=books)

@app.route("/make-ebook")
def make_ebook():
    from generate_ebook import generate
    link = generate()
    with open("ebooks.json", "r+") as f:
        data = json.load(f)
        data.insert(0, {"link": link})
        f.seek(0)
        json.dump(data, f)
    return "New eBook created!"
