import os
import requests
import json
from datetime import datetime
import cloudinary
from cloudinary.uploader import upload

# Load environment variables
AI21_API_KEY = os.getenv("AI21_API_KEY")
cloudinary.config(cloudinary_url=os.getenv("CLOUDINARY_URL"))

def generate_blog_text():
    prompt = (
        "Write a fun, weird, and useful tech blog post about the future of AI-powered websites. "
        "Make it engaging, witty, and less than 600 words. Include a title at the top."
    )

    headers = {
        "Authorization": f"Bearer {AI21_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "prompt": prompt,
        "numResults": 1,
        "maxTokens": 700,
        "temperature": 0.8,
        "topP": 1,
        "topKReturn": 0,
        "stopSequences": ["###"]
    }

    response = requests.post(
        "https://api.ai21.com/studio/v1/j1-large/complete",
        headers=headers,
        json=payload
    )

    result = response.json()
    return result['completions'][0]['data']['text'].strip()

def wrap_html(content):
    return f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>My Auto-Blog</title>
    <style>
        body {{ font-family: Arial, sans-serif; padding: 2em; line-height: 1.6; }}
        h1 {{ color: #444; }}
    </style>
</head>
<body>
{content.replace('\n', '<br><br>')}
</body>
</html>"""

def save_blog_html(content, filename):
    folder = "blogs"
    os.makedirs(folder, exist_ok=True)
    full_path = os.path.join(folder, filename)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content)
    return full_path

def upload_to_cloudinary(path):
    result = upload(path, resource_type="raw", folder="blogs/")
    return result.get("secure_url")

def generate_blog():
    print("🧠 Generating blog post with AI21...")
    raw_text = generate_blog_text()
    html = wrap_html(raw_text)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"blog_{timestamp}.html"
    path = save_blog_html(html, filename)

    print("☁️ Uploading to Cloudinary...")
    link = upload_to_cloudinary(path)

    print("✅ Blog uploaded:", link)

    # Store in blogs.json
    entry = {"title": raw_text.split('\n')[0], "link": link}
    db_file = "blogs.json"

    if os.path.exists(db_file):
        with open(db_file, "r") as f:
            data = json.load(f)
    else:
        data = []

    data.insert(0, entry)

    with open(db_file, "w") as f:
        json.dump(data, f, indent=2)

    return link

# For testing only
if __name__ == "__main__":
    generate_blog()
