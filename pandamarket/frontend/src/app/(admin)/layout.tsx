import React from 'react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <span className="text-xl font-bold text-gray-800">Panda Admin</span>
        </div>
        <nav className="p-4 space-y-2">
          <Link href="/verifications" className="block px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100 font-medium">
            Verifications KYC
          </Link>
          <Link href="/mandats" className="block px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100 font-medium">
            Mandats Minute
          </Link>
          <Link href="/reports" className="block px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100 font-medium">
            Signalements
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8">
          <h1 className="text-xl font-semibold text-gray-800">Panneau d'Administration</h1>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
