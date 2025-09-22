
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "../../../components/header";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Label } from "../../../components/ui/label";
import { Switch } from "../../../components/ui/switch";
import { ImageUpload } from "../../../components/image-upload";
import { Save, ArrowLeft, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

export default function NewDocumentPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const router = useRouter();

  const handleImageUploaded = (imageUrl: string) => {
    // Insert image markdown into content at cursor position
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
      const response = await fetch("/api/documents", {
        method: "POST",
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
        const document = await response.json();
        router.push(`/documents/${document.id}`);
      } else {
        throw new Error("Failed to create document");
      }
    } catch (error) {
      console.error("Error creating document:", error);
      alert("Failed to create document. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

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
            <h1 className="text-2xl font-bold text-gray-900">Create New Document</h1>
          </div>
          <Button
            onClick={handleSave}
            disabled={isSaving || !title.trim()}
            className="flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? "Saving..." : "Save Document"}</span>
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 space-y-6">
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

            <div className="flex items-center justify-between py-4 border-t border-gray-100">
              <div className="flex items-center space-x-4">
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

            {showImageUpload && (
              <div className="border-t border-gray-100 pt-6">
                <Label className="text-base font-medium mb-4 block">Upload Image</Label>
                <ImageUpload onImageUploaded={handleImageUploaded} />
              </div>
            )}

            <div>
              <Label htmlFor="content" className="text-base font-medium">
                Content
              </Label>
              <Textarea
                id="content"
                placeholder="Start writing your document... You can use markdown for formatting and images will be inserted automatically."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="mt-2 min-h-[400px] text-base leading-relaxed border-0 resize-none focus:ring-0"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          <p>
            💡 Tip: You can use markdown syntax for formatting (e.g., **bold**, *italic*, # headers)
          </p>
        </div>
      </main>
    </div>
  );
}
