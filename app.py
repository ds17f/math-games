from flask import Flask, render_template, send_from_directory
import socket
import webbrowser
import os

# Create Flask app with current directory as static folder
app = Flask(__name__, 
            static_url_path='', 
            static_folder=os.path.abspath(os.path.dirname(__file__)))

# Serve index.html at root
@app.route('/')
def index():
    return app.send_static_file('index.html')

# Get local IP address
def get_local_ip():
    try:
        # Create a socket to get the local IP address
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        # Doesn't need to be reachable
        s.connect(('10.255.255.255', 1))
        IP = s.getsockname()[0]
        s.close()
    except Exception:
        IP = '127.0.0.1'
    return IP

# Set socket options to handle connection issues
from werkzeug.serving import WSGIRequestHandler
WSGIRequestHandler.protocol_version = "HTTP/1.1"

if __name__ == '__main__':
    port = 8000
    local_ip = get_local_ip()
    local_url = f"http://{local_ip}:{port}"
    localhost_url = f"http://localhost:{port}"
    
    print(f"\nServing at:")
    print(f"- Local URL: {localhost_url}")
    print(f"- Network URL (for external devices): {local_url}")
    print("\nUse the Network URL to access from any device when connected to the same WiFi")
    print(f"Note: Make sure your firewall allows incoming connections on port {port}")
    print("\nPress Ctrl+C to stop the server")
    
    # Open browser automatically
    webbrowser.open(localhost_url)
    
    # Start server with improved settings for connection handling
    app.run(host='0.0.0.0', 
            port=port, 
            debug=False, 
            threaded=True,
            use_reloader=False)