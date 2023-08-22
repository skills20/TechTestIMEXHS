import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-section1',
  templateUrl: './section1.component.html',
  styleUrls: ['./section1.component.scss']
})
export class Section1Component {
  @ViewChild('imageElement') imageElement: ElementRef;
  canvas: HTMLCanvasElement | null = null;
  ctx: CanvasRenderingContext2D | null = null;
  dots: number = 0;
  areaOfBlackPixels: number = 0;
  uploadedAreaOfBlackPixels = 0;
  selectedImage: File | null = null;

  constructor() { }

  ngAfterViewInit() {
    this.loadImage();
  }

  calculateArea(){
    if (this.ctx) {
      const imageData = this.ctx.getImageData(0, 0, this.canvas!.width, this.canvas!.height);
      const pixels = imageData.data;
      let blackPixelCount = 0;
      
      for (let i = 0; i < this.dots; i ++) {
        let randomPixel = Math.floor((Math.random() * pixels.length) + 1);
        if (pixels[randomPixel] === 0 && pixels[randomPixel + 1] === 0 && pixels[randomPixel + 2] === 0) {
          blackPixelCount++;
        }
      }

      this.areaOfBlackPixels = (blackPixelCount/this.dots)*100*4;
      console.log('black pixels count: ' + blackPixelCount);
      console.log('Area of black pixels: ' + this.areaOfBlackPixels + '%');
    } else {
      console.error('Canvas 2D context is null');
    }
  }

  onFileSelected(event: any) {
    this.selectedImage = event.target.files[0];
    this.analyzeImage();
  }

  analyzeImage() {
    if (!this.selectedImage) {
      console.error('No image selected.');
      return;
    }

    // Create an HTMLImageElement and set its source to the selected image
    const img = new Image();
    img.src = URL.createObjectURL(this.selectedImage);

    img.onload = () => {
      // Create a canvas and draw the image on it
      const uploadedcanvas = document.createElement('canvas');
      const uploadctx = uploadedcanvas.getContext('2d');
      uploadedcanvas.width = img.width;
      uploadedcanvas.height = img.height;
      uploadctx!.drawImage(img, 0, 0);

      // Get the pixel data
      const imageData = uploadctx!.getImageData(0, 0, uploadedcanvas.width, uploadedcanvas.height);
      const pixels = imageData.data;

      // Initialize a variable to count black pixels
      let blackPixelCount = 0;

      // Loop through pixel data and count black pixels
      for (let i = 0; i < pixels.length; i += 4) {
        // Check if the pixel is black (assuming RGB 0,0,0)
        if (pixels[i] === 0 && pixels[i + 1] === 0 && pixels[i + 2] === 0) {
          blackPixelCount++;
        } else {
          pixels[i] = 255;
          pixels[i+1] = 255;
          pixels[i+2] = 255;
        }
      }

      uploadctx!.putImageData(imageData, 0, 0);
      // Convert the canvas content to a data URL
      const modifiedImageDataUrl = uploadedcanvas.toDataURL("image/png"); // You can specify the desired image format (e.g., "image/jpeg")

      // Get the <img> element
      const outputImage = document.getElementById("output-image") as HTMLImageElement;;

      // Set the data URL as the src attribute of the <img> element
      outputImage!.src = modifiedImageDataUrl;
      // Output the black pixel count
      this.uploadedAreaOfBlackPixels = (blackPixelCount/pixels.length)*100*4;
      console.log('Black Pixel Area of uploaded image:', this.uploadedAreaOfBlackPixels, '%');
    };
  }

  loadImage() {
    const img = new Image();
    img.src = '../../assets/spot.PNG';
    img.onload = () => {
      this.canvas = document.createElement('canvas');
      this.canvas.width = img.width;
      this.canvas.height = img.height;
      this.ctx = this.canvas.getContext('2d');

      if (this.ctx) {
        this.ctx.drawImage(img, 0, 0);
        this.processImage();
      } else {
        console.error('Canvas 2D context is null');
      }
    };
  }

  processImage() {
    if (this.ctx) {
      const imageData = this.ctx.getImageData(0, 0, this.canvas!.width, this.canvas!.height);
      const pixels = imageData.data;
      let blackPixelCount = 0;

      for (let i = 0; i < pixels.length; i += 4) {
        if (pixels[i] === 0 && pixels[i + 1] === 0 && pixels[i + 2] === 0) {
          blackPixelCount++;
        } 
      }

      const areaOfBlackePixels = (blackPixelCount/pixels.length)*100*4;
      console.log('black pixel count: ' + blackPixelCount + ' from total pixel: ' + pixels.length)
      console.log('Area of black pixels: ' + areaOfBlackePixels + '%');
    } else {
      console.error('Canvas 2D context is null');
    }
  }
}
