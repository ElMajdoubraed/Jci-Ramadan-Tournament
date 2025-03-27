'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // Vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (isLoggedIn === 'true') {
      router.push('/admin');
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Identifiants codés en dur à partir des variables d'environnement
    const adminUsername = process.env.NEXT_PUBLIC_ADMIN_USERNAME;
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (username === adminUsername && password === adminPassword) {
      // Stocker l'état d'authentification dans localStorage
      localStorage.setItem('isAdminLoggedIn', 'true');
      router.push('/admin');
    } else {
      setError('Nom d\'utilisateur ou mot de passe invalide');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Connexion Admin</h1>
          <p className="text-gray-600">Tournoi de Ramadan</p>
        </div>

        {error && (
          <div className="mb-4 rounded bg-red-100 p-3 text-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label 
              htmlFor="username" 
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Nom d'utilisateur
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div className="mb-6">
            <label 
              htmlFor="password" 
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 py-2 px-4 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Connexion
          </button>
        </form>
      </div>
    </div>
  );
}