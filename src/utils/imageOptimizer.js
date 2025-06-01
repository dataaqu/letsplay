// Image optimization utility
// This helps generate optimized versions of images

const QUALITY_SETTINGS = {
  high: 0.9,
  medium: 0.7,
  low: 0.5,
  thumbnail: 0.3
};

const SIZES = {
  thumbnail: { width: 50, height: 50 },
  small: { width: 400, height: 300 },
  medium: { width: 800, height: 600 },
  large: { width: 1200, height: 900 }
};

class ImageOptimizer {
  // Convert image to WebP format with quality control
  static async convertToWebP(imageFile, quality = 0.8) {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        // Convert to WebP with quality
        canvas.toBlob(resolve, 'image/webp', quality);
      };
      
      img.src = URL.createObjectURL(imageFile);
    });
  }

  // Resize image to specific dimensions
  static async resizeImage(imageFile, targetWidth, targetHeight, quality = 0.8) {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        
        // Calculate aspect ratio
        const aspectRatio = img.width / img.height;
        const targetAspectRatio = targetWidth / targetHeight;
        
        let sourceX = 0, sourceY = 0, sourceWidth = img.width, sourceHeight = img.height;
        
        if (aspectRatio > targetAspectRatio) {
          // Image is wider than target
          sourceWidth = img.height * targetAspectRatio;
          sourceX = (img.width - sourceWidth) / 2;
        } else {
          // Image is taller than target
          sourceHeight = img.width / targetAspectRatio;
          sourceY = (img.height - sourceHeight) / 2;
        }
        
        ctx.drawImage(
          img, 
          sourceX, sourceY, sourceWidth, sourceHeight,
          0, 0, targetWidth, targetHeight
        );
        
        // Convert to WebP or JPEG
        const format = 'image/webp';
        canvas.toBlob(resolve, format, quality);
      };
      
      img.src = URL.createObjectURL(imageFile);
    });
  }

  // Generate blur placeholder (very small, low quality)
  static async generateBlurPlaceholder(imageFile) {
    const blurBlob = await this.resizeImage(imageFile, 20, 15, 0.1);
    return URL.createObjectURL(blurBlob);
  }

  // Generate multiple sizes for responsive images
  static async generateResponsiveSizes(imageFile) {
    const sizes = {};
    
    for (const [sizeName, dimensions] of Object.entries(SIZES)) {
      const quality = sizeName === 'thumbnail' ? QUALITY_SETTINGS.low : QUALITY_SETTINGS.medium;
      sizes[sizeName] = await this.resizeImage(
        imageFile, 
        dimensions.width, 
        dimensions.height, 
        quality
      );
    }
    
    return sizes;
  }
}

// Preload images with different strategies
export const preloadStrategies = {
  // Critical images - load immediately
  critical: (src) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  },

  // Important images - load after critical
  important: (src) => {
    setTimeout(() => {
      const img = new Image();
      img.src = src;
    }, 100);
  },

  // Secondary images - load when idle
  secondary: (src) => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        const img = new Image();
        img.src = src;
      });
    } else {
      setTimeout(() => {
        const img = new Image();
        img.src = src;
      }, 1000);
    }
  }
};

// WebP support detection
export const supportsWebP = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
};

export default ImageOptimizer;
