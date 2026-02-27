import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Heart, Gift, Sparkles } from 'lucide-react';

// Floating Hearts Background Component
const FloatingHearts = () => {
    const [hearts, setHearts] = useState<Array<{ id: number; left: number; duration: number; size: number; delay: number }>>([]);

    useEffect(() => {
        // Generate initial hearts
        const newHearts = Array.from({ length: 20 }).map((_, i) => ({
            id: i,
            left: Math.random() * 100,
            duration: 10 + Math.random() * 15,
            size: 15 + Math.random() * 20,
            delay: Math.random() * 10,
        }));
        setHearts(newHearts);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {hearts.map((heart) => (
                <motion.div
                    key={heart.id}
                    className="absolute bottom-[-50px] text-pink-300/40"
                    initial={{ y: 0, x: `${heart.left}vw`, opacity: 0 }}
                    animate={{
                        y: '-120vh',
                        x: [`${heart.left}vw`, `${heart.left + 5}vw`, `${heart.left - 5}vw`, `${heart.left}vw`],
                        opacity: [0, 0.8, 0.8, 0],
                    }}
                    transition={{
                        duration: heart.duration,
                        repeat: Infinity,
                        delay: heart.delay,
                        ease: "linear"
                    }}
                >
                    <Heart size={heart.size} fill="currentColor" />
                </motion.div>
            ))}
        </div>
    );
};

// Typewriter Effect Component
const TypewriterText = ({ text, onComplete }: { text: string; onComplete?: () => void }) => {
    const [displayedText, setDisplayedText] = useState("");
    const onCompleteRef = useRef(onComplete);

    useEffect(() => {
        onCompleteRef.current = onComplete;
    }, [onComplete]);

    useEffect(() => {
        setDisplayedText("");
        let i = 0;
        const interval = setInterval(() => {
            setDisplayedText((prev) => prev + text.charAt(i));
            i++;
            if (i >= text.length) {
                clearInterval(interval);
                if (onCompleteRef.current) onCompleteRef.current();
            }
        }, 50); // Typing speed
        return () => clearInterval(interval);
    }, [text]); // Only depend on text

    return <span>{displayedText}</span>;
};

// Simple Confetti Component using Framer Motion
const ConfettiBurst = () => {
    const colors = ['#fce7f3', '#fbcfe8', '#f9a8d4', '#f472b6', '#fbbf24', '#fef08a'];
    const particles = Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * window.innerWidth,
        y: (Math.random() - 1) * window.innerHeight,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 10 + 5,
        rotation: Math.random() * 360,
    }));

    return (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute rounded-full"
                    style={{ backgroundColor: p.color, width: p.size, height: p.size }}
                    initial={{ x: 0, y: 0, scale: 0, rotate: 0 }}
                    animate={{
                        x: p.x,
                        y: p.y,
                        scale: [0, 1, 1, 0],
                        rotate: p.rotation * 5,
                    }}
                    transition={{ duration: 2.5, ease: "easeOut" }}
                />
            ))}
        </div>
    );
};

