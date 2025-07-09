"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { MessageCircle, Send, Edit, Trash2, MoreVertical } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
import { createComment, updateComment, deleteComment, getTaskComments } from "@/actions/comment";
import { toast } from "sonner";
import { createPusherClient } from "@/lib/pusher-client";
import { Channel } from "pusher-js";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

interface CommentsProps {
  taskId: string;
  projectId: string;
  currentUserId?: string;
}

export function Comments({ taskId, projectId, currentUserId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load comments
  useEffect(() => {
    const loadComments = async () => {
      try {
        const commentsData = await getTaskComments(taskId);
        setComments(commentsData);
      } catch (error) {
        toast.error("Failed to load comments");
      } finally {
        setIsLoading(false);
      }
    };

    loadComments();
  }, [taskId]);

  // Setup real-time updates
  useEffect(() => {
    let channel: Channel;

    const setupPusher = async () => {
      const pusher = await createPusherClient();
      channel = pusher.subscribe(`project-${projectId}`);

      channel.bind("comment-created", (data: { comment: Comment; taskId: string }) => {
        if (data.taskId === taskId) {
          setComments((prev) => [...prev, data.comment]);
        }
      });

      channel.bind("comment-updated", (data: { comment: Comment; taskId: string }) => {
        if (data.taskId === taskId) {
          setComments((prev) =>
            prev.map((comment) =>
              comment.id === data.comment.id ? data.comment : comment
            )
          );
        }
      });

      channel.bind("comment-deleted", (data: { commentId: string; taskId: string }) => {
        if (data.taskId === taskId) {
          setComments((prev) => prev.filter((comment) => comment.id !== data.commentId));
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

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await createComment({
        content: newComment.trim(),
        taskId,
      });
      setNewComment("");
      toast.success("Comment added successfully");
    } catch (error) {
      toast.error("Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditComment = async (commentId: string) => {
    if (!editContent.trim()) return;

    try {
      await updateComment({
        id: commentId,
        content: editContent.trim(),
      });
      setEditingCommentId(null);
      setEditContent("");
      toast.success("Comment updated successfully");
    } catch (error) {
      toast.error("Failed to update comment");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      toast.success("Comment deleted successfully");
    } catch (error) {
      toast.error("Failed to delete comment");
    }
  };

  const startEditing = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditContent("");
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Comments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-500">Loading comments...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Comments ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* New Comment Form */}
        <div className="space-y-2">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
          />
          <div className="flex justify-end">
            <Button
              onClick={handleSubmitComment}
              disabled={!newComment.trim() || isSubmitting}
              size="sm"
            >
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? "Adding..." : "Add Comment"}
            </Button>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.author.image || ""} />
                      <AvatarFallback>
                        {comment.author.name?.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-sm">
                        {comment.author.name || "Anonymous"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {format(new Date(comment.createdAt), "MMM d, yyyy 'at' h:mm a")}
                        {comment.updatedAt !== comment.createdAt && " (edited)"}
                      </div>
                    </div>
                  </div>

                  {/* Actions Menu (only for comment author) */}
                  {currentUserId === comment.author.id && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => startEditing(comment)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>

                {/* Comment Content */}
                {editingCommentId === comment.id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEditComment(comment.id)}
                        disabled={!editContent.trim()}
                        size="sm"
                      >
                        Save
                      </Button>
                      <Button onClick={cancelEditing} variant="outline" size="sm">
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm whitespace-pre-wrap">{comment.content}</div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}