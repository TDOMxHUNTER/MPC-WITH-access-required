
export class SecurityManager {
  private static instance: SecurityManager;
  private requestCounts = new Map<string, { count: number; resetTime: number }>();

  constructor() {
    if (typeof window !== 'undefined') {
      this.initSecurity();
    }
  }

  static getInstance(): SecurityManager {
    if (!SecurityManager.instance) {
      SecurityManager.instance = new SecurityManager();
    }
    return SecurityManager.instance;
  }

  private initSecurity() {
    this.preventDevTools();
    this.overrideConsole();
    this.preventRightClick();
    this.preventBypass();
    this.detectSourceViewing();
  }

  private preventDevTools() {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
      document.addEventListener('keydown', (e) => {
        if (
          e.key === 'F12' ||
          (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
          (e.ctrlKey && e.key === 'U')
        ) {
          e.preventDefault();
          return false;
        }
      });
    }
  }

  private preventRightClick() {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
      });
    }
  }

  private showWarning() {
    if (typeof window !== 'undefined') {
      const warning = document.createElement('div');
      warning.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(255, 0, 0, 0.9);
        color: white;
        padding: 10px 15px;
        border-radius: 5px;
        z-index: 10000;
        font-family: Arial, sans-serif;
        font-size: 14px;
      `;
      warning.textContent = 'Developer tools detected!';
      document.body.appendChild(warning);

      setTimeout(() => {
        warning.remove();
      }, 5000);
    }
  }

  // Simplified console override for production
  private overrideConsole() {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      // Only override in production and preserve essential logging
      const noop = () => {};
      console.log = noop;
      console.debug = noop;
      console.table = noop;
      // Keep warn and error for important messages
    }
  }

  public preventBypass() {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      // Additional anti-bypass measures
      setInterval(() => {
        if (console.clear) {
          console.clear();
        }
      }, 1000);
    }
  }

  public detectSourceViewing() {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      // Detect view source attempts
      document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'u') {
          e.preventDefault();
          this.showWarning();
          return false;
        }
      });
    }
  }

  // Input sanitization
  public sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '')
      .replace(/script/gi, '')
      .trim();
  }

  // XSS protection
  public escapeHtml(text: string): string {
    if (typeof document === 'undefined') return text;
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Rate limiting for API calls
  public checkRateLimit(identifier: string, maxRequests = 10, windowMs = 60000): boolean {
    const now = Date.now();
    const record = this.requestCounts.get(identifier);

    if (!record || now > record.resetTime) {
      this.requestCounts.set(identifier, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (record.count >= maxRequests) {
      return false;
    }

    record.count++;
    return true;
  }

  // Clean up expired rate limit records
  public cleanupRateLimits() {
    const now = Date.now();
    for (const [key, record] of this.requestCounts.entries()) {
      if (now > record.resetTime) {
        this.requestCounts.delete(key);
      }
    }
  }
}

// Export singleton instance
export const securityManager = SecurityManager.getInstance();

// Initialize security immediately
if (typeof window !== 'undefined') {
  const security = SecurityManager.getInstance();
  security.preventBypass();
  security.detectSourceViewing();
}
