import React, { useEffect, useState } from "react";
import { calculateDominantColor } from "../dominantColorUtils";

interface DominantColorImageProps {
  imageUrl: string;
  sampleSize?: number;
}

const DominantColorImage: React.FC<DominantColorImageProps> = ({
  imageUrl,
  sampleSize = 1000,
}) => {
  const [dominantColor, setDominantColor] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);

  useEffect(() => {
    fetch(imageUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.blob();
      })
      .then((blob) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64data = reader.result as string;
          const img = new Image();
          img.src = base64data;
          img.crossOrigin = "Anonymous"; // Set crossOrigin attribute

          img.onload = () => {
            const color = calculateDominantColor(img, sampleSize); // Use the utility function
            setDominantColor(color);
            setIsImageLoaded(true);
          };
        };
      })
      .catch((error) => {
        setError("Failed to load the image");
      });
  }, [imageUrl, sampleSize]);

  return (
    <div className="relative w-80 h-80">
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-200">
          {error}
        </div>
      )}
      {/* {isImageLoaded && !error && ( */}
      <div
        className={`flex justify-center items-center w-80 h-80`}
        style={{ background: dominantColor }}
      >
        <img
          src={imageUrl}
          alt="Fetched Image"
          className="block w-60 h-60 object-contain"
        />
      </div>
      {/* )} */}
      {!isImageLoaded && !error && (
        <div className="absolute top-0 left-0 w-full h-full bg-gray-300 animate-pulse flex items-center justify-center">
          Loading...
        </div>
      )}
    </div>
  );
};

export default DominantColorImage;
