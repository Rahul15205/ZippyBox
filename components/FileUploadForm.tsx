"use client";

import { useState, useRef } from "react";
import { Button } from "@heroui/button";
import { Progress } from "@heroui/progress";
import { Input } from "@heroui/input";
import {
  Upload,
  X,
  FileUp,
  AlertTriangle,
  FolderPlus,
  ArrowRight,
} from "lucide-react";
import { addToast } from "@heroui/toast";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import axios from "axios";

interface FileUploadFormProps {
  userId: string;
  onUploadSuccess?: () => void;
  currentFolder?: string | null;
}

export default function FileUploadForm({
  userId,
  onUploadSuccess,
  currentFolder = null,
}: FileUploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  // Folder creation state
  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [creatingFolder, setCreatingFolder] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      // Validate file size (50MB limit)
      if (selectedFile.size > 50 * 1024 * 1024) {
        setError("File size exceeds 50MB limit");
        return;
      }

      setFile(selectedFile);
      setError(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];

      // Validate file size (50MB limit)
      if (droppedFile.size > 50 * 1024 * 1024) {
        setError("File size exceeds 50MB limit");
        return;
      }

      setFile(droppedFile);
      setError(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const clearFile = () => {
    setFile(null);
    setFiles([]);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (folderInputRef.current) {
      folderInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!file && files.length === 0) return;

    setUploading(true);
    setProgress(0);

    try {
      if (file) {
        // Single file upload
        const formData = new FormData();
        formData.append("file", file);
        formData.append("userId", userId);
        if (currentFolder) {
          formData.append("parentId", currentFolder);
        }

        const response = await axios.post("/api/files/upload", formData, {
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setProgress(progress);
            }
          },
        });

        if (response.status === 200) {
          addToast({
            title: "Success",
            description: "File uploaded successfully",
            color: "success",
          });
          clearFile();
          onUploadSuccess?.();
        }
      } else if (files.length > 0) {
        // Folder upload
        const formData = new FormData();
        formData.append("folderName", files[0].webkitRelativePath.split('/')[0]);
        formData.append("userId", userId);
        if (currentFolder) {
          formData.append("parentId", currentFolder);
        }

        files.forEach((file) => {
          formData.append("files", file);
        });

        const response = await axios.post("/api/files/upload-folder", formData, {
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setProgress(progress);
            }
          },
        });

        if (response.status === 200) {
          addToast({
            title: "Success",
            description: "Folder uploaded successfully",
            color: "success",
          });
          clearFile();
          onUploadSuccess?.();
        }
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      setError(error.response?.data?.error || "Upload failed");
      addToast({
        title: "Error",
        description: error.response?.data?.error || "Upload failed",
        color: "danger",
      });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleCreateFolder = async () => {
    if (!folderName.trim()) {
      addToast({
        title: "Invalid Folder Name",
        description: "Please enter a valid folder name.",
        color: "danger",
      });
      return;
    }

    setCreatingFolder(true);

    try {
      await axios.post("/api/folders/create", {
        name: folderName.trim(),
        userId: userId,
        parentId: currentFolder,
      });

      addToast({
        title: "Folder Created",
        description: `Folder "${folderName}" has been created successfully.`,
        color: "success",
      });

      // Reset folder name and close modal
      setFolderName("");
      setFolderModalOpen(false);

      // Call the onUploadSuccess callback to refresh the file list
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
      console.error("Error creating folder:", error);
      addToast({
        title: "Folder Creation Failed",
        description: "We couldn't create the folder. Please try again.",
        color: "danger",
      });
    } finally {
      setCreatingFolder(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Action buttons */}
      <div className="flex gap-2 mb-2">
        <Button
          color="primary"
          variant="flat"
          startContent={<FolderPlus className="h-4 w-4" />}
          onClick={() => setFolderModalOpen(true)}
          className="flex-1"
        >
          New Folder
        </Button>
        <Button
          color="primary"
          variant="flat"
          startContent={<FileUp className="h-4 w-4" />}
          onClick={() => fileInputRef.current?.click()}
          className="flex-1"
        >
          Add File
        </Button>
        <Button
          color="secondary"
          variant="flat"
          startContent={<FolderPlus className="h-4 w-4" />}
          onClick={() => folderInputRef.current?.click()}
          className="flex-1"
        >
          Add Folder
        </Button>
      </div>

      {/* File drop area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          error
            ? "border-danger/30 bg-danger/5"
            : file || files.length > 0
              ? "border-primary/30 bg-primary/5"
              : "border-default-300 hover:border-primary/5"
        }`}
      >
        {!file && files.length === 0 ? (
          <div className="space-y-3">
            <FileUp className="h-12 w-12 mx-auto text-primary/70" />
            <div>
              <p className="text-default-600">
                Drag and drop your files here, or{" "}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-primary cursor-pointer font-medium inline bg-transparent border-0 p-0 m-0"
                >
                  browse
                </button>
              </p>
              <p className="text-xs text-default-500 mt-1">All file types up to 50MB</p>
            </div>
            <Input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <input
              type="file"
              ref={folderInputRef}
              onChange={(e) => {
                if (e.target.files) {
                  const fileList = Array.from(e.target.files);
                  setFiles(fileList);
                  setFile(null);
                  setError(null);
                }
              }}
              className="hidden"
              {...({ webkitdirectory: "", directory: "" } as any)}
            />
          </div>
        ) : (
          <div className="space-y-3">
            {file ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-md">
                    <FileUp className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium truncate max-w-[180px]">
                      {file.name}
                    </p>
                    <p className="text-xs text-default-500">
                      {file.size < 1024
                        ? `${file.size} B`
                        : file.size < 1024 * 1024
                          ? `${(file.size / 1024).toFixed(1)} KB`
                          : `${(file.size / (1024 * 1024)).toFixed(1)} MB`}
                    </p>
                  </div>
                </div>
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  onClick={clearFile}
                  className="text-default-500"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : files.length > 0 ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-secondary/10 rounded-md">
                    <FolderPlus className="h-5 w-5 text-secondary" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium truncate max-w-[180px]">
                      {files[0].webkitRelativePath.split('/')[0]}
                    </p>
                    <p className="text-xs text-default-500">
                      {files.length} files
                    </p>
                  </div>
                </div>
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  onClick={clearFile}
                  className="text-default-500"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : null}

            {error && (
              <div className="bg-danger-5 text-danger-700 p-3 rounded-lg flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {uploading && (
              <Progress
                value={progress}
                color="primary"
                size="sm"
                showValueLabel={true}
                className="max-w-full"
              />
            )}

            <Button
              color="primary"
              startContent={<Upload className="h-4 w-4" />}
              endContent={!uploading && <ArrowRight className="h-4 w-4" />}
              onClick={handleUpload}
              isLoading={uploading}
              className="w-full"
              isDisabled={!!error || (!file && files.length === 0)}
            >
              {uploading ? `Uploading... ${progress}%` : file ? "Upload File" : files.length > 0 ? "Upload Folder" : "Upload"}
            </Button>
          </div>
        )}
      </div>

      {/* Upload tips */}
      <div className="bg-default-100/5 p-4 rounded-lg">
        <h4 className="text-sm font-medium mb-2">Tips</h4>
        <ul className="text-xs text-default-600 space-y-1">
          <li>• Files are private and only visible to you</li>
          <li>• Supported formats: All file types (except executable files)</li>
          <li>• Maximum file size: 50MB</li>
          <li>• You can upload entire folders with their structure</li>
        </ul>
      </div>

      {/* Create Folder Modal */}
      <Modal
        isOpen={folderModalOpen}
        onOpenChange={setFolderModalOpen}
        backdrop="blur"
        classNames={{
          base: "border border-default-200 bg-default-5",
          header: "border-b border-default-200",
          footer: "border-t border-default-200",
        }}
      >
        <ModalContent>
          <ModalHeader className="flex gap-2 items-center">
            <FolderPlus className="h-5 w-5 text-primary" />
            <span>New Folder</span>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <p className="text-sm text-default-600">
                Enter a name for your folder:
              </p>
              <Input
                type="text"
                label="Folder Name"
                placeholder="My Images"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                autoFocus
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="flat"
              color="default"
              onClick={() => setFolderModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              onClick={handleCreateFolder}
              isLoading={creatingFolder}
              isDisabled={!folderName.trim()}
              endContent={!creatingFolder && <ArrowRight className="h-4 w-4" />}
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
