import React, { useRef } from "react";

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    onFilesSelected(files);
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

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  return (
    <>
      <div
        onDrop={handleDrop}
        onDragOver={(event) => event.preventDefault()}
        className="border-dashed border-2 rounded-3xl flex justify-center items-center text-center border-primary-light dark:border-primary-dark"
        style={{
          width: width || "100%",
          height: height || "100%",
          minHeight: "10em",
          minWidth: "10em",
        }}
      >
        <p className="text-primary-light dark:text-primary-dark w-5/6">
          Drop your music here, or{" "}
          <a href="#" onClick={handleBrowseClick}>
            <u>click here to browse</u>
          </a>
        </p>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileInputChange}
          multiple
          accept=".mp3"
        />
      </div>
    </>
  );
};

export default DragNDrop;
