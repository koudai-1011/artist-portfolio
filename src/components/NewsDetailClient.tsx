'use client';

import { useState, useEffect } from 'react';
import Lightbox from './Lightbox';

type Props = {
    content: string;
    title: string;
};

type ImageData = {
    url: string;
    height: number;
    width: number;
};

export default function NewsDetailClient({ content, title }: Props) {
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [images, setImages] = useState<ImageData[]>([]);

    // Extract images from content and add click handlers
    useEffect(() => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        const imgElements = tempDiv.querySelectorAll('img');

        const extractedImages: ImageData[] = [];
        imgElements.forEach((img) => {
            extractedImages.push({
                url: img.src,
                height: parseInt(img.getAttribute('height') || '600'),
                width: parseInt(img.getAttribute('width') || '800'),
            });
        });

        setImages(extractedImages);

        // Add click handlers to images
        const contentDiv = document.getElementById('news-content');
        if (contentDiv) {
            const images = contentDiv.querySelectorAll('img');
            images.forEach((img, index) => {
                img.style.cursor = 'pointer';
                img.addEventListener('click', () => {
                    setCurrentImageIndex(index);
                    setIsLightboxOpen(true);
                });
            });
        }
    }, [content]);

    const handleNext = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const handlePrevious = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <>
            {/* Rich Editor Content */}
            <div
                id="news-content"
                className="prose prose-lg dark:prose-invert max-w-none prose-img:rounded-lg prose-a:text-blue-600 dark:prose-a:text-blue-400 [&>p]:whitespace-pre-wrap [&>p]:break-words"
                dangerouslySetInnerHTML={{ __html: content }}
            />

            {/* Lightbox */}
            {isLightboxOpen && images.length > 0 && (
                <Lightbox
                    images={images}
                    currentIndex={currentImageIndex}
                    onClose={() => setIsLightboxOpen(false)}
                    onNext={handleNext}
                    onPrevious={handlePrevious}
                    alt={title}
                />
            )}
        </>
    );
}
