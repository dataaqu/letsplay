// Image preloader utility for better performance
import backgroundImage from '../imgs/back2.jpg';
import pitchImage from '../imgs/pitch.jpg';
import pitch2Image from '../imgs/pitch2.jpg';
import cardBackImage from '../imgs/cardBack.jpg';

class ImagePreloader {
  constructor() {
    this.loadedImages = new Map();
    this.loadingPromises = new Map();
    this.criticalImages = [
      { src: backgroundImage, key: 'background' }
    ];
    this.secondaryImages = [
      { src: cardBackImage, key: 'cardBack' },
      { src: pitchImage, key: 'pitch' },
      { src: pitch2Image, key: 'pitch2' }
    ];
  }

  // Preload a single image with better optimization
  preloadImage(src, key, priority = 'auto') {
    if (this.loadedImages.has(key)) {
      return Promise.resolve(this.loadedImages.get(key));
    }

    if (this.loadingPromises.has(key)) {
      return this.loadingPromises.get(key);
    }

    const promise = new Promise((resolve, reject) => {
      const img = new Image();
      
      // Optimize image loading
      img.decoding = 'async';
      img.loading = priority === 'high' ? 'eager' : 'lazy';
      
      // Add crossorigin for better caching
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        this.loadedImages.set(key, src);
        this.loadingPromises.delete(key);
        console.log(`✅ Loaded image: ${key}`);
        resolve(src);
      };
      
      img.onerror = () => {
        this.loadingPromises.delete(key);
        console.warn(`❌ Failed to load image: ${key}`);
        reject(new Error(`Failed to load image: ${src}`));
      };
      
      img.src = src;
    });

    this.loadingPromises.set(key, promise);
    return promise;
  }

  // Preload critical images first with high priority
  async preloadCriticalImages() {
    console.log('🚀 Loading critical images...');
    try {
      const promises = this.criticalImages.map(({ src, key }) => 
        this.preloadImage(src, key, 'high')
      );
      await Promise.all(promises);
      console.log('✅ Critical images loaded successfully');
      return true;
    } catch (error) {
      console.warn('⚠️ Some critical images failed to load:', error);
      return false;
    }
  }

  // Preload secondary images with delay to avoid blocking
  preloadSecondaryImages() {
    console.log('📸 Loading secondary images...');
    this.secondaryImages.forEach(({ src, key }, index) => {
      // Stagger loading to prevent blocking
      setTimeout(() => {
        this.preloadImage(src, key, 'auto').catch(error => 
          console.warn(`Failed to preload ${key}:`, error)
        );
      }, index * 200);
    });
  }

  // Check if image is loaded
  isImageLoaded(key) {
    return this.loadedImages.has(key);
  }

  // Get loaded image URL
  getImageUrl(key) {
    return this.loadedImages.get(key);
  }

  // Preload all images with smart priority
  async preloadAll() {
    // Load critical images first
    await this.preloadCriticalImages();
    
    // Add small delay before loading secondary images
    setTimeout(() => {
      this.preloadSecondaryImages();
    }, 300);
  }

  // Force preload with resource hints
  addResourceHints() {
    this.criticalImages.forEach(({ src, key }) => {
      const link = document.createElement('link');      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      link.onload = () => console.log(`Resource hint loaded: ${key}`);
      document.head.appendChild(link);
    });
  }
}

// Create singleton instance
const imagePreloader = new ImagePreloader();

// Add resource hints immediately
if (typeof window !== 'undefined') {
  imagePreloader.addResourceHints();
}

export default imagePreloader;

// Export individual images for direct import
export {
  backgroundImage,
  pitchImage,
  pitch2Image,
  cardBackImage
};
