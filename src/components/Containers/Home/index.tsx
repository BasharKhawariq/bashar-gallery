'use client';
import { FC } from 'react';

import useScreenSize from '@/hooks/useScreenSize';
import useClipboard from '@/hooks/useClipboard';

const ContainerHome: FC = () => {
  const screenSize = useScreenSize();
  const { copy } = useClipboard();

  return (
    <section className="flex items-center justify-center min-h-screen gap-3">
      <h1>{screenSize}</h1>
      <button
        onClick={() => copy('Hello, World!')}
        className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md"
      >
        Copy
      </button>
    </section>
  );
};

export default ContainerHome;
