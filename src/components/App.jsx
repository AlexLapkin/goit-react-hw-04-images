import { useEffect, useState } from 'react';
import Modal from './Modal/Modal';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import Loader from './Loader/Loader';
import fetchImage from './FetchImage/FetchImage';
import Notiflix from 'notiflix';

export const App = () => {
  const [gallery, setGallery] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchWord, setSearchWord] = useState('');
  const [prevSearchWord, setPrevSearchWord] = useState('');
  const [page, setPage] = useState(1);
  const [isOpenModal, setIsOpenmodal] = useState(false);
  const [largeImageURL, setLargeImageURL] = useState('largeImageURL');
  const [onLoadMore, setOnLoadMore] = useState(false);
  const [error, setError] = useState(null);
  const per_page = 12;

  const fetchGallery = async (searchWord, page) => {
    if (!searchWord) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setPrevSearchWord(searchWord);
    try {
      const { data } = await fetchImage(searchWord, page);
      const { totalHits } = data;

      if (data.hits.length !== 0 && page === 1) {
        Notiflix.Notify.success(
          `We found ${totalHits} images for your request`,
          { position: 'right-top', timeout: 3000 }
        );
      }
      if (data.hits.length === 0) {
        Notiflix.Notify.failure(
          'Nothing found for your request! Please enter another word!',
          { position: 'center-center', timeout: 3000 }
        );
        setSearchWord('');
      }

      setGallery(prevState =>
        page === 1 ? data.hits : [...prevState, ...data.hits]
      );

      setIsLoading(false);
      setOnLoadMore(totalHits > per_page * page ? true : false);

      if (totalHits <= per_page * page && totalHits) {
        Notiflix.Notify.info(
          'We are sorry, but you have reached the end of search results!',
          { position: 'right-top', timeout: 5000 }
        );
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onClickLoadMore = () => {
    setPage(prevState => prevState + 1);
  };

  const openModal = largeImageURL => {
    setIsOpenmodal(true);
    setLargeImageURL(largeImageURL);
  };

  const closeModal = () => {
    setIsOpenmodal(false);
    setLargeImageURL(largeImageURL);
  };

  const formSubmit = searchWord => {
    if (!searchWord) {
      Notiflix.Notify.info('Please enter any word for search!', {
        position: 'right-top',
        timeout: 3000,
      });
      return;
    }

    setSearchWord(searchWord);
    setGallery(prevState => (searchWord === prevSearchWord ? prevState : null));
    setPage(prevState => (searchWord !== prevSearchWord ? 1 : prevState));
  };

  useEffect(() => {
    fetchGallery(searchWord, page);
  }, [searchWord, page]);

  return (
    <div>
      <Searchbar onSubmit={formSubmit} />

      <ImageGallery gallery={gallery} openModal={openModal} />

      {isLoading && <Loader />}

      {gallery && onLoadMore && !isLoading && !error && (
        <Button onClickLoadMore={onClickLoadMore} />
      )}

      {isOpenModal && (
        <Modal closeModal={closeModal} largeImageURL={largeImageURL} />
      )}
    </div>
  );
};
