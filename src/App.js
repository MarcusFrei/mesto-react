import { useEffect, useState } from "react";
import "./App.css";
import Footer from "./component/Footer";
import Header from "./component/Header";
import Main from "./component/Main";
import EditAvatarPopup from "./component/EditAvatarPopup";
import { api } from "./api/Api";
import EditUserInfo from "./component/EditUserInfo";
import AddCardPopup from "./component/AddCardPopup";
import ImagePopup from "./component/ImagePopup";

function App() {
  const [isEditAvatarOpened, setIsEditAvatarOpened] = useState(false);
  const [isEditProfileOpened, setIsEditProfileOpened] = useState(false);
  const [isAddCardOpened, setIsAddCardOpened] = useState(false);
  const [isCardPopupOpened, setIsCardPopupOpened] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [cards, setCards] = useState([]);
  const [currentOpenCard, setCurrentOpenCard] = useState({});

  const isPopupsOpened =
    isEditAvatarOpened ||
    isEditProfileOpened ||
    isAddCardOpened ||
    isCardPopupOpened;

  useEffect(() => {
    api.getUserInfo().then((data) => setUserInfo(data));
    api.getInitialCards().then((data) => setCards(data));
  }, []);

  useEffect(() => {
    if (isPopupsOpened) {
      document.addEventListener("keydown", closePopupByEsape);
      document.addEventListener("mousedown", closePopupByOverlay);
    }
    return () => {
      document.removeEventListener("keydown", closePopupByEsape);
      document.removeEventListener("mousedown", closePopupByOverlay);
    };
  }, [isPopupsOpened]);

  function closePopupByEsape(e) {
    if (e.key === "Escape") {
      console.log("escape");
      closeAllPopups();
    }
  }

  function closePopupByOverlay(e) {
    if (e.target.classList.contains("popup_opened")) {
      console.log("over close");
      closeAllPopups();
    }
  }

  function handleEditAvatarClick() {
    setIsEditAvatarOpened(true);
  }

  function handleEditProfileClick() {
    setIsEditProfileOpened(true);
  }

  function handleAddCardClick() {
    setIsAddCardOpened(true);
  }

  function handleOpenCardClick(card) {
    setIsCardPopupOpened(true);
    setCurrentOpenCard(card);
  }

  function closeAllPopups() {
    setIsEditAvatarOpened(false);
    setIsEditProfileOpened(false);
    setIsAddCardOpened(false);
    setIsCardPopupOpened(false);
  }

  function updateAvatar(obj) {
    console.log("api avatar");
    setIsLoading(true);
    api
      .updateAvatar(obj)
      .then((data) => {
        setUserInfo(data);
        closeAllPopups();
      })
      .catch((e) => console.log(e))
      .finally(() => setIsLoading(false));
  }

  function addCard(obj) {
    console.log(obj);
    setIsLoading(true);
    api
      .sendNewCard(obj)
      .then((data) => {
        setCards([data, ...cards]);
        closeAllPopups();
      })
      .catch((e) => console.log(e))
      .finally(() => setIsLoading(false));
  }

  function updateUserInfo(obj) {
    console.log("api profile");
    setIsLoading(true);
    api
      .editProfile(obj)
      .then((data) => {
        setUserInfo(data);
        closeAllPopups();
      })
      .catch((e) => console.log(e))
      .finally(() => setIsLoading(false));
  }

  function deleteCard(id) {
    console.log(id);
    setIsLoading(true);
    api
      .deleteCard(id)
      .then((data) => {
        console.log(data);
        const tempCopy = cards.filter((card) => card._id !== id);
        setCards(tempCopy);

        closeAllPopups();
      })
      .catch((e) => console.log(e))
      .finally(() => setIsLoading(false));
  }

  function setLike(card) {
    const isCardLiked = card.likes.some((elem) => elem._id === userInfo._id);

    if (!isCardLiked) {
      api
        .setLike(card._id)
        .then((data) => {
          console.log(data);
          const tempCopy = cards.map((card) =>
            card._id === data._id ? data : card
          );
          setCards(tempCopy);
        })
        .catch((e) => console.log(e));
    } else {
      api
        .deleteLike(card._id)
        .then((data) => {
          console.log(data);
          const tempCopy = cards.map((card) =>
            card._id === data._id ? data : card
          );
          setCards(tempCopy);
        })
        .catch((e) => console.log(e));
    }
  }

  return (
    <div>
      <ImagePopup
        card={currentOpenCard}
        isOpen={isCardPopupOpened}
        onClose={closeAllPopups}
      />

      <EditAvatarPopup
        handleSubmit={updateAvatar}
        isOpen={isEditAvatarOpened}
        onClose={closeAllPopups}
        isLoading={isLoading}
      />

      <EditUserInfo
        handleSubmit={updateUserInfo}
        isOpen={isEditProfileOpened}
        onClose={closeAllPopups}
        isLoading={isLoading}
        userInfo={userInfo}
      />

      <AddCardPopup
        handleSubmit={addCard}
        isOpen={isAddCardOpened}
        onClose={closeAllPopups}
        isLoading={isLoading}
      />

      <Header />
      <Main
        userInfo={userInfo}
        onEditAvatarOpen={handleEditAvatarClick}
        onEditProfileOpen={handleEditProfileClick}
        onAddCardOpen={handleAddCardClick}
        onDeleteCard={deleteCard}
        onCardLike={setLike}
        onCardOpen={handleOpenCardClick}
        cards={cards}
      />
      <Footer />
    </div>
  );
}

export default App;
