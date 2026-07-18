#!/usr/bin/env python3
"""Frontend dev server using Flask."""
from pathlib import Path
from flask import Flask, send_file, send_from_directory
from flask_cors import CORS

app = Flask(__name__, static_folder='public', static_url_path='')
CORS(app)

frontend_dir = Path(__file__).parent
public_dir = frontend_dir / 'public'
src_dir = frontend_dir / 'src'

@app.route('/')
def index():
    return send_file(str(public_dir / 'index.html'))

@app.route('/src/<path:path>')
def serve_src(path):
    file_path = src_dir / path
    if file_path.exists():
        return send_file(str(file_path))
    return "Not found", 404

@app.route('/<path:path>')
def serve_public(path):
    file_path = public_dir / path
    if file_path.exists() and file_path.is_file():
        return send_file(str(file_path))
    # SPA fallback
    return send_file(str(public_dir / 'index.html'))

if __name__ == '__main__':
    print(f"""
╔════════════════════════════════════════════╗
║  Eterno Frontend Development Server       ║
╠════════════════════════════════════════════╣
║  🌐 http://localhost:3000
║  📁 {frontend_dir}
║  
║  Press Ctrl+C to stop
╚════════════════════════════════════════════╝
    """)
    app.run(host='127.0.0.1', port=3000, debug=False)
