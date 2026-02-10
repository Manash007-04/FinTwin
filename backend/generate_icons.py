from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(size, filename):
    # Create a clean, modern icon with FinTwin brand colors
    # Background: #215E61 (Primary), Text: #F5FBE6 (Canvas)
    bg_color = (33, 94, 97)
    text_color = (245, 251, 230)
    
    img = Image.new('RGB', (size, size), color=bg_color)
    d = ImageDraw.Draw(img)
    
    # Draw a simple decorative circle
    d.ellipse([size*0.1, size*0.1, size*0.9, size*0.9], outline=text_color, width=int(size*0.05))
    
    # Add "FT" text centered
    # Since we might not have a custom font, we'll draw a simple shape or try default font
    # Let's draw a simple "FT" using rectangles for reliability
    
    # F
    d.rectangle([size*0.3, size*0.3, size*0.4, size*0.7], fill=text_color)
    d.rectangle([size*0.3, size*0.3, size*0.6, size*0.4], fill=text_color)
    d.rectangle([size*0.3, size*0.5, size*0.55, size*0.6], fill=text_color)
    
    # T
    d.rectangle([size*0.65, size*0.3, size*0.9, size*0.4], fill=text_color)
    d.rectangle([size*0.725, size*0.3, size*0.825, size*0.7], fill=text_color)

    output_path = os.path.join(r"d:\cnn+agey\FinTwin\frontend\public", filename)
    img.save(output_path)
    print(f"Created {output_path}")

try:
    create_icon(192, "icon-192x192.png")
    create_icon(512, "icon-512x512.png")
except Exception as e:
    print(f"Error: {e}")
