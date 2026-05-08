import PropTypes from "prop-types";
import { IMG_FALLBACK } from "../utils/mockData";

/**
 * Img — drop-in <img> replacement with automatic broken-image fallback.
 * Uses IMG_FALLBACK from mockData so the placeholder is consistent everywhere.
 */
export default function Img({ src, alt = "", className = "", style = {}, ...rest }) {
  return (
    <img
      src={src || IMG_FALLBACK}
      alt={alt}
      className={className}
      style={style}
      loading="lazy"
      onError={(e) => {
        if (e.target.src !== IMG_FALLBACK) {
          e.target.src = IMG_FALLBACK;
        }
      }}
      {...rest}
    />
  );
}

Img.propTypes = {
  src:       PropTypes.string,
  alt:       PropTypes.string,
  className: PropTypes.string,
  style:     PropTypes.object,
};
