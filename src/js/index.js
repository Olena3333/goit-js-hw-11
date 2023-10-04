import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { fetchImg, per_page } from './api.js';

const refs = {
  formEl: document.querySelector('.search-form'),
  inputEl: document.querySelector('[name="searchQuery"]'),
  divEl: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.js-load-more-btn'),
};
let page = 1;
let seatchTerm = '';
let quantityPage = 500;
const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

refs.formEl.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);

async function onFormSubmit(e) {
  e.preventDefault();
  page = 1;
  refs.divEl.innerHTML = '';
  if (!e.target.elements.searchQuery.value.trim()) {
    refs.loadMoreBtn.classList.add('is-hidden');
    return Notiflix.Notify.failure('Please fill the form');
  }
  seatchTerm = e.target.elements.searchQuery.value.trim();
  try {
    const data = await fetchImg(seatchTerm, page);
    if (data.hits.length === 0) {
      refs.loadMoreBtn.classList.add('is-hidden');
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    renderPage(data.hits);
    quantityPage = Math.ceil(data.totalHits / per_page);
    Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`);
    refs.loadMoreBtn.classList.remove('is-hidden');
    if (quantityPage === page) {
      refs.loadMoreBtn.classList.add('is-hidden');
      refs.formEl.reset();
      Notiflix.Notify.success(
        'Were sorry, but youve reached the end of search results.'
      );
    }
  } catch (error) {
    console.log(error);
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  refs.formEl.reset();
}

async function renderPage(images) {
  try {
    const markup = images
      .map(
        ({
          webformatURL,
          largeImageURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        }) =>
          `<div class="photo-card ">
  <a href = "${largeImageURL}"> <img class="gallery_image" src="${webformatURL}" alt="${tags}" loading="lazy" /> </a>
  <div class="info">
    <p class="info-item">
      <b>Likes ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${downloads}</b>
    </p>
  </div>
</div>`
      )
      .join('');

    refs.divEl.insertAdjacentHTML('beforeend', markup);
    lightbox.refresh();

    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  } catch (error) {
    console.log(error);
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

async function onLoadMoreBtnClick() {
  page += 1;
  try {
    const response = await fetchImg(seatchTerm, page);
    if (quantityPage === page) {
      refs.loadMoreBtn.classList.add('is-hidden');
      refs.formEl.reset();
      Notiflix.Notify.success(
        'Were sorry, but youve reached the end of search results.'
      );
    }
    renderPage(response.hits);
  } catch (error) {
    console.log(error);
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}
