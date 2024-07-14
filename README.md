# VUEPIK

A Vue 3 plugin for comprehensive image handling features, starting with an image selector and planned to include cropping, resizing, editing, gallery, lazy loading, carousel, zoom, annotations, and comparison.

## Features

### Current Features

1. **Image Selector**
    - Single image selection.
    - Drag and drop functionality.
    - Image preview before uploading.
    - File size and type validation.

### Planned Features
2. **Image Cropper**
    - Crop images to specified aspect ratios.
    - Free-form cropping.
    - Zoom and rotate functionality.
    - Preview the cropped image.

3. **Image Resizer**
    - Resize images to specific dimensions.
    - Maintain aspect ratio while resizing.
    - Compress images to reduce file size.

4. **Image Editor**
    - Basic editing tools: brightness, contrast, saturation, and filters.
    - Drawing tools: pen, shapes, and text overlay.
    - Undo and redo functionality.
    - Save edited image.

5. **Image Gallery**
    - Display a gallery of images with lightbox functionality.
    - Support for pagination and lazy loading.
    - Image sorting and filtering options.

6. **Image Lazy Loader**
    - Lazy load images as they come into the viewport.
    - Placeholder image while loading.
    - Error handling for failed image loads.

7. **Image Carousel/Slider**
    - Create responsive image carousels.
    - Customizable transition effects.
    - Auto-play and manual navigation options.
    - Thumbnail navigation.

8. **Image Zoom**
    - Zoom in and out functionality on hover or click.
    - Magnifying glass effect.

9. **Image Annotations**
    - Allow users to add annotations to images.
    - Save and edit annotations.

10. **Image Comparison Slider**
    - Side-by-side comparison of images with a draggable slider.

## Installation

You can install `vuepik` via npm:

```bash
npm install vuepik
```
## Usage

### Basic Setup

```javascript
// main.ts or main.js
import { createApp } from 'vue';
import App from './App.vue';
import vuepik from 'vuepik';
import 'vuepik/style.css';

const app = createApp(App);
app.use(vuepik);
app.mount('#app');
```

### Image Selector Component

```html
<template>
  <div>
    <ImageSelector
      :src="initialImage"
      :supported-formats="['jpg', 'png', 'gif']"
      :max-size="5 * 1024 * 1024"
      @select="handleSelect"
      @reset="handleReset"
      @error="handleError"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const initialImage = ref('https://example.com/initial-image.jpg');

const handleSelect = (file: File) => {
  console.log('Selected file:', file);
};

const handleReset = () => {
  console.log('Image reset');
};

const handleError = (error: string) => {
  console.error('Error:', error);
};
</script>

<style scoped>
/* Add your styles here */
</style>
```

## Props
- `src`: ***String*** (optional) - Initial image source URL.
- `supported-formats`: ***Array*** (optional) - List of supported image formats.
- `max-size`: ***Number*** (optional) - Maximum file size in bytes.
- `annotations`: ***Boolean*** (optional) - Whether to show annotations information.

## Events
- `@select`: Emitted when an image is selected, returns the selected file.
- `@reset`: Emitted when the selected image is reset.
- `@error`: Emitted when there is an error, returns the error message.

## Development

### Project Setup
```bash
npm install
```

### Compile and Hot-Reload for Development
```bash
npm run dev
```

### Type-Check, Compile and Minify for Production
```bash
npm run build
```

### Preview the Production Build
```bash
npm run preview
```

## Contributing

Contributions are welcome! Please check the [issues](https://github.com/medelm1/vuepik/issues) for new features or report any bugs you find.

## License

MIT