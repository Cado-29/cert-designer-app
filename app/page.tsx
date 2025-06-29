"use client";

import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import * as fabric from "fabric";

export default function Home() {
  const [template, setTemplate] = useState<string | null>(null);
  const { editor, onReady } = useFabricJSEditor();

  useEffect(() => {
    console.log("Editor initialized:", editor);
  }, [editor]);

  useEffect(() => {
    if (!template || !editor || !editor.canvas) return;

    const canvasWidth = 800;
    const canvasHeight = 600;

    editor.canvas.setWidth(canvasWidth);
    editor.canvas.setHeight(canvasHeight);
    editor.canvas.clear();

    const imgElement = new window.Image();
    imgElement.onload = () => {
      const imgInstance = new fabric.Image(imgElement, {
        left: 0,
        top: 0,
        selectable: false,
        evented: false,
        hoverCursor: "default",
      });

      imgInstance.scaleToWidth(canvasWidth);
      imgInstance.scaleToHeight(canvasHeight);

      editor.canvas.add(imgInstance);
      (imgInstance as any).sendToBack();
      editor.canvas.renderAll();

      console.log("Image added to canvas successfully");
    };

    imgElement.onerror = (err) => {
      console.error("Failed to load image", err);
    };

    imgElement.src = template;
  }, [template, editor]);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      setTemplate(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const addTextField = (text = "Edit me") => {
    if (!editor) return;

    const iText = new fabric.IText(text, {
      left: 100,
      top: 100,
      fontSize: 24,
      fill: "#000",
      backgroundColor: "rgba(255,255,255,0.5)",
      borderColor: "gray",
      cornerColor: "blue",
      cornerSize: 6,
      padding: 5,
      editable: true,
    });

    editor.canvas.add(iText);
    editor.canvas.setActiveObject(iText);
    editor.canvas.renderAll();
  };

  const addRectangle = () => {
    if (!editor) return;

    const rect = new fabric.Rect({
      left: 150,
      top: 150,
      width: 200,
      height: 100,
      fill: "rgba(0,123,255,0.5)",
      stroke: "#0056b3",
      strokeWidth: 2,
      cornerColor: "blue",
      cornerSize: 6,
      transparentCorners: false,
    });

    editor.canvas.add(rect);
    editor.canvas.setActiveObject(rect);
    editor.canvas.renderAll();
  };

  // NEW: Download canvas as PNG image
  const downloadCanvasImage = () => {
    if (!editor || !editor.canvas) return;

    const dataURL = editor.canvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 1,
    });

    // Create a temporary link and trigger download
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "certificate.png";
    link.click();
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div style={{ display: "flex", gap: 20 }}>
      {/* Sidebar with predefined elements */}
      <div
        style={{
          width: 200,
          border: "1px solid #ccc",
          padding: 10,
          borderRadius: 6,
          userSelect: "none",
        }}
      >
        <h3>Predefined Elements</h3>
        <button
          onClick={() => addTextField("Certificate Title")}
          style={{ width: "100%", marginBottom: 10 }}
        >
          Add Title Text
        </button>

        <button
          onClick={() => addTextField("Recipient Name")}
          style={{ width: "100%", marginBottom: 10 }}
        >
          Add Name Text
        </button>

        <button
          onClick={() => addTextField("Recipient Name")}
          style={{ width: "100%", marginBottom: 10 }}
        >
          Text Field
        </button>

        <hr style={{ margin: "20px 0" }} />

        {/* Image upload dropzone */}
        <div
          {...getRootProps()}
          style={{
            border: "2px dashed black",
            padding: 20,
            cursor: "pointer",
            textAlign: "center",
            userSelect: "none",
          }}
        >
          <input {...getInputProps()} />
          <p>Drag & drop template image here<br />or click to select file</p>
        </div>

        {/* NEW: Download button */}
        <button
          onClick={downloadCanvasImage}
          style={{
            marginTop: 20,
            width: "100%",
            padding: "10px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Download Image
        </button>
      </div>

      {/* Canvas container */}
      <div
        style={{
          border: "1px solid #ccc",
          width: 800,
          height: 600,
          position: "relative",
        }}
      >
        <FabricJSCanvas className="canvas" onReady={onReady} />
      </div>
    </div>
  );
}
