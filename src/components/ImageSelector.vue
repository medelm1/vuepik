<script setup lang="ts">
import { ref, reactive, defineProps, defineEmits, watch } from 'vue';
import * as yup from 'yup';

// Define props if needed (for now, assuming no props)
const props = defineProps<{
    src?: string;
    supportedFormats?: string[];
    maxSize?: number;
    annotations?: boolean;
}>();

// Emit types
const emit = defineEmits<{
    (e: 'select', file: File): void;
    (e: 'reset'): void;
    (e: 'error', error: string): void;
}>();

const fileInput = ref<HTMLInputElement | null>(null);
const isDragging = ref<boolean>(false);

const state = reactive<{
    image: File | null;
    touched: boolean;
    error: string | null;
}>({
    image: null,
    touched: false,
    error: null,
});

const validImageFormats = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

// Set initial image from prop
watch(() => props.src, (newSrc) => {
    if (newSrc) {
        state.image = null;
    }
});

const previewUrl = (): string => {
    return state.image ? URL.createObjectURL(state.image) : props.src || '';
};

// Yup validation schema for image selection
const imageValidationSchema = yup.object({
    image: yup
        .mixed<File>()
        .test('fileFormat', (value) => {
            if (!value) return true;
            const allowedFormats = props.supportedFormats || validImageFormats;
            const fileExtension = value.name.split('.').pop()?.toLowerCase();
            const isImageFormat = validImageFormats.includes(fileExtension!);
            const isAllowedFormat = fileExtension ? allowedFormats.includes(fileExtension) : true; // Allow all valid formats if supportedFormats is not provided
            
            if (!isImageFormat) {
                return new yup.ValidationError(
                    `Unsupported file format: .${fileExtension}. Supported formats are: ${validImageFormats.join(', ')}.`
                );
            }

            if (!isAllowedFormat) {
                return new yup.ValidationError(
                    `Unsupported file format: .${fileExtension}. Allowed formats are: ${allowedFormats.join(', ')}.`
                );
            }

            return true;
        })
        .test('fileSize', (value) => {
            if (!value) return true;
            const maxFileSize = props.maxSize || 5 * 1024 * 1024; // Default to 5 MB
            const fileSizeMB = (value.size / 1024 / 1024).toFixed(2);
            const maxFileSizeMB = (maxFileSize / 1024 / 1024);
            
            if (value.size > maxFileSize) {
                return new yup.ValidationError(
                    `File size is too large: ${fileSizeMB}MB. Maximum allowed size is ${maxFileSizeMB}MB.`
                );
            }

            return true;
        })
        .required('Please select an image file')
        .label('Image'),
});

async function select(event: Event) {
    let file: File | null = null;

    function isDragEvent(event: Event): event is DragEvent {
        return 'dataTransfer' in event;
    }

    if (event instanceof Event && (event.target as HTMLInputElement | null)?.files) {
        const input = event.target as HTMLInputElement | null;
        if (input && input.files && input.files.length > 0) {
            file = input.files[0];
            if (!file) return;
        }
    } else if (isDragEvent(event)) {
        file = event.dataTransfer?.files[0] || null;
        if (!file) return;
    }

    if (!file) return;

    try {
        await imageValidationSchema.validate({ image: file });
        state.image = file;
        state.touched = true;
        state.error = null;
        emit('select', file);
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            state.error = error.errors[0];
            emit('error', error.errors[0]);
        }
    }
}

function reset() {
    if (state.image) {
        URL.revokeObjectURL(URL.createObjectURL(state.image));
    }
    state.image = null;
    state.touched = false;
    state.error = null;
    emit('reset');
}

const handleDrag = (isOver = false) => {
    isDragging.value = isOver;
};

const handleDrop = (event: DragEvent) => {
    isDragging.value = false;
    select(event);
};

const handleChange = (event: Event) => {
    select(event);
};

const handleReset = () => {
    isDragging.value = false;
    reset();
};

