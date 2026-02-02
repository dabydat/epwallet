import { type ReactNode } from 'react';

interface LayoutProps {
    children: ReactNode;
    headerActions?: ReactNode;
}

export function Layout({ children, headerActions }: LayoutProps) {
    return (
        <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center py-10">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">

                <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center text-white">
                    <h1 className="text-xl font-bold">e Wallet</h1>
                    {headerActions}
                </div>

                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
