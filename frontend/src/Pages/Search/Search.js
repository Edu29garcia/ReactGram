import "./Search.css";

// Hooks
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useResetComponentMessage } from "../../Hooks/useResetComponentMessage";
import { Link } from "react-router-dom";
import { useQuery } from "../../Hooks/useQuery";

// Componentes
import LikeContainer from "../../Components/LikeContainer";
import PhotoItem from "../../Components/PhotoItem";

// Redux
import { searchPhotos, like } from "../../Slices/photoSlice";

const Search = () => {
  const query = useQuery();
  const search = query.get("q");

  const dispatch = useDispatch();
  const resetMessage = useResetComponentMessage(dispatch);

  const { user } = useSelector((state) => state.auth);

  const { photos, loading } = useSelector((state) => state.photo);

  // Pegar as fotos

  useEffect(() => {
    dispatch(searchPhotos(search));
  }, [dispatch, search]);

  // Likes
  const handleLike = (photo) => {
    dispatch(like(photo._id));

    resetMessage();
  };

  if (loading) {
    <p>Carregando...</p>;
  }

  return (
    <div id="search">
      <h2>Buscando: {search}</h2>
      {photos &&
        photos.map((photo) => (
          <div key={photo._id}>
            <PhotoItem photo={photo} />
            <LikeContainer photo={photo} user={user} handleLike={handleLike} />
            <Link className="btn" to={`/photos/${photo._id}`}>
              Ver mais...
            </Link>
          </div>
        ))}
      {photos && photos.length === 0 && (
        <h2 className="no-photos">
          Não foram encontrados resultados para a sua busca...
        </h2>
      )}
    </div>
  );
};

export default Search;
