import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import cloudinary from '@/lib/cloudinary';
import { getOrCreateCurrentUser } from '@/lib/current-user';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const currentUser = await getOrCreateCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json(
        { message: 'Please select an image file' },
        { status: 400 }
      );
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { message: 'Only image files are allowed' },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { message: 'Image size must be less than 5 MB' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await new Promise<{
      secure_url: string;
    }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'skilltrack/profile-images',
          resource_type: 'image',
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error('Image upload failed'));
            return;
          }

          resolve({
            secure_url: result.secure_url,
          });
        }
      );

      uploadStream.end(buffer);
    });

    await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        imageUrl: uploadResult.secure_url,
      },
    });

    return NextResponse.json(
      {
        message: 'Profile image uploaded successfully',
        imageUrl: uploadResult.secure_url,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Profile image upload error:', error);

    return NextResponse.json(
      { message: 'Failed to upload profile image' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const currentUser = await getOrCreateCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (!currentUser.imageUrl) {
      return NextResponse.json(
        { message: 'No profile image to remove' },
        { status: 400 }
      );
    }

    const imageUrl = currentUser.imageUrl;

    // Extract Cloudinary public_id from the stored URL.
    const uploadIndex = imageUrl.indexOf('/upload/');

    if (uploadIndex !== -1) {
      let publicId = imageUrl.substring(uploadIndex + '/upload/'.length);

      // Remove version, e.g. v1787785784/
      publicId = publicId.replace(/^v\d+\//, '');

      // Remove file extension
      publicId = publicId.replace(/\.[^/.]+$/, '');

      await cloudinary.uploader.destroy(publicId, {
        resource_type: 'image',
      });
    }

    // Remove image URL from database
    await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        imageUrl: null,
      },
    });

    return NextResponse.json(
      {
        message: 'Profile image removed successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Profile image delete error:', error);

    return NextResponse.json(
      { message: 'Failed to remove profile image' },
      { status: 500 }
    );
  }
}
