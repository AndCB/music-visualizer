import React, { useRef, useState } from "react";

interface DragNDropProps {
  onFilesSelected: (files: File[]) => void;
  width?: number;
  height?: number;
}

const DragNDrop: React.FC<DragNDropProps> = ({
  onFilesSelected,
  width,
  height,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    // Only set false if we're actually leaving the drop zone (not entering a child)
    if (event.currentTarget === event.target || !event.currentTarget.contains(event.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const files = Array.from(event.dataTransfer.files);
    if (files.length > 0) onFilesSelected(files);
  };

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files) {
      const fileList = Array.from(files);
      onFilesSelected(fileList);
    }
  };

  const handleBrowseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          border-dashed border-2 rounded-3xl flex justify-center items-center text-center
          transition-all duration-200 ease-in-out
          bg-white/5 backdrop-blur-sm
          ${
            isDragging
              ? "border-white/70 scale-[1.02] bg-white/10"
              : "border-white/30"
          }
        `}
        style={{
          width: width || "100%",
          height: height || "100%",
          minHeight: "6em",
          minWidth: "6em",
        }}
      >
        <div className={`transition-transform duration-200 ${isDragging ? "scale-110" : ""}`}>
          <p className="text-white/80 w-5/6 mx-auto">
            {isDragging ? (
              <span className="font-bold">Drop your files here! 🎵</span>
            ) : (
              <>
                Drop your music here, or{" "}
                <a href="#" onClick={handleBrowseClick}>
                  <u>click here to browse</u>
                </a>
              </>
            )}
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileInputChange}
          multiple
          accept=".mp3,.wav,.ogg,.flac,.aac,.m4a"
        />
      </div>
    </>
  );
};

export default DragNDrop;
