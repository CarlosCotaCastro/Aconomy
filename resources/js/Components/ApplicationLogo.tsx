export default function ApplicationLogo(props) {
    return (
        <div style={{
            fontSize: props.fontSize ?? "2.5rem",
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            marginBottom: "0.5rem",
            letterSpacing: "-0.04em",
        }}>
            <img src="/aconomy-icon.png" alt="logo" style={{
                display: "inline",
                width: "1em",
                height: "1em",
                margin: "0 .4em 0.5rem 0",
                //filter: "drop-shadow(0 0 15px rgba(0, 123, 255, 0.7))"
            }} />
            Aconomy
        </div>
    );
}
