"use client"

import React, { useState } from 'react'
import { Spinner } from "@/components/ui/spinner"
import { email } from 'zod';
import { useRouter } from 'next/navigation';

export default function SignInForm() {

    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const form = new FormData(e.currentTarget)

       const res =  await fetch('/api/auth/sign-in/email', {
            method: 'POST',
            credentials: 'include',
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                email: form.get('email'),
                password: form.get('password'),
            }),
        });

        setLoading(false);

        if (!res.ok) {
            alert("invalid crendentials");
            return;

        }

        router.replace('dashboard');
        router.refresh();

    }
         return (
            <form onSubmit={handleSubmit} className="space-y-5">
                <input type="email" name="email" placeholder="Email" required />
                <input type="password" name="password" placeholder="Password" required />
                <button  disabled={loading}>
                    {loading ? <Spinner className="size-4" /> : "Sign In"}
                </button>
            </form>
  )
}
