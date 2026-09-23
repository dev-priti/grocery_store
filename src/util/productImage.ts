export const DEFAULT_PRODUCT_IMAGE =
  "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/1.webp";

export const getProductImage = (image?: string | null) => {
  if (!image || image.trim() === "") {
    return DEFAULT_PRODUCT_IMAGE;
  }

  return image;
};
