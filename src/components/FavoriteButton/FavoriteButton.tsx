import { IconButton } from "@material-ui/core";
import { Star, StarBorder } from "@material-ui/icons";
import React from "react";

type Props = {
  isFavorite: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export const FavoriteButton = React.memo(({ isFavorite, onClick }: Props) => {
  return (
    <IconButton aria-label="button favorite" size="small" onClick={onClick}>
      {isFavorite ? <Star /> : <StarBorder />}
    </IconButton>
  );
});
