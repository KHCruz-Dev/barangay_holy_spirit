import { useState, useRef, useEffect } from "react";
import DefaultAvatar from "../assets/images/default-avatar.png";

export function useAvatarCaptureUpload(initialImage = DefaultAvatar) {
  const [avatarPreview, setAvatarPreview] = useState(initialImage);
  const [avatarFile, setAvatarFile] = useState(null);

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [videoDevices, setVideoDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  /* ===========================
     🔥 CACHE-BUST EXISTING IMAGE
  =========================== */
  useEffect(() => {
    if (initialImage && initialImage !== DefaultAvatar) {
      // 🔥 force refetch from S3
      setAvatarPreview(`${initialImage}?v=${Date.now()}`);
    } else {
      setAvatarPreview(DefaultAvatar);
    }

    setAvatarFile(null);
  }, [initialImage]);

  /* ===========================
     FILE UPLOAD
  =========================== */
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);

    setAvatarFile(file);
  };

  /* ===========================
     CAMERA ENUMERATION
  =========================== */
  const loadCameras = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter((d) => d.kind === "videoinput");

    setVideoDevices(cameras);

    const preferred =
      cameras.find((c) =>
        /usb|external|logitech|brio|dslr|cam/i.test(c.label),
      ) || cameras[0];

    if (preferred) setSelectedDeviceId(preferred.deviceId);
  };

  /* ===========================
     OPEN CAMERA
  =========================== */
  const openCamera = async () => {
    try {
      await loadCameras();

      const constraints = {
        video: {
          deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30 },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      streamRef.current = stream;
      setIsCameraOpen(true);
    } catch (err) {
      console.error("Camera error:", err);
      alert("Unable to access camera.");
    }
  };

  /* ===========================
     ATTACH STREAM
  =========================== */
  useEffect(() => {
    if (isCameraOpen && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [isCameraOpen]);

  /* ===========================
     SWITCH CAMERA
  =========================== */
  const switchCamera = async (deviceId) => {
    setSelectedDeviceId(deviceId);

    streamRef.current?.getTracks().forEach((t) => t.stop());

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { deviceId: { exact: deviceId } },
    });

    streamRef.current = stream;
    videoRef.current.srcObject = stream;
  };

  /* ===========================
     CAPTURE
  =========================== */
  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;

        setAvatarPreview(URL.createObjectURL(blob));
        setAvatarFile(
          new File([blob], "captured.jpg", {
            type: "image/jpeg",
          }),
        );
      },
      "image/jpeg",
      0.98,
    );

    closeCamera();
  };

  /* ===========================
     CLOSE / RESET
  =========================== */
  const closeCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setIsCameraOpen(false);
  };

  const resetAvatar = () => {
    closeCamera();
    setAvatarPreview(DefaultAvatar);
    setAvatarFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return {
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
  };
}
