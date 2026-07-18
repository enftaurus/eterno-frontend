#!/usr/bin/env python3
"""
Generate placeholder PWA icons.
Run this script to create icon files for the manifest.json.
"""

import os
from pathlib import Path

# SVG icon template
SVG_TEMPLATE = '''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" viewBox="0 0 512 512">
  <!-- Background -->
  <rect width="512" height="512" fill="#4F46E5"/>
  
  <!-- Gradient -->
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Main shape -->
  <circle cx="256" cy="256" r="240" fill="url(#grad)"/>
  
  <!-- Lightning bolt (Eterno logo) -->
  <path d="M 256 80 L 350 200 L 280 200 L 380 380 L 180 280 L 250 280 Z" fill="white" opacity="0.95"/>
  
  <!-- Text: E -->
  <text x="256" y="380" font-size="120" font-weight="bold" text-anchor="middle" fill="white" font-family="Arial">E</text>
</svg>
'''

def create_icons():
    """Create placeholder icon files for all sizes."""
    icons_dir = Path(__file__).parent / 'public' / 'icons'
    icons_dir.mkdir(parents=True, exist_ok=True)
    
    sizes = [72, 96, 128, 144, 152, 192, 384, 512]
    
    for size in sizes:
        # For a real implementation, you'd generate proper PNG files
        # For now, we'll create a simple text file indicating the icon placeholder
        icon_path = icons_dir / f'icon-{size}x{size}.png'
        
        # Create a simple SVG placeholder (in production, use PIL or similar)
        svg_content = SVG_TEMPLATE.format(size=size)
        
        # Save as text note (replace with actual PNG generation)
        placeholder = icons_dir / f'icon-{size}x{size}.txt'
        placeholder.write_text(f"Placeholder for icon {size}x{size}px\nReplace with actual PNG file")
        
        print(f"✓ Created placeholder for icon-{size}x{size}.png")
    
    print("\n✅ Icon placeholders created in public/icons/")
    print("💡 In production, generate actual PNG icons using PIL or ImageMagick")


if __name__ == '__main__':
    create_icons()
