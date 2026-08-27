'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { Camera, Loader2, Trash2, Upload } from 'lucide-react';

import { toast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';

type ProfileImageUploadProps = {
  imageUrl: string;
  onUpload: (imageUrl: string) => void;
};

export default function ProfileImageUpload({
  imageUrl,
  onUpload,
}: ProfileImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);

  const busy = uploading || removing;

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.add({
        type: 'error',
        title: 'Invalid File',
        description: 'Please select an image file.',
      });

      event.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.add({
        type: 'error',
        title: 'File Too Large',
        description: 'Image size must be less than 5 MB.',
      });

      event.target.value = '';
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/profile-image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload image.');
      }

      onUpload(data.imageUrl);

      toast.add({
        type: 'success',
        title: 'Profile Image Updated',
        description: 'Your profile image has been uploaded successfully.',
      });
    } catch (error) {
      toast.add({
        type: 'error',
        title: 'Upload Failed',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to upload profile image.',
        priority: 'high',
      });
    } finally {
      setUploading(false);

      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  }

  async function handleRemoveImage() {
    if (!imageUrl) {
      return;
    }

    setRemoving(true);

    try {
      const response = await fetch('/api/upload/profile-image', {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to remove image.');
      }

      onUpload('');

      toast.add({
        type: 'success',
        title: 'Profile Image Removed',
        description: 'Your profile image has been removed successfully.',
      });
    } catch (error) {
      toast.add({
        type: 'error',
        title: 'Remove Failed',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to remove profile image.',
        priority: 'high',
      });
    } finally {
      setRemoving(false);
    }
  }

  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
      {/* Image Preview */}
      <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-2 border-border bg-muted shadow-sm">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt="Profile image"
            fill
            sizes="112px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Camera className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Upload Controls */}
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold">Profile Image</h3>

          <p className="text-sm text-muted-foreground">
            Upload a professional profile image. JPG, PNG or WebP up to 5 MB.
          </p>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Change Image
              </>
            )}
          </Button>

          {imageUrl && (
            <Button
              type="button"
              variant="destructive"
              disabled={busy}
              onClick={handleRemoveImage}
            >
              {removing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Removing...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove Image
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
