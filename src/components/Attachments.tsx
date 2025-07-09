"use client";

import React, { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import {
  Paperclip,
  Upload,
  Download,
  Trash2,
  MoreVertical,
  File,
  Image,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  uploadTaskAttachment,
  deleteTaskAttachment,
  getTaskAttachments,
  formatFileSize,
  getFileIcon,
} from "@/actions/attachment";
import { toast } from "sonner";
import { createPusherClient } from "@/lib/pusher-client";
import { Channel } from "pusher-js";

interface Attachment {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  createdAt: string;
  uploadedBy: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

interface AttachmentsProps {
  taskId: string;
  projectId: string;
  currentUserId?: string;
}

export function Attachments({ taskId, projectId, currentUserId }: AttachmentsProps) {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load attachments
  useEffect(() => {
    const loadAttachments = async () => {
      try {
        const attachmentsData = await getTaskAttachments(taskId);
        setAttachments(attachmentsData);
      } catch (error) {
        toast.error("Failed to load attachments");
      } finally {
        setIsLoading(false);
      }
    };

    loadAttachments();
  }, [taskId]);

  // Setup real-time updates
  useEffect(() => {
    let channel: Channel;

    const setupPusher = async () => {
      const pusher = await createPusherClient();
      channel = pusher.subscribe(`project-${projectId}`);

      channel.bind("attachment-uploaded", (data: { attachment: Attachment; taskId: string }) => {
        if (data.taskId === taskId) {
          setAttachments((prev) => [data.attachment, ...prev]);
        }
      });

      channel.bind("attachment-deleted", (data: { attachmentId: string; taskId: string }) => {
        if (data.taskId === taskId) {
          setAttachments((prev) => prev.filter((attachment) => attachment.id !== data.attachmentId));
        }
      });
    };

    setupPusher();

    return () => {
      if (channel) {
        channel.unbind_all();
        channel.unsubscribe();
      }
    };
  }, [taskId, projectId]);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (file.size > maxSize) {
      toast.error("File size exceeds 10MB limit");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("taskId", taskId);

      await uploadTaskAttachment(formData);
      toast.success("File uploaded successfully");
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteAttachment = async (attachmentId: string) => {
    try {
      await deleteTaskAttachment(attachmentId);
      toast.success("Attachment deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete attachment");
    }
  };

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
    
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };

  const handleDownload = (attachment: Attachment) => {
    const link = document.createElement("a");
    link.href = attachment.url;
    link.download = attachment.originalName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isImage = (mimeType: string) => mimeType.startsWith("image/");

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Paperclip className="h-5 w-5" />
            Attachments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-500">Loading attachments...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Paperclip className="h-5 w-5" />
          Attachments ({attachments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive
              ? "border-blue-400 bg-blue-50 dark:bg-blue-950/20"
              : "border-gray-300 dark:border-gray-600"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={(e) => handleFileUpload(e.target.files)}
            accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.txt,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.csv"
          />
          
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <p className="text-sm text-gray-600">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-gray-400" />
              <p className="text-sm text-gray-600">
                Drop files here or{" "}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-blue-500 hover:underline"
                >
                  browse
                </button>
              </p>
              <p className="text-xs text-gray-500">
                Max file size: 10MB • Supported: Images, PDF, Documents, Archives
              </p>
            </div>
          )}
        </div>

        {/* Attachments List */}
        <div className="space-y-3">
          {attachments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Paperclip className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No attachments yet.</p>
              <p className="text-sm mt-1">Upload files to share with your team.</p>
            </div>
          ) : (
            attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                {/* File Icon/Preview */}
                <div className="flex-shrink-0">
                  {isImage(attachment.mimeType) ? (
                    <img
                      src={attachment.url}
                      alt={attachment.originalName}
                      className="w-10 h-10 object-cover rounded"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center text-lg">
                      {getFileIcon(attachment.mimeType)}
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm truncate">{attachment.originalName}</p>
                    <Badge variant="secondary" className="text-xs">
                      {formatFileSize(attachment.size)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                    <div className="flex items-center gap-1">
                      <Avatar className="h-4 w-4">
                        <AvatarImage src={attachment.uploadedBy.image || ""} />
                        <AvatarFallback className="text-xs">
                          {attachment.uploadedBy.name?.charAt(0) || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <span>{attachment.uploadedBy.name || "Anonymous"}</span>
                    </div>
                    <span>•</span>
                    <span>{format(new Date(attachment.createdAt), "MMM d, yyyy 'at' h:mm a")}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(attachment)}
                    className="h-8 w-8 p-0"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  
                  {currentUserId === attachment.uploadedBy.id && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleDeleteAttachment(attachment.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}