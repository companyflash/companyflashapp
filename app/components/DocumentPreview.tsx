// app/components/DocumentPreview.tsx
'use client';

import { useState } from 'react';
import { Document, Page } from 'react-pdf'; // React-PDF library for PDF rendering
import Image from 'next/image';  // Next Image component for displaying images

interface DocumentPreviewProps {
  fileUrl: string;
}

export default function DocumentPreview({ fileUrl }: DocumentPreviewProps) {
  const [numPages, setNumPages] = useState<number>(0);

  const onLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const isPdf = fileUrl.endsWith('.pdf');

  return (
    <div className="mt-4">
      {isPdf ? (
        <div>
          <Document
            file={fileUrl}
            onLoadSuccess={onLoadSuccess}
            className="border p-4 rounded bg-white shadow"
          >
            {Array.from(new Array(numPages), (el, index) => (
              <Page key={index} pageNumber={index + 1} />
            ))}
          </Document>
        </div>
      ) : (
        <Image
          src={fileUrl}
          alt="Uploaded File"
          className="w-full h-auto"
          width={600}  // Set a width for the image
          height={400} // Set a height for the image
        />
      )}
    </div>
  );
}
