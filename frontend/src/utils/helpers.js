export const getErrorMessage = (error) =>
  error?.response?.data?.message || error?.message || "Something went wrong";

export const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })
    : "";

export const formatPrice = (price) => (!price ? "Free" : `$${Number(price).toFixed(2)}`);

// Turns a YouTube link into an embeddable URL; returns null for other links
export const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
};

export const isDirectVideo = (url) => /\.(mp4|webm|ogg)(\?.*)?$/i.test(url || "");
