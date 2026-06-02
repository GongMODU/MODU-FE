import FavoriteActive from "@/assets/images/favorites-icon-active.svg";
import FavoriteDefault from "@/assets/images/favorites-icon-default.svg";

type FavoriteIconProps = {
  /** 찜 등록 여부 */
  isFavorite: boolean;
  /** 아이콘 크기 (default: 18) */
  size?: number;
};

export default function FavoriteIcon({
  isFavorite,
  size = 18,
}: FavoriteIconProps) {
  const Icon = isFavorite ? FavoriteActive : FavoriteDefault;
  return <Icon width={size} height={size} />;
}
