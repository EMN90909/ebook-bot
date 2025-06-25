from fpdf import FPDF
import time
from drive_uploader import upload_to_drive

def generate():
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    content = "This is your auto-generated eBook.\n\nHustle mode: engaged!"
    pdf.multi_cell(190, 10, content)

    filename = f"ebook_{int(time.time())}.pdf"
    pdf.output(filename)
    return upload_to_drive(filename)
