export default function ApplicationLogo(props) {
    return (
        //<img src="/logo.png" alt="logo" style={{maxWidth: '48px'}} />
        <div style={{
            fontSize: props.fontSize ?? "3.5rem",
            fontWeight: 700,
            background: "linear-gradient(135deg, #007bff 0%, #ff0096 30%, #8a2be2 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "0.5rem",
            letterSpacing: "-0.02em",
            filter: "drop-shadow(0 0 15px rgba(0, 123, 255, 0.4))",
        }}>
            <img src="/logoIcon.svg" alt="logo" style={{
                display: "inline",
                width: "1em",
                height: "1em",
                margin: "0 .4em 1.4rem 0",
                filter: "drop-shadow(0 0 15px rgba(0, 123, 255, 0.7))"
            }} />
            Aconomy
        </div>
    );
}
