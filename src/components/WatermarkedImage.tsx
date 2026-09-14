import { LOGO_ALT, LOGO_SRC } from "../logo";

type WatermarkedImageProps = {
  src: string;
  alt?: string;
  className?: string;
  imgClassName?: string;
  loading?: "lazy" | "eager";
  fit?: "cover" | "contain";
  showWatermark?: boolean;
};

export function WatermarkedImage({
  src,
  alt = "",
  className,
  imgClassName,
  loading,
  fit = "cover",
  showWatermark = true,
}: WatermarkedImageProps) {
  return (
    <div
      className={`watermarked-image${fit === "contain" ? " watermarked-image--contain" : ""}${className ? ` ${className}` : ""}`}
    >
      <img src={src} alt={alt} className={imgClassName} loading={loading} />
      {showWatermark ? (
        <div className="watermarked-image-sticker" aria-hidden="true">
          <img src={LOGO_SRC} alt={LOGO_ALT} className="watermarked-image-sticker-logo" />
        </div>
      ) : null}
    </div>
  );
}
