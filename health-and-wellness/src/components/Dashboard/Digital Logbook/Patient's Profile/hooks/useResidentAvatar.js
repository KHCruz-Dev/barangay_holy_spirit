import { useEffect, useState } from "react";
import DefaultAvatar from "../../../../../assets/images/default-avatar.png";
import { useAvatarCaptureUpload } from "../../../../../hooks/useAvatarCaptureUpload";

export function useResidentAvatar(existingImageUrl) {
  const {
    avatarPreview,
    avatarFile,
    isCameraOpen,
    videoDevices,
    selectedDeviceId,

    videoRef,
    canvasRef,
    fileInputRef,

    handleUploadClick,
    handleFileChange,
    openCamera,
    closeCamera,
    handleCapture,
    resetAvatar,
    switchCamera,
  } = useAvatarCaptureUpload(
    typeof existingImageUrl === "string" && existingImageUrl.trim() !== ""
      ? existingImageUrl
      : DefaultAvatar
  );

  const [safeAvatarSrc, setSafeAvatarSrc] = useState(
    avatarPreview || DefaultAvatar
  );

  useEffect(() => {
    setSafeAvatarSrc(avatarPreview || DefaultAvatar);
  }, [avatarPreview]);

  return {
    // state
    avatarPreview,
    avatarFile,
    safeAvatarSrc,
    isCameraOpen,
    videoDevices,
    selectedDeviceId,

    // refs
    videoRef,
    canvasRef,
    fileInputRef,

    // actions
    handleUploadClick,
    handleFileChange,
    openCamera,
    closeCamera,
    handleCapture,
    resetAvatar,
    switchCamera,
  };
}
