import React from "react";

function Card({ card, user, onCardOpen }) {
  const { likes, link, name, owner, _id } = card;

  const hasLike = () => {
    return likes.some((like) => like._id === user._id);
  };

  return (
    <div className="gallery__block">
      <img
        className="gallery__image"
        alt={name}
        src={link}
        onClick={() => {
          onCardOpen(card);
        }}
      />
      {user._id === owner._id && (
        <button
          className="gallery__block-button-delete"
          aria-label="Кнопка удаления карточки"
        ></button>
      )}
      <div className="gallery__info">
        <h2 className="gallery__photo-name">{name}</h2>
        <div className="gallery__info_like-block">
          <button
            className={`gallery__like-button ${
              hasLike() && "gallery__like-button_active"
            }`}
            type="button"
            aria-label="Кнопка лайка карточки"
          ></button>
          <span className="gallery__like-counter" aria-label={likes.length}>
            {likes.length}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Card;
