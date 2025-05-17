"use client";

import React, { useRef, useState } from "react";
import ImageKit from "imagekit";
import { IKImage, ImageKitProvider, IKUpload } from "imagekitio-next";
import config from "@/lib/config";
import Image from "next/image";

const {
  env: {
    imagekit: { urlEndpoint, publicKey, privateKey },
  },
} = config;

const authenticator = async () => {
  try {
    const response = await fetch(`${config.env.apiEndpoint}/api/auth/imagekit`);

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`
      );
    }

    const data = await response.json();
    const { signature, token, expire } = data;

    return { signature, token, expire };
  } catch (error: any) {
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

const ImageUploader = ({ onFileChange}: {onFileChange: (filePath: string) => void}) => {
  const ikUploadRef = useRef(null);
  const [file, setFile] = useState<{ filePath: string } | null>(null);

  const onError = (error: any) => {console.log(error)};
  const onSuccess = (res: any) => {
		setFile(res)
		onFileChange(res.filePath)
	};

  return (
    <ImageKitProvider
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticator={authenticator}
    >
      <IKUpload
        className="hidden"
        ref={ikUploadRef}
        onError={onError}
        onSuccess={onSuccess}
        fileName="test-upload.png"
      />
      <button className="upload-btn"
			onClick={(e) => {
				e.preventDefault()
				// @ts-ignore
				if(ikUploadRef.current?.click())
			}}
			>
        <Image
          src="/icons/upload.svg"
          alt="upload-icon"
          width={20}
          height={20}
          className="object-contain"
        />
        <p className="text-base text-light-100">Upload a File</p>
        {file && <p className="upload-filename">{file.filePath}</p>}
        {file && (
          <IKImage
            alt={file.filePath}
            path={file.filePath}
            width={500}
            height={500}
          />
        )}
      </button>
    </ImageKitProvider>
  );
};

export default ImageUploader;
