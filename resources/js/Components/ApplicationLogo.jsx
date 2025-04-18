export default function ApplicationLogo(props) {
    return (
        <svg
            {...props}
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g>
                <circle cx="50" cy="55" r="44"
                        fill="transparent"
                        stroke="#E8E0D0"
                        strokeWidth="2" />
                <path d="M50,30 L65,45 L50,80 L35,45 Z" fill="#E26D5C" />
                <path d="M30,40 L50,30 L35,45 Z" fill="#FF851B" opacity="0.8" />
                <path d="M70,40 L50,30 L65,45 Z" fill="#B10DC9" opacity="0.8" />
                <path d="M35,45 L25,60 L50,80 Z" fill="#7FDBFF" opacity="0.8" />
                <path d="M65,45 L75,60 L50,80 Z" fill="#3D9970" opacity="0.8" />
                <text x="50" y="110" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#444">Original</text>
            </g>
        </svg>
    );
}
