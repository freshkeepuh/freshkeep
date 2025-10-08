// import { NextRequest, NextResponse } from 'next/server';
// import s3Client from '@/lib/s3Client';

// export const runtime = 'nodejs';

// function sanitizeFilename(name: string) {
//   return name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 200);
// }

// function createPresignedPostAsync(s3: any, params: any): Promise<{ url: string; fields: Record<string, string> }> {
//   return new Promise((resolve, reject) => {
//     s3.createPresignedPost(params, (err: any, data: any) => {
//       if (err) {
//         reject(err);
//         return;
//       }
//       resolve(data);
//     });
//   });
// }

// export async function POST(request: NextRequest) {
//   try {
//     const body = (await request.json().catch(() => ({}))) as Record<string, any>;
//     const fileName = typeof body?.fileName === 'string' ? body.fileName.trim() : '';
//     const fileType = typeof body?.fileType === 'string' ? body.fileType.trim() : '';
//     const itemId = body?.itemId ?? null;

//     if (!fileName || !fileType) {
//       return NextResponse.json({ error: 'fileName and fileType are required' }, { status: 400 });
//     }

//     const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];
//     if (!allowedTypes.includes(fileType)) {
//       return NextResponse.json({ error: 'File type not allowed. Only images are permitted.' }, { status: 400 });
//     }

//     const safeName = sanitizeFilename(fileName);
//     const key = `shop/uploads/${Date.now()}-${safeName}`;

//     const bucket = process.env.S3_BUCKET || process.env.NEXT_PUBLIC_S3_BUCKET;
//     const region = process.env.AWS_REGION || process.env.NEXT_PUBLIC_AWS_REGION;

//     if (!bucket || !region) {
//       console.error('Missing S3_BUCKET or AWS_REGION env');
//       return NextResponse.json({ error: 'Server S3 configuration missing' }, { status: 500 });
//     }

//     const params = {
//       Bucket: bucket,
//       Key: key,
//       Fields: {
//         'Content-Type': fileType,
//       },
//       Conditions: [
//         ['content-length-range', 0, 10 * 1024 * 1024], // 10MB
//         ['starts-with', '$Content-Type', 'image/'],
//       ],
//       Expires: 600, // seconds
//     };

//     const presign = await createPresignedPostAsync(s3Client, params);

//     return NextResponse.json({
//       success: true,
//       url: presign.url,
//       fields: presign.fields,
//       key,
//       fileUrl: `https://${bucket}.s3.${region}.amazonaws.com/${key}`,
//       itemId,
//     });
//   } catch (error) {
//     console.error('Upload error:', error);
//     return NextResponse.json({ error: 'Failed to create upload URL' }, { status: 500 });
//   }
// }
import { NextRequest, NextResponse } from 'next/server';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import s3Client from '@/lib/s3Client';

export const runtime = 'nodejs';

function sanitizeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 200);
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, any>;
    const fileName = typeof body?.fileName === 'string' ? body.fileName.trim() : '';
    const fileType = typeof body?.fileType === 'string' ? body.fileType.trim() : '';
    const itemId = body?.itemId ?? null;

    console.log('Upload request:', { fileName, fileType, itemId });

    if (!fileName || !fileType) {
      return NextResponse.json({ error: 'fileName and fileType are required' }, { status: 400 });
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(fileType)) {
      return NextResponse.json({ error: 'File type not allowed. Only images are permitted.' }, { status: 400 });
    }

    const safeName = sanitizeFilename(fileName);
    const key = `shop/uploads/${Date.now()}-${safeName}`;

    const bucket = process.env.AWS_S3_BUCKET || process.env.NEXT_PUBLIC_S3_BUCKET;
    const region = process.env.AWS_REGION || process.env.NEXT_PUBLIC_AWS_REGION;

    console.log('S3 Config:', { bucket, region, key });

    if (!bucket || !region) {
      console.error('Missing S3_BUCKET or AWS_REGION env variables');
      return NextResponse.json({ error: 'Server S3 configuration missing' }, { status: 500 });
    }

    const { url, fields } = await createPresignedPost(s3Client, {
      Bucket: bucket,
      Key: key,
      Fields: {
        'Content-Type': fileType,
      },
      Conditions: [
        ['content-length-range', 0, 10 * 1024 * 1024], // 10MB
        ['eq', '$Content-Type', fileType],
      ],
      Expires: 600, // seconds
    });

    console.log('Presigned URL created successfully');

    return NextResponse.json({
      success: true,
      url,
      fields,
      key,
      fileUrl: `https://${bucket}.s3.${region}.amazonaws.com/${key}`,
      itemId,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      {
        error: 'Failed to create upload URL',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
