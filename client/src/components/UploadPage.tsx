import { useState } from "react";
import type { ProcessingResult } from "../types";

interface UploadPageProps {
  onComplete: (result: ProcessingResult) => void;
}

export default function UploadPage({ onComplete }: UploadPageProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (!selected.name.toLowerCase().endsWith(".csv")) {
        setError("Please select a CSV file");
        setFile(null);
        return;
      }
      setFile(selected);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(
        "https://xeno-server-vqfb.onrender.com/api/upload",
        {
          method: "POST",
          body: formData,
        },
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Upload failed");
      }

      const result: ProcessingResult = await res.json();
      onComplete(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="card upload-card">
        <h1>CSV Transaction Validator</h1>
        <p className="subtitle">
          Upload a transaction CSV file for validation and processing
        </p>

        <div className="upload-zone">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            disabled={loading}
            id="file-input"
            className="file-input"
          />
          <label htmlFor="file-input" className="file-label">
            {file ? file.name : "Choose a CSV file"}
          </label>
        </div>

        {file && !loading && (
          <button
            onClick={handleUpload}
            className="btn btn-primary"
            disabled={loading}
          >
            Upload & Process
          </button>
        )}

        {loading && (
          <div className="loading">
            <div className="spinner" />
            <p>Processing file...</p>
          </div>
        )}

        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}
