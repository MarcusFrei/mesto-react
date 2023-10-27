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

  return (
    <div>
      <ImagePopup
        card={currentOpenCard}
        isOpen={isCardPopupOpened}
        onClose={closeAllPopups}
      />

      <EditAvatarPopup
        isOpen={isEditAvatarOpened}
        onClose={closeAllPopups}
        isLoading={isLoading}
      />

      <EditUserInfo
        isOpen={isEditProfileOpened}
        onClose={closeAllPopups}
        isLoading={isLoading}
        userInfo={userInfo}
      />

      <AddCardPopup
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
        onCardOpen={handleOpenCardClick}
        cards={cards}
      />
      <Footer />
    </div>
  );
}

export default App;
