"use client";
import React, { useState } from "react";
import Dropzone from "react-dropzone";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Loader from "./UtilityComponents/Loader";

const ImageConverter = () => {
  const [image, setImage] = useState(null);
  const [convertImageType, setConvertImageType] = useState("JSON-XML");
  const [loading, setLoading] = useState(false);

  //   function for selecting uploaded image.
  const handleFileChange = (acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    setImage(selectedFile);
  };

  //   function for sending image to the api and fetching the converted image.
  const handleConvert = async (e) => {
    if (!image) return alert("Please upload a image first");
    setLoading(true);

    const formData = new FormData();
    formData.append("image", image);
    formData.append("convertImageType", convertImageType);

    const response = await fetch("/api/imageConverter", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      setLoading(false);
      return alert("Error converting image");
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;

    const ext = convertImageType === "png-jpeg" ? "jpg" : "png";

    a.download = `${image.name}.${ext}`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    setLoading(false);
  };
  return (
    <div className="flex flex-col items-center w-full px-4 sm:px-6 md:px-8">
      {/* Card Container */}
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl border border-gray-200 p-6 sm:p-10 mt-2">
        {/* Dropzone or Image Preview */}
        {!image ? (
          <Dropzone onDrop={handleFileChange}>
            {({ getRootProps, getInputProps, isDragActive }) => (
              <div
                {...getRootProps()}
                className={`flex flex-col items-center justify-center w-full px-6 py-10 sm:py-16 text-center border-2 border-dashed rounded-2xl transition-all duration-300 ${
                  isDragActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 bg-gray-50"
                } cursor-pointer`}
              >
                <input {...getInputProps()} />
                <div className="space-y-3">
                  <div className="text-4xl">🖼️</div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">
                    {isDragActive
                      ? "Drop the image here..."
                      : "Drag & Drop an Image to Upload"}
                  </h2>
                  <p className="text-sm text-gray-500">
                    or click to select from your device
                  </p>
                </div>
              </div>
            )}
          </Dropzone>
        ) : (
          <div className="flex flex-col items-center justify-center w-full text-center px-4 py-16 bg-gray-50 rounded-2xl">
            <div className="text-5xl mb-2">✅</div>
            <p className="text-lg font-medium text-gray-700 break-words max-w-full">
              {image.name}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Image ready for conversion
            </p>
          </div>
        )}

        {/* Divider */}
        <div className="w-full border-t border-gray-200 my-8" />

        {/* Conversion Options */}
        <div className="w-full max-w-md mx-auto">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Select Image Conversion Type
          </label>
          <Select value={convertImageType} onValueChange={setConvertImageType}>
            <SelectTrigger className="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800">
              <SelectValue placeholder="Choose conversion" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="uppercase" value="jpeg-png">
                jpeg → png
              </SelectItem>
              <SelectItem className="uppercase" value="png-jpeg">
                png → jpeg
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Convert Button */}
        <div className="mt-8 w-full flex justify-center">
          <button
            onClick={() => handleConvert(convertImageType)}
            disabled={loading}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            }`}
          >
            {loading ? <Loader /> : "Convert Image"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageConverter;
