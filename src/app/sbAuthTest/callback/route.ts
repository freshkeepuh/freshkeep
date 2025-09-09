import { createServerClient } from '@/lib/supabase/createServerClient';
import { NextRequest, NextResponse } from 'next/server';

const GET = async (request: NextRequest) => {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/sbAuthTest/addstuff';

  if (code) {
    const supabase = await createServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }

    // Handle the error case
    console.error('Error exchanging code for session:', error);
    return NextResponse.redirect(`${origin}/sbAuthTest/signin?error=auth_error`);
  }

  // Handle missing code parameter
  return NextResponse.redirect(`${origin}/sbAuthTest/signin?error=missing_code`);
};

export default GET;
