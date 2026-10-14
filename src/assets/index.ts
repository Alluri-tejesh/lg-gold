// WebP versions of the photos (a fraction of the size of the original JPGs, which are kept as sources).
import millPlantImage from './images/mill-large.webp';
import millPlantImageSmall from './images/mill-small.webp';
import jsrBagImage from './images/jsr-bag-front.webp';

/** For <img srcSet>: phones download the small mill photo, larger screens the full one. */
export const millPlantSrcSet = `${millPlantImageSmall} 900w, ${millPlantImage} 1376w`;

export { millPlantImage, millPlantImageSmall, jsrBagImage };
