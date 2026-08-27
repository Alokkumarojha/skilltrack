import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

import cloudinary from '@/lib/cloudinary';
import { getOrCreateCurrentUser } from '@/lib/current-user';
import { prisma } from '@/lib/prisma';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

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
        { message: 'Please select a PDF file' },
        { status: 400 }
      );
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { message: 'Only PDF files are allowed' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { message: 'Resume size must be less than 5 MB' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Delete the previous resume from Cloudinary first.
    if (currentUser.resumeUrl) {
      const publicId = extractPublicId(currentUser.resumeUrl);

      if (publicId) {
        await cloudinary.uploader.destroy(publicId, {
          resource_type: 'raw',
        });
      }
    }

    const uploadResult = await new Promise<{
      secure_url: string;
    }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'skilltrack/resumes',
          resource_type: 'raw',
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error('Resume upload failed'));
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
        resumeUrl: uploadResult.secure_url,
      },
    });

    return NextResponse.json(
      {
        message: 'Resume uploaded successfully',
        resumeUrl: uploadResult.secure_url,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Resume upload error:', error);

    return NextResponse.json(
      { message: 'Failed to upload resume' },
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

    if (!currentUser.resumeUrl) {
      return NextResponse.json(
        { message: 'No resume to remove' },
        { status: 400 }
      );
    }

    const publicId = extractPublicId(currentUser.resumeUrl);

    if (publicId) {
      await cloudinary.uploader.destroy(publicId, {
        resource_type: 'raw',
      });
    }

    await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        resumeUrl: null,
      },
    });

    return NextResponse.json(
      {
        message: 'Resume removed successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Resume delete error:', error);

    return NextResponse.json(
      { message: 'Failed to remove resume' },
      { status: 500 }
    );
  }
}

function extractPublicId(url: string) {
  const uploadIndex = url.indexOf('/upload/');

  if (uploadIndex === -1) {
    return null;
  }

  let publicId = url.substring(uploadIndex + '/upload/'.length);

  // Remove Cloudinary version, e.g. v1234567890/
  publicId = publicId.replace(/^v\d+\//, '');

  // Remove extension.
  publicId = publicId.replace(/\.[^/.]+$/, '');

  return publicId;
}
