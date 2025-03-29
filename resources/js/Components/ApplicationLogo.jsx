export default function ApplicationLogo(props) {
    return (
        <svg
            {...props}
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Base circular background for the logo */}
            <circle cx="100" cy="100" r="95" fill="#1b1b1b" />
            <circle cx="100" cy="100" r="90" fill="#f0f0f0" />
            
            {/* The 'A' in Aconomy, formed as part of a circle with a line through it (anarchist symbol) */}
            <path d="M100 20 
                    A80 80 0 0 1 180 100
                    A80 80 0 0 1 100 180
                    A80 80 0 0 1 20 100
                    A80 80 0 0 1 100 20" 
                  stroke="#d32f2f" 
                  strokeWidth="4" 
                  fill="none" />
            
            {/* The horizontal line in the A/circle */}
            <line x1="40" y1="100" x2="160" y2="100" stroke="#d32f2f" strokeWidth="4" />
            
            {/* Solidarity hands icon */}
            <path d="M85 120 
                    C95 110, 105 110, 115 120
                    L115 140
                    C105 150, 95 150, 85 140
                    Z" 
                  fill="#4CAF50" />
            
            {/* Network connections - sharing economy concept */}
            <circle cx="60" cy="70" r="10" fill="#2196F3" />
            <circle cx="140" cy="70" r="10" fill="#2196F3" />
            <circle cx="60" cy="130" r="10" fill="#2196F3" />
            <circle cx="140" cy="130" r="10" fill="#2196F3" />
            
            {/* Connection lines */}
            <line x1="60" y1="70" x2="140" y2="70" stroke="#2196F3" strokeWidth="2" />
            <line x1="60" y1="130" x2="140" y2="130" stroke="#2196F3" strokeWidth="2" />
            <line x1="60" y1="70" x2="60" y2="130" stroke="#2196F3" strokeWidth="2" />
            <line x1="140" y1="70" x2="140" y2="130" stroke="#2196F3" strokeWidth="2" />
            <line x1="60" y1="70" x2="140" y2="130" stroke="#2196F3" strokeWidth="2" />
            <line x1="60" y1="130" x2="140" y2="70" stroke="#2196F3" strokeWidth="2" />
            
            {/* Outer edge with radial gradient for progressive feel */}
            <circle cx="100" cy="100" r="95" fill="none" stroke="url(#gradient)" strokeWidth="5" />
            
            {/* Gradient definition */}
            <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#673AB7" />
                    <stop offset="50%" stopColor="#E91E63" />
                    <stop offset="100%" stopColor="#FFC107" />
                </linearGradient>
            </defs>
        </svg>
    );
}
