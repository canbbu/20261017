export function HeroPhotoMotion({ children }: { children: React.ReactNode }) {
  return <div className="hero__media">{children}</div>;
}

export function HeroTextMotion({
  headline,
  groomName,
  brideName,
  date,
  dateTime,
  scriptClassName = "",
  dateClassName = "",
}: {
  headline: readonly [string, string];
  groomName: string;
  brideName: string;
  date: string;
  dateTime: string;
  scriptClassName?: string;
  dateClassName?: string;
}) {
  const [firstLine, secondLine] = headline;

  return (
    <div className="hero__copy">
      <h1 className={["hero__headline", scriptClassName].filter(Boolean).join(" ")}>
        <span>{firstLine}</span>
        <span>{secondLine}</span>
      </h1>
      <p className="hero__names">
        {groomName} <span className="hero__names-dot">·</span> {brideName}
      </p>
      <time className={["hero__date", dateClassName].filter(Boolean).join(" ")} dateTime={dateTime}>
        {date}
      </time>
    </div>
  );
}
