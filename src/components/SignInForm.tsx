"use client"
import React, { useState,useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Spinner } from "../components/ui/spinner"
import { useRouter } from 'next/navigation';

gsap.registerPlugin(useGSAP);

export default function SignInForm() {
  const containerRef = useRef(null);

    useGSAP(() => {
        // This targets everything with the class "animate-item" inside our form
        gsap.from('.animate-item', {
            y: 30,               // Start 30px down
            opacity: 0,          // Start completely transparent
            duration: 0.8,       // Animation takes 0.8 seconds
            stagger: 0.15,       // 0.15s delay between each element animating
            ease: 'power3.out',  // Smooth deceleration
            delay: 0.1           // Tiny initial delay so it doesn't snap instantly on load
        });
    }, { scope: containerRef }); // Scoping prevents animating other elements on the page

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
         /* BACKGROUND CONTAINER */
        <div 
            className="min-h-screen w-full flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/path-to-your/image_650035.jpg')" }} // Update with your actual path
        >
            {/* GLASSMORPHISM FORM CARD */}
            <form 
                ref={containerRef}
                onSubmit={handleSubmit} 
                className="form-card flex flex-col space-y-6 bg-white/80 backdrop-blur-md p-10 rounded-2xl shadow-2xl shadow-inset[0 4 8 rgba(0, 77, 0, 0.5)] border border-slate-300/80 w-full max-w-sm"
            >
                <div className="text-center animate-item">

                    <h2 className="text-2xl font-black text-gray-900 tracking-tight"> LOGIN</h2>
                    <div className="h-1 w-12 bg-amber-500 mx-auto mt-2 rounded-full" />
                </div>

                <div className="flex flex-col space-y-4 animate-item">
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="Email" 
                        required 
                        className="w-full px-4 py-3 bg-white/50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all shadow-sm"
                    />
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="Password" 
                        required 
                        className="w-full px-4 py-3 bg-white/50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all shadow-sm"
                    />
                </div>

                <div className="animate-item">
                    <button  
                        disabled={loading}
                        className="w-full flex items-center justify-center bg-black hover:bg-gray-800 text-white font-bold py-4 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:opacity-50"
                    >
                        {loading ? <Spinner className="w-5 h-5 animate-spin" /> : "Sign In"}
                    </button>
                </div>
            </form>
        </div>
  )
}
