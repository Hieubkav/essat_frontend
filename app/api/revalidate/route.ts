import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Validate secret token
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (token !== process.env.REVALIDATION_TOKEN) {
    return NextResponse.json(
      {
        success: false,
        message: 'Invalid token'
      },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { path, tag, type } = body;

    // Revalidate by path
    if (path) {
      revalidatePath(path);
      console.log(`[Revalidation] Path revalidated: ${path}`);
    }

    // Revalidate by tag
    if (tag) {
      revalidateTag(tag, 'default');
      console.log(`[Revalidation] Tag revalidated: ${tag}`);
    }

    // Revalidate specific types
    if (type === 'home' || type === 'all') {
      revalidatePath('/', 'page');
      console.log('[Revalidation] Homepage revalidated');
    }

    if (type === 'product' || type === 'all') {
      revalidatePath('/san-pham', 'layout');
      console.log('[Revalidation] Product pages revalidated');
    }

    if (type === 'post' || type === 'all') {
      revalidatePath('/bai-viet', 'layout');
      console.log('[Revalidation] Post pages revalidated');
    }

    return NextResponse.json({
      success: true,
      message: 'Revalidation triggered',
      revalidated: { path, tag, type },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('[Revalidation] Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error'
      },
      { status: 500 }
    );
  }
}

// GET endpoint để test
export async function GET() {
  return NextResponse.json({
    message: 'Revalidation API is running',
    usage: 'POST with token to trigger revalidation',
  });
}
