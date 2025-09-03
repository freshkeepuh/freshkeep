'use client';

import { SessionProvider } from 'next-auth/react';

type Props = {
  // eslint-disable-next-line react/require-default-props
  children?: React.ReactNode;
};

const Providers = ({ children }: Props) => <SessionProvider>{children}</SessionProvider>;

export default Providers;
