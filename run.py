"""
Supermarket Sales Analysis Dashboard - Local Runner
Supports running anywhere: VS Code, Windows, macOS, Linux
Runs on http://localhost:3000
"""
import http.server
import socketserver
import webbrowser
import os
import sys
import zipfile
import mimetypes
import subprocess

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DIST_DIR = os.path.join(SCRIPT_DIR, "dist")
ZIP_FILE = os.path.join(SCRIPT_DIR, "dist.zip")

# Ensure proper MIME types are recognized
mimetypes.add_type("application/javascript", ".js")
mimetypes.add_type("text/javascript", ".js")
mimetypes.add_type("text/css", ".css")
mimetypes.add_type("text/html", ".html")
mimetypes.add_type("image/svg+xml", ".svg")
mimetypes.add_type("application/json", ".json")

def ensure_dist():
    """Ensure the dist folder with index.html and assets is ready."""
    global DIST_DIR
    index_path = os.path.join(DIST_DIR, "index.html")

    # 1. If dist/index.html already exists, we are good to go
    if os.path.isfile(index_path):
        return True

    print("[*] Preparing dashboard distribution files...")
    os.makedirs(DIST_DIR, exist_ok=True)

    # 2. Extract from dist.zip if present
    if os.path.isfile(ZIP_FILE):
        try:
            print("[*] Unpacking dist.zip archive...")
            with zipfile.ZipFile(ZIP_FILE, "r") as zf:
                zf.extractall(DIST_DIR)
            if os.path.isfile(index_path):
                print("[+] Dashboard files unpacked successfully!")
                return True
        except Exception as e:
            print(f"[!] Warning reading dist.zip: {e}")

    # 3. If dist/assets exists with built JS, auto-generate index.html
    assets_dir = os.path.join(DIST_DIR, "assets")
    if os.path.isdir(assets_dir):
        js_files = [f for f in os.listdir(assets_dir) if f.endswith(".js")]
        css_files = [f for f in os.listdir(assets_dir) if f.endswith(".css")]
        if js_files:
            js_tag = f'<script type="module" crossorigin src="/assets/{js_files[0]}"></script>'
            css_tag = f'<link rel="stylesheet" crossorigin href="/assets/{css_files[0]}">' if css_files else ""
            html_content = f"""<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Supermarket Sales Analysis Dashboard</title>
    {js_tag}
    {css_tag}
  </head>
  <body class="bg-slate-900 text-slate-100 antialiased selection:bg-emerald-500 selection:text-white">
    <div id="root"></div>
  </body>
</html>"""
            with open(index_path, "w", encoding="utf-8") as f:
                f.write(html_content)
            print("[+] Linked index.html to dashboard assets.")
            return True

    # 4. If Node/npm is installed in VS Code environment, run build
    package_json = os.path.join(SCRIPT_DIR, "package.json")
    if os.path.isfile(package_json):
        try:
            print("[*] Running npm run build...")
            ret = subprocess.run(["npm", "run", "build"], cwd=SCRIPT_DIR, capture_output=True, text=True, timeout=60)
            if ret.returncode == 0 and os.path.isfile(index_path):
                print("[+] Build succeeded!")
                return True
        except Exception:
            pass

    return os.path.isfile(index_path)


class SPAServerHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIST_DIR, **kwargs)

    def guess_type(self, path):
        mime, _ = mimetypes.guess_type(path)
        if path.endswith(".js"):
            return "application/javascript"
        if path.endswith(".css"):
            return "text/css"
        return mime or "application/octet-stream"

    def do_GET(self):
        clean_path = self.path.split("?")[0].split("#")[0]

        # Root route
        if clean_path in ("", "/"):
            self.path = "/index.html"
            return super().do_GET()

        translated = self.translate_path(clean_path)

        # Direct file matches (e.g. /assets/index-xxx.js)
        if os.path.isfile(translated):
            return super().do_GET()

        # Direct directory requests -> redirect to root
        if os.path.isdir(translated):
            if os.path.isfile(os.path.join(translated, "index.html")):
                return super().do_GET()
            self.send_response(302)
            self.send_header("Location", "/")
            self.end_headers()
            return

        # Single Page App routing fallback: return /index.html for any app sub-route
        self.path = "/index.html"
        return super().do_GET()

    def list_directory(self, path):
        self.send_response(302)
        self.send_header("Location", "/")
        self.end_headers()
        return None

    def log_message(self, fmt, *args):
        # Silence routine 200/302/304 logs for clean terminal experience
        if args and len(args) > 1 and str(args[1]) in ("200", "304", "302"):
            return
        super().log_message(fmt, *args)


def find_free_port(preferred_port=3000):
    ports = [preferred_port, 3001, 3002, 5000, 8080, 8000]
    for p in ports:
        try:
            test_server = socketserver.TCPServer(("", p), SPAServerHandler)
            test_server.server_close()
            return p
        except OSError:
            continue
    return preferred_port


def main():
    print("\n" + "=" * 65)
    print("  🏪 SUPERMARKET SALES ANALYSIS DASHBOARD")
    print("=" * 65)
    
    ready = ensure_dist()
    if not ready:
        print("\n[!] Could not locate built dashboard files in /dist.")
        print("    If you have Node.js installed in VS Code, run:")
        print("       npm install")
        print("       npm run build")
        print("    Then rerun: python run.py\n")

    port = find_free_port(3000)
    socketserver.TCPServer.allow_reuse_address = True

    try:
        server = socketserver.TCPServer(("", port), SPAServerHandler)
    except OSError as err:
        print(f"[!] Error starting server on port {port}: {err}")
        return

    url = f"http://localhost:{port}/"
    print(f"  👉 Server Running at: {url}")
    print("=" * 65)
    print("  🔑 Authentication:")
    print("     - Register new account under 'Create Account' tab")
    print("     - Or sign in with registered Email and Dashboard Password")
    print("     - Choose role: Admin or Admin Executer")
    print("  🛑 Press Ctrl + C in this terminal to stop the server.")
    print("=" * 65 + "\n")

    try:
        webbrowser.open(url)
    except Exception:
        pass

    try:
        with server:
            server.serve_forever()
    except KeyboardInterrupt:
        print("\n[*] Server stopped. Have a great day!\n")


if __name__ == "__main__":
    main()