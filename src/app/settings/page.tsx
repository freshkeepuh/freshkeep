import React from 'react';
import { Container } from 'react-bootstrap';
import Settings from '@/components/Settings';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect('/api/auth/signin');
  }

  // get user info
  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      email: true,
      settings: true,
    },
  });

  if (!dbUser) {
    redirect('/auth/signin');
  }

  // Parse the JSON settings
  const userSettings = (dbUser.settings as Record<string, any>) || {};

  const userData = {
    firstName: userSettings.firstName || '',
    lastName: userSettings.lastName || '',
    email: dbUser.email || '',
    theme: userSettings.theme || 'light',
    units: userSettings.units || 'Imperial',
    country: userSettings.country || 'USA',
  };

  return (
    <Container className="fk-bg py-4 py-md-5" id="body">
      <Settings user={userData} />
    </Container>
  );
}

export default SettingsPage;
