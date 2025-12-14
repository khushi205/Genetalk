import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Dna, Menu, X, Moon, Sun } from 'lucide-react';
import { useTheme } from '../lib/theme-context';

export default function Navigation() {
    const [isOpen, setIsOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();

    const links = [
        { href: '/', label: 'Home' },
        { href: '/analysis', label: 'Analysis' },
        // { href: '/models', label: 'Models' },
    ];

    const isActive = (href) => {
        return location.pathname === href || location.pathname.startsWith(href + '/');
    };

    return (
        <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <div className="bg-gradient-to-br from-emerald-600 to-teal-600 p-2 rounded-lg">
                            <Dna className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-bold text-lg text-gray-900 dark:text-white">GeneTalk</span>
                    </Link>



                    <div className="flex items-center gap-4">
                       
                        <div className="hidden md:flex items-center gap-8">
                            {links.map(link => (
                                <Link
                                    key={link.href}
                                    to={link.href}
                                    className={`font-medium transition-colors ${isActive(link.href)
                                            ? 'text-emerald-600 dark:text-emerald-400'
                                            : 'text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>


                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            {isOpen ? (
                                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            ) : (
                                <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            )}
                        </button>
                    </div>
                </div>

                {isOpen && (
                    <div className="md:hidden pb-4 space-y-2">
                        {links.map(link => (
                            <Link
                                key={link.href}
                                to={link.href}
                                onClick={() => setIsOpen(false)}
                                className={`block px-4 py-2 rounded-lg transition-colors ${isActive(link.href)
                                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </nav>
    );
}
