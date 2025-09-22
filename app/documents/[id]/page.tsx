
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Header } from "../../../components/header";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Label } from "../../../components/ui/label";
import { Switch } from "../../../components/ui/switch";
import { ImageUpload } from "../../../components/image-upload";
import { 
  Save, 
  ArrowLeft, 
  Edit, 
  Eye, 
  Trash2, 
  Image as ImageIcon,
  User,
  Calendar,
  Globe,
  Lock
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";

interface DocumentData {
  id: string;
  title: string;
  content: string;
  isPublic: boolean;
  createdAt: string;
  lastEditedAt: string;
  createdBy: {
    name: string | null;
    email: string;
  };
  lastEditedBy?: {
    name: string | null;
    email: string;
  } | null;
  images: Array<{
    id: string;
    filename: string;
    originalName: string;
  }>;
}

export default function DocumentPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const [document, setDocument] = useState<DocumentData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await fetch(`/api/documents/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setDocument(data);
          setTitle(data.title);
          setContent(data.content);
          setIsPublic(data.isPublic);
          
          // Check permissions
          if (session?.user?.email) {
            const isDocCreator = data.createdBy.email === session.user.email;
            setIsCreator(isDocCreator);
            setCanEdit(data.isPublic || isDocCreator);
          }
        } else if (response.status === 404) {
          router.push("/");
        } else if (response.status === 403) {
          alert("You don't have permission to view this document");
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchDocument();
    }
  }, [params.id, session, router]);

  const handleImageUploaded = (imageUrl: string) => {
    const imageMarkdown = `\n![Image](${imageUrl})\n`;
    setContent(prev => prev + imageMarkdown);
    setShowImageUpload(false);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert("Please enter a title for your document");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`/api/documents/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          content,
          isPublic,
        }),
      });

      if (response.ok) {
        const updatedDocument = await response.json();
        setDocument(updatedDocument);
        setIsEditing(false);
      } else {
        throw new Error("Failed to update document");
      }
    } catch (error) {
      console.error("Error updating document:", error);
      alert("Failed to update document. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this document? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/documents/${params.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/");
      } else {
        throw new Error("Failed to delete document");
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      alert("Failed to delete document. Please try again.");
    }
  };

  const renderContent = (content: string) => {
    // Simple markdown-to-HTML conversion for display
    let html = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mb-3">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-medium mb-2">$1</h3>')
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-4" />')
      .replace(/\n/g, '<br />');

    return { __html: html };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600">Document not found</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              {document.isPublic ? (
                <Globe className="w-5 h-5 text-green-600" />
              ) : (
                <Lock className="w-5 h-5 text-gray-600" />
              )}
              <span className="text-sm text-gray-600">
                {document.isPublic ? "Public Document" : "Private Document"}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {canEdit && (
              <>
                {isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setTitle(document.title);
                        setContent(document.content);
                        setIsPublic(document.isPublic);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={isSaving || !title.trim()}
                      className="flex items-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSaving ? "Saving..." : "Save"}</span>
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </Button>
                )}
              </>
            )}
            
            {isCreator && (
              <Button
                variant="outline"
                onClick={handleDelete}
                className="flex items-center space-x-2 text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </Button>
            )}
          </div>
        </div>

        {/* Document metadata */}
        <div className="bg-white rounded-lg shadow-sm border mb-6 p-4">
          <div className="flex flex-wrap items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>Created by {document.createdBy.name || document.createdBy.email}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>
                  Last edited {formatDistanceToNow(new Date(document.lastEditedAt))} ago
                  {document.lastEditedBy && document.lastEditedBy.email !== document.createdBy.email && (
                    <span> by {document.lastEditedBy.name || document.lastEditedBy.email}</span>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Document content */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 space-y-6">
            {isEditing ? (
              <>
                <div>
                  <Label htmlFor="title" className="text-base font-medium">
                    Document Title
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Enter document title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-2 text-xl font-medium border-0 border-b-2 border-gray-100 rounded-none px-0 focus:border-gray-300"
                  />
                </div>

                {isCreator && (
                  <div className="flex items-center justify-between py-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="public"
                        checked={isPublic}
                        onCheckedChange={setIsPublic}
                      />
                      <Label htmlFor="public" className="text-sm">
                        {isPublic ? "Public (everyone can view and edit)" : "Private (only you can view and edit)"}
                      </Label>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowImageUpload(!showImageUpload)}
                      className="flex items-center space-x-2"
                    >
                      <ImageIcon className="w-4 h-4" />
                      <span>Add Image</span>
                    </Button>
                  </div>
                )}

                {showImageUpload && (
                  <div className="border-t border-gray-100 pt-6">
                    <Label className="text-base font-medium mb-4 block">Upload Image</Label>
                    <ImageUpload onImageUploaded={handleImageUploaded} documentId={document.id} />
                  </div>
                )}

                <div>
                  <Label htmlFor="content" className="text-base font-medium">
                    Content
                  </Label>
                  <Textarea
                    id="content"
                    placeholder="Start writing your document..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="mt-2 min-h-[400px] text-base leading-relaxed border-0 resize-none focus:ring-0"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-6">
                    {document.title}
                  </h1>
                </div>
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={renderContent(document.content)}
                />
                {!document.content && (
                  <p className="text-gray-500 italic">This document is empty.</p>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
