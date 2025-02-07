import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth } from './firebase-admin';

export async function verifyAuth() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('firebase-token')?.value;

    if (!token) {
      throw new Error('No token found');
    }

    const decodedToken = await adminAuth.verifyIdToken(token);
    return { user: decodedToken, error: null };
  } catch (error) {
    console.error('Auth error:', error);
    return { user: null, error: 'Unauthorized' };
  }
}