export default function BirthdayUnlock() {
    const [selectedCard, setSelectedCard] = useState<number | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [isMessageComplete, setIsMessageComplete] = useState(false);
    const [lockedMessage, setLockedMessage] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Define unlock rules (Target Month is 1 for February, 0-indexed)
    const checkUnlocked = (targetDate: number) => {
        const now = new Date();
        const m = now.getMonth();
        const d = now.getDate();
        // Unlock if it's past February, or if it's Feb and the day has arrived.
        if (m > 1) return true;
        if (m === 1 && d >= targetDate) return true;
        return false;
    };

    const cards = [
        {
            id: 0,
            title: "Day -2",
            unlockDateTitle: "Feb 26",
            isUnlocked: checkUnlocked(26),
            message: "Just 2 days left until the world celebrates the most amazing person! 💖 Every single day with you feels like an absolute dream come true, but your birthday week is extra special. ✨ I can't wait to shower you with all the love, endless affection, and happiness you deserve! You make my world infinitely brighter just by existing. Get ready, my love, the countdown to your special day has officially begun! 🥂🌸",
            icon: <Heart className="w-8 h-8 text-pink-500 fill-pink-500/50 drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]" />,
            mediaUrl: "https://media.giphy.com/media/Z21HJj2kz9uBG/giphy.gif"
        },
        {
            id: 1,
            title: "Day -1",
            unlockDateTitle: "Feb 27",
            isUnlocked: checkUnlocked(27),
            message: "Only 1 day left before my favorite human in the entire universe levels up! 🎂💫 The excitement is so real right now! Looking back on everything we've shared, I feel incredibly lucky to be by your side. Tomorrow is all about you—your beautiful smile, your gorgeous heart, and your wonderful spirit. 🦋 Prepare yourself for a day overflowing with sweet surprises and tight hugs! I love you endlessly! 🥰💘",
            icon: <Sparkles className="w-8 h-8 text-purple-500 fill-purple-500/50 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />,
            mediaUrl: "/giphy.gif"
        },
        {
            id: 2,
            title: "Birthday",
            unlockDateTitle: "Feb 28",
            isUnlocked: checkUnlocked(28),
            message: "🎉 HAPPY BIRTHDAY, MY EVERYTHING! 🎉 Today, the whole world is yours! 🌍👑 To the person who holds my heart completely: may this year bring you all the beautiful things your soul desires. You are my greatest adventure, my safest place, and my true love. 🌹 From the bottom of my heart, thank you for being exactly who you are. Let's make today utterly unforgettable—because you deserve absolutely nothing but the very best! 🥂🎁 I love you forever and always! 💌💋",
            icon: <Gift className="w-8 h-8 text-amber-500 fill-amber-500/50 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]" />,
            mediaUrl: "/love.gif"
        }
    ];

    useEffect(() => {
        // Initialize audio
        audioRef.current = new Audio('/birthday.mp3');
        audioRef.current.loop = true;
    }, []);

    useEffect(() => {
        // Reset message completion when card changes
        setIsMessageComplete(false);
    }, [selectedCard]);

    const handleInteract = () => {
        if (audioRef.current && !isPlaying) {
            audioRef.current.play().then(() => setIsPlaying(true)).catch(() => console.log("Audio play blocked by browser"));
        }
    };

    const handleCardClick = (card: typeof cards[0]) => {
        handleInteract();
        if (!card.isUnlocked) {
            // Set custom message based on the locked card
            if (card.id === 1) {
                setLockedMessage("Patience, my love! Come back tomorrow for this one. 😉");
            } else if (card.id === 2) {
                setLockedMessage("No peeking! This is strictly for the 28th! 🎁🤫");
            } else {
                setLockedMessage("This one is still locked! Check back later.");
            }

            // Auto hide message after 3 seconds
            setTimeout(() => setLockedMessage(null), 3000);
            return;
        }

        if (selectedCard === card.id) {
            setSelectedCard(null); // Toggle close
        } else {
            setSelectedCard(card.id);
            if (card.id === 2) {
                // Trigger confetti for the birthday card
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 3000);
            }
        }
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-rose-100 via-purple-100 to-amber-100 flex flex-col items-center justify-center p-4 lg:p-8 relative overflow-hidden font-sans text-slate-800">
            <FloatingHearts />
            {showConfetti && <ConfettiBurst />}

            {/* Custom Locked Toast Notification */}
            <AnimatePresence>
                {lockedMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.9 }}
                        className="fixed top-10 z-50 px-6 py-3 bg-white/90 backdrop-blur-md rounded-full shadow-[0_10px_40px_rgba(236,72,153,0.3)] border border-pink-200 text-pink-600 font-bold text-sm sm:text-base text-center max-w-[90vw]"
                    >
                        {lockedMessage}
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="z-10 text-center mb-10"
            >
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600 mb-2 drop-shadow-sm px-4">
                    A Celebration Awaits
                </h1>
                <p className="text-gray-600 text-base sm:text-lg md:text-xl font-medium tracking-wide">
                    Unlock to reveal a special surprise.
                </p>
            </motion.div>

            <div className="w-full max-w-md flex flex-col gap-6 z-10">
                <AnimatePresence>
                    {cards.map((card) => {
                        const isSelected = selectedCard === card.id;

                        return (
                            <motion.div
                                key={card.id}
                                layout
                                onClick={() => handleCardClick(card)}
                                className={`
                  relative overflow-hidden rounded-3xl cursor-pointer transition-all duration-300
                  ${card.isUnlocked
                                        ? 'bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_8px_32px_rgba(255,192,203,0.3)] hover:shadow-[0_8px_32px_rgba(230,130,150,0.5)] hover:scale-[1.02]'
                                        : 'bg-white/30 backdrop-blur-md border border-white/40 shadow-inner blur-[1px]'}
                `}
                                whileHover={card.isUnlocked && !isSelected ? { y: -5 } : {}}
                                whileTap={card.isUnlocked ? { scale: 0.98 } : {}}
                            >
                                {/* Locked Overlay pulse effect inside */}
                                {!card.isUnlocked && (
                                    <motion.div
                                        className="absolute inset-0 bg-white/20 z-0 pointer-events-none"
                                        animate={{ opacity: [0.3, 0.7, 0.3] }}
                                        transition={{ repeat: Infinity, duration: 2.5 }}
                                    />
                                )}

                                <div className="p-6 relative z-10">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-2xl ${card.isUnlocked ? 'bg-white shadow-sm' : 'bg-gray-200/50 text-gray-400'}`}>
                                                {card.isUnlocked ? card.icon : <Lock className="w-6 h-6" />}
                                            </div>
                                            <div>
                                                <h2 className={`text-lg sm:text-xl font-bold ${card.isUnlocked ? 'text-gray-800' : 'text-gray-500'}`}>
                                                    {card.title}
                                                </h2>
                                                <p className={`text-xs sm:text-sm font-medium ${card.isUnlocked ? 'text-pink-500' : 'text-gray-400'}`}>
                                                    {card.unlockDateTitle}
                                                </p>
                                            </div>
                                        </div>

                                        {!card.isUnlocked && (
                                            <div className="px-3 py-1 rounded-full bg-slate-200/50 text-slate-500 text-xs font-semibold backdrop-blur-sm">
                                                Locked
                                            </div>
                                        )}
                                    </div>

                                    {/* Expanded Content */}
                                    {isSelected && card.isUnlocked && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                            animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                            className="origin-top"
                                        >
                                            <div className="w-full aspect-video rounded-xl overflow-hidden bg-pink-100 flex items-center justify-center mb-4 border border-pink-200 shadow-inner relative group">
                                                {card.mediaUrl && (card.mediaUrl.includes('youtube.com') || card.mediaUrl.includes('youtu.be') || card.mediaUrl.includes('spotify.com') ? (
                                                    <iframe
                                                        src={card.mediaUrl}
                                                        className="absolute inset-0 w-full h-full z-10"
                                                        allowFullScreen
                                                        allow="autoplay; encrypted-media"
                                                    />
                                                ) : card.mediaUrl === "YOUR_MISSING_LINK_HERE" ? (
                                                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-pink-100/90 text-pink-600 font-bold p-4 text-center">
                                                        Oops, you forgot to paste the link for Feb 26! Replace "YOUR_MISSING_LINK_HERE" in the code.
                                                    </div>
                                                ) : (
                                                    <img
                                                        src={card.mediaUrl}
                                                        alt="Romantic Media"
                                                        className="absolute inset-0 w-full h-full object-cover z-10 group-hover:scale-105 transition-transform duration-500"
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = 'none';
                                                        }}
                                                    />
                                                ))}
                                                <div className="absolute flex flex-col items-center justify-center text-pink-400 z-0">
                                                    <Heart className="w-12 h-12 mb-2 animate-pulse" />
                                                    <span className="text-sm font-medium">Wait for it...</span>
                                                </div>
                                            </div>

                                            <div className="p-4 bg-white/50 rounded-2xl border border-white/60 mb-4">
                                                <p className="text-gray-800 font-medium text-base sm:text-lg leading-relaxed italic text-center px-1 sm:px-2">
                                                    "<TypewriterText text={card.message} onComplete={() => setIsMessageComplete(true)} />"
                                                </p>
                                            </div>

                                            {card.id === 2 && isMessageComplete && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="flex justify-center"
                                                >
                                                    <a
                                                        href="https://final-ten-coral.vercel.app/"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-full shadow-[0_10px_20px_rgba(236,72,153,0.3)] hover:shadow-[0_15px_30px_rgba(236,72,153,0.4)] transition-all flex items-center gap-2 group"
                                                    >
                                                        a surprise for you
                                                        <Sparkles className="w-5 h-5 group-hover:animate-spin" />
                                                    </a>
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

        </div>
    );
}
