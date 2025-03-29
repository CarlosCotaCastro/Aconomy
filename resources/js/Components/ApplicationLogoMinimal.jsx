export default function ApplicationLogoMinimal(props) {
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
            
            {/* Outer edge with subtle gray stroke instead of gradient */}
            <circle cx="100" cy="100" r="95" fill="none" stroke="#555555" strokeWidth="2" />
        </svg>
    );
} 