const handleBrowse = () => {
    fileInput.value?.click();
};
</script>
<template>
    <div :class="[
        'image-selector__wrapper', 
        { 'image-selector__selected': state.image || props.src },
        { 'drag-over': isDragging },
    ]"
        @drop.prevent="handleDrop"  
        @dragenter.prevent="handleDrag(true)" 
        @dragover.prevent="handleDrag(true)" 
        @dragleave.prevent="handleDrag()"
        role="button" 
        tabindex="0"
        aria-label="Image selector"
        @keydown.enter.prevent="handleBrowse"
    >
        <div class="image-selector__inner">
            <div v-if="state.image" class="image-selector__reset-btn" @click="handleReset">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            </div>
            <img v-if="state.image || props.src" class="image-selector__img" :src="previewUrl()" alt="" @click="handleBrowse">
            <div v-else class="image-selector__placeholder">
                <svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
                <div class="placeholder-text">
                    Drag and Drop file here or <span @click="handleBrowse">Choose file</span>
                </div>
            </div>
            <input 
                @change="handleChange" 
                type="file" 
                class="image-selector__file-input" 
                ref="fileInput" 
                accept="image/*" 
                aria-label="File input for image selection" 
            />
        </div>
        <div v-if="props.annotations" class="image-selector__annotations">
            <span v-if="props.supportedFormats && props.supportedFormats.length > 0" class="supported-formats">
                Supported formats: {{ props.supportedFormats.join(', ').toUpperCase() }}
            </span>
            <span v-else class="supported-formats">
                Supported formats: {{ validImageFormats.join(', ').toUpperCase() }}
            </span>
            <span class="maximum-size">
                Maximum size: {{ (props.maxSize && props.maxSize < 1024 * 1024) ? '< 1MB' : Math.floor((props.maxSize || 0) / 1024 / 1024) + 'MB' }}
            </span>
        </div>
        <div v-if="state.error" class="image-selector__error">
            <svg class="icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
            </svg>
            {{ state.error }}
        </div>
    </div>
</template>

<style scoped lang="scss">
.image-selector__wrapper {
    position: relative;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    width: 100%;
    overflow: hidden;
    font-family: 'Arial', sans-serif;
    border: none;
    outline: none;

    &:focus {
        .image-selector__inner {
            background: #F2F7FF;
            border-color: #0DA2E7;
        }
    }

    &.image-selector__selected {
        width: fit-content;
        padding: 4px;

        .image-selector__inner {
            border: 1px solid #E1E7EE;
        }
    }

    &:not(.image-selector__selected).drag-over {
        .image-selector__inner {
            background: #F2F7FF;
            border-color: #0DA2E7;
        }

        /* .image-selector__placeholder {
            .icon {
                color: #0066FF;
            }
        } */
    }

    .image-selector__inner {
        background: #FFF;
        position: relative;
        margin: 0;
        padding: 0;
        width: 100%;
        box-sizing: border-box;
        border: 2px dashed #E1E7EE;
        border-radius: 6px;
        transition: .1s;

        > img {
            margin: 0;
            padding: 0;
            cursor: pointer;
            width: 100%;
            vertical-align: bottom;
        }

        > input[type="file"] {
            position: absolute;
            top: 0;
            left: 0;
            visibility: hidden;
        }
    }

    .image-selector__reset-btn {
        position: absolute;
        top: 4px;
        right: 4px;

        .icon {
            width: 28px;
            color: #2A2A2A;
            cursor: pointer;
            z-index: 56;

            &:hover {
                color: #000;
            }
        }
    }

    .image-selector__placeholder {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 64px 0;
        transition: .1s;

        .icon {
            width: 64px;
            margin: 0;
            padding: 0;
            color: #141B2A;
        }

        .placeholder-text {
            margin-top: 12px;
            text-align: center;
            font-size: 16px;
            color: #141B2A;

            > span {
                text-decoration: underline;
                cursor: pointer;
                font-weight: 600;
            }
        }
    }

    .image-selector__annotations {
        display: flex;
        justify-content: space-between;
        margin-top: 10px;
        font-size: 15px;
        color: #8993A4;
    }

    .image-selector__error {
        padding: 0;
        margin-top: 10px;
        color: #C02F36;
        font-size: 14px;
        display: flex;
        justify-content: start;
        align-items: center;

        .icon {
            width: 18px;
            margin-right: 2px
        }
    }
}
</style>
