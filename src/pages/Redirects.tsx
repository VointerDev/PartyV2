import { Navigate, useParams } from "react-router-dom";
import { getPublishedFlashbacks } from "../admin/cmsStore";

export function EventSlugRedirect() {
  const { slug } = useParams();
  return <Navigate to={slug ? `/events/${slug}` : "/events"} replace />;
}

export function FlashbackSlugRedirect() {
  const { slug } = useParams();
  const flashbacks = getPublishedFlashbacks();
  const exists = flashbacks.some((f) => f.slug === slug);
  return <Navigate to={exists && slug ? `/flashback/${slug}` : "/flashback"} replace />;
}
