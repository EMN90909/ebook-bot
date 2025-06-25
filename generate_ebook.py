import requests
from fpdf import FPDF
import os, json
from datetime import datetime
import random

def get_quote():
    try:
        res = requests.get("https://api.quotable.io/random")
        data = res.json()
        return f'📜 "{data["content"]}" — {data["author"]}\n'
    except:
        return "Quote unavailable."

def get_dad_joke():
    try:
        res = requests.get("https://icanhazdadjoke.com/", headers={"Accept": "application/json"})
        data = res.json()
        return f'😂 {data["joke"]}\n'
    except:
        return "Joke not found. Insert awkward silence."

def get_books_about(topic="success"):
    try:
        url = f"https://www.googleapis.com/books/v1/volumes?q={topic}"
        res = requests.get(url)
        books = res.json().get("items", [])
        book_titles = [f"📚 {b['volumeInfo']['title']}" for b in books[:3]]
        return "\n".join(book_titles)
    except:
        return "Books not found. Try using your imagination."

def get_bacon_paragraph():
    try:
        res = requests.get("https://baconipsum.com/api/?type=meat-and-filler&paras=1&format=text")
        return f'\n🥓 {res.text.strip()}'
    except:
        return "Bacon Ipsum not sizzling today."

def generate_ebook():
    if not os.path.exists("ebooks"):
        os.makedirs("ebooks")

    title = f"AI_Ebook_{random.randint(1000,9999)}"
    filename = f"{title}.pdf"
    filepath = os.path.join("ebooks", filename)

    content = ""
    content += f"{get_quote()}\n"
    content += f"{get_dad_joke()}\n"
    content += "Recommended Books:\n" + get_books_about("motivation") + "\n"
    content += get_bacon_paragraph()

    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.multi_cell(0, 10, txt=content)
    pdf.output(filepath)

    # Store in ebooks.json
    link = f"/ebooks/{filename}"
    try:
        with open("ebooks.json", "r") as f:
            books = json.load(f)
    except:
        books = []

    books.insert(0, {"link": link, "timestamp": datetime.now().isoformat()})
    with open("ebooks.json", "w") as f:
        json.dump(books, f, indent=2)

    return link
