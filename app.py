from flask import Flask, render_template, redirect, url_for
import json
import os
from ebook_generator import generate_ebook
from blog_generator import generate_blog
from site_generator import generate_site

app = Flask(__name__)

def load_json(file):
    if os.path.exists(file):
        with open(file) as f:
            return json.load(f)
    return []

@app.route('/')
def home():
    return render_template("index.html")

@app.route('/generate/ebook')
def make_ebook():
    generate_ebook()
    return redirect(url_for('ebooks'))

@app.route('/generate/blog')
def make_blog():
    generate_blog()
    return redirect(url_for('blogs'))

@app.route('/generate/site')
def make_site():
    generate_site()
    return redirect(url_for('sites'))

@app.route('/ebooks')
def ebooks():
    return render_template("ebooks.html", ebooks=load_json("ebooks.json"))

@app.route('/blogs')
def blogs():
    return render_template("blogs.html", blogs=load_json("blogs.json"))

@app.route('/sites')
def sites():
    return render_template("sites.html", sites=load_json("sites.json"))

if __name__ == "__main__":
    app.run(debug=True)
