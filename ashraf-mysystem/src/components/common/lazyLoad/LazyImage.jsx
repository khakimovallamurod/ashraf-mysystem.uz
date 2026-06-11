import { LazyLoadImage } from "react-lazy-load-image-component";
function LazyImage({ imgUrl, width = null, height = null, alt = "", className }) {
    return (
        <LazyLoadImage src={imgUrl} width={width} height={height} alt={alt} className={className} />
    );
}

export default LazyImage;
