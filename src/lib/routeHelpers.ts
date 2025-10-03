import { NextResponse } from 'next/server';

const getResponseError = (error: Error | any, status: number = 500) => {
  const errMsg = error?.message || 'Internal server error';
  const details = process.env.NODE_ENV === 'development' ? error : undefined;
  return NextResponse.json({ error: errMsg, details }, { status });
};

export default getResponseError;
