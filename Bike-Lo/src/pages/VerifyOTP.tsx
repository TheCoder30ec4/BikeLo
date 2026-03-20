import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { verifyOtpApi } from '@/services/authService';

export default function VerifyOTP() {
  const location = useLocation();
  const navigate = useNavigate();
  const { verify } = useAuth();
  const [digits, setDigits] = useState<string[]>(new Array(6).fill(''));
  const inputsRef = useRef<HTMLInputElement[]>([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [resendTimer, setResendTimer] = useState<number>(60);
  const [isVerifying, setIsVerifying] = useState(false);

  const email = (location.state as any)?.email || '';

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const code = digits.join('').trim();
    if (code.length !== 6) {
      setError('Enter the 6-digit code');
      return;
    }
    // call remote verify API
    (async () => {
      try {
        setIsVerifying(true);
        await verifyOtpApi(email, code);
        await verify(email);
        const otps2 = JSON.parse(localStorage.getItem('bikelo_otps') || '{}');
        delete otps2[email];
        localStorage.setItem('bikelo_otps', JSON.stringify(otps2));
        setMessage('Verified! Redirecting...');
        setTimeout(() => navigate('/'), 800);
      } catch (err: any) {
        setError(err?.message || 'Verification failed');
      } finally {
        setIsVerifying(false);
      }
    })();
  };

  const handleResend = () => {
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const otps = JSON.parse(localStorage.getItem('bikelo_otps') || '{}');
    otps[email] = { otp: newOtp, expiresAt: Date.now() + 1000 * 60 * 5 };
    localStorage.setItem('bikelo_otps', JSON.stringify(otps));
    // In a real app you'd send via SMS/Email. For demo we show message.
    setMessage(`OTP resent (demo): ${newOtp}`);
    setTimeout(() => setMessage(''), 8000);
    // start resend cooldown
    setResendTimer(60);
  };

  // countdown timer for resend button
  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setInterval(() => {
      setResendTimer((s) => {
        if (s <= 1) {
          clearInterval(t);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [resendTimer]);

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-8 bg-card rounded-lg">No email provided. Go back to signup.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <motion.div className="w-full max-w-md" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="bg-card border border-border rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Noto Serif', serif" }}>Verify OTP</h2>
          <p className="text-sm text-muted-foreground mb-2">Enter the 6-digit code sent to {email}</p>
          {error && <div className="text-sm text-destructive mb-2">{error}</div>}
          {message && <div className="text-sm text-emerald-600 mb-2">{message}</div>}
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="flex gap-2 justify-center">
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    if (el) {
                      inputsRef.current[i] = el;
                    }
                  }}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  className="w-12 h-12 text-center rounded-md border border-input bg-background px-2 py-2 text-lg focus:outline-none"
                  value={d}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, '').slice(0, 1);
                    const next = [...digits];
                    next[i] = v;
                    setDigits(next);
                    if (v && i < 5) {
                      inputsRef.current[i + 1]?.focus();
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace') {
                      if (digits[i]) {
                        const next = [...digits];
                        next[i] = '';
                        setDigits(next);
                      } else if (i > 0) {
                        inputsRef.current[i - 1]?.focus();
                        const next = [...digits];
                        next[i - 1] = '';
                        setDigits(next);
                      }
                    } else if (e.key === 'ArrowLeft' && i > 0) {
                      inputsRef.current[i - 1]?.focus();
                    } else if (e.key === 'ArrowRight' && i < 5) {
                      inputsRef.current[i + 1]?.focus();
                    }
                  }}
                  onPaste={(e) => {
                    const paste = e.clipboardData.getData('Text').replace(/\D/g, '').slice(0, 6);
                    if (paste.length) {
                      const next = new Array(6).fill('');
                      for (let j = 0; j < paste.length; j++) next[j] = paste[j];
                      setDigits(next);
                      const focusIndex = Math.min(paste.length, 5);
                      setTimeout(() => inputsRef.current[focusIndex]?.focus(), 0);
                      e.preventDefault();
                    }
                  }}
                />
              ))}
            </div>
            <div className="flex gap-3 items-center">
              <Button type="submit" className="flex-1" style={{ fontFamily: "'Noto Serif', serif" }} disabled={isVerifying}>
                {isVerifying ? 'Verifying...' : 'Verify'}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleResend}
                disabled={resendTimer > 0}
                style={{ fontFamily: "'Noto Serif', serif" }}
              >
                {resendTimer > 0 ? `Resend (${resendTimer}s)` : 'Resend'}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

