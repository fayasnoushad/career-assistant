"use client";
import { showModal } from "@/app/helpers/modal-manager";
import { useState } from "react";

interface ResumeUploadFormProps {
  onUpload: (file: File, targetRole: string, experienceLevel: string) => void;
}

export default function ResumeUploadForm({ onUpload }: ResumeUploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [targetRole, setTargetRole] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (isValidFileType(droppedFile)) {
        setFile(droppedFile);
      } else {
        showModal({
          title: "Invalid File Type",
          message: "Please upload a PDF or DOCX file",
          type: "warning",
          onConfirm: () => {},
        });
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (isValidFileType(selectedFile)) {
        setFile(selectedFile);
      } else {
        showModal({
          title: "Invalid File Type",
          message: "Please upload a PDF or DOCX file",
          type: "warning",
          onConfirm: () => {},
        });
      }
    }
  };

  const isValidFileType = (file: File) => {
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];
    return validTypes.includes(file.type);
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (file) {
      onUpload(file, targetRole, experienceLevel);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-base-200 rounded-lg p-6 hover:shadow-lg transition-shadow w-full max-w-4xl"
    >
      {/* File Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? "border-primary bg-primary/20 dark:bg-primary/30"
            : "border-base-300"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="resume-upload"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="hidden"
        />
        <label
          htmlFor="resume-upload"
          className="cursor-pointer flex flex-col items-center"
        >
          {file ? (
            <>
              <div className="text-6xl mb-4">📄</div>
              <p className="text-lg font-semibold mb-2">{file.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {(file.size / 1024).toFixed(2)} KB
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setFile(null);
                }}
                className="mt-4 text-sm text-primary hover:underline"
              >
                Choose a different file
              </button>
            </>
          ) : (
            <>
              <div className="text-6xl mb-4">⬆️</div>
              <p className="text-lg font-semibold mb-2">Upload your resume</p>
              <p className="text-sm text-base-content/70">
                Drag and drop your file here, or click to browse
              </p>
              <p className="text-xs text-base-content/50 mt-2">
                Supported formats: PDF, DOC, DOCX
              </p>
            </>
          )}
        </label>
      </div>

      {/* Additional Information */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="target-role"
            className="block text-sm font-medium mb-2"
          >
            Target Job Role (Optional)
          </label>
          <input
            type="text"
            id="target-role"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="e.g., Software Engineer, Data Analyst"
            className="w-full px-4 py-2 border border-base-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-base-100"
          />
        </div>

        <div>
          <label
            htmlFor="experience-level"
            className="block text-sm font-medium mb-2"
          >
            Experience Level (Optional)
          </label>
          <select
            id="experience-level"
            value={experienceLevel}
            onChange={(e) => setExperienceLevel(e.target.value)}
            className="w-full px-4 py-2 border border-base-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-base-100"
          >
            <option value="">Select level</option>
            <option value="Entry-level">Entry-level</option>
            <option value="Mid-level">Mid-level</option>
            <option value="Senior">Senior</option>
            <option value="Lead">Lead</option>
            <option value="Executive">Executive</option>
          </select>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!file}
        className={`btn w-full py-3 px-6 rounded-lg text-base-content font-semibold ${
          file ? "bg-success" : "btn-disabled"
        }`}
      >
        Analyze Resume
      </button>
    </form>
  );
}
