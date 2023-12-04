export const calculateDominantColor = (
  imgElement: HTMLImageElement,
  sampleSize: number
): string => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  canvas.width = imgElement.width;
  canvas.height = imgElement.height;
  ctx.drawImage(imgElement, 0, 0, imgElement.width, imgElement.height);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

  const colorMap = new Map<string, number>();
  const sampleRate = Math.floor(imageData.length / 4 / sampleSize);

  for (let i = 0; i < imageData.length; i += sampleRate * 4) {
    const rgb = `${imageData[i]},${imageData[i + 1]},${imageData[i + 2]}`;
    const count = (colorMap.get(rgb) || 0) + 1;
    colorMap.set(rgb, count);
  }

  let maxFrequency = 0;
  let dominantRGB = "";

  colorMap.forEach((count, rgb) => {
    if (count > maxFrequency) {
      maxFrequency = count;
      dominantRGB = rgb;
    }
  });

  return `rgb(${dominantRGB})`;
};

export const fetchImageAndCalculateDominantColor = (
  imageUrl: string,
  sampleSize: number
): Promise<string> => {
  return new Promise((resolve, reject) => {
    fetch(
      `http://localhost:5000/proxyImage?url=${encodeURIComponent(imageUrl)}`
    )
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
            const dominantColor = calculateDominantColor(img, sampleSize);
            resolve(dominantColor);
          };
        };
      })
      .catch((error) => {
        reject("Failed to load the image");
      });
  });
};
