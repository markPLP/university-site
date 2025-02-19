// import axios from 'axios';

// class Search {
//   constructor() {
//     this.isOverlayOpen = false;
//     this.isSpinnerVisible = false;
//     this.previousValue = '';
//     this.typingTimer = null;

//     // DOM Elements
//     this.resultsDiv = this.createSearchOverlay();
//     this.searchOverlay = document.querySelector('.search-overlay');
//     this.searchField = document.querySelector('#search-term');

//     this.init();
//   }

//   init() {
//     document.body.addEventListener('click', (e) => this.handleClick(e));
//     document.addEventListener('keydown', (e) => this.keyPressDispatcher(e));
//     this.searchField.addEventListener(
//       'keyup',
//       this.debounce(this.handleTyping.bind(this), 750)
//     );
//   }

//   handleClick(e) {
//     if (e.target.closest('.js-search-trigger')) {
//       this.openOverlay(e);
//     } else if (e.target.matches('.search-overlay__close')) {
//       this.closeOverlay();
//     }
//   }

//   openOverlay(e) {
//     if (e) e.preventDefault();
//     this.searchOverlay.classList.add('search-overlay--active');
//     document.body.classList.add('body-no-scroll');
//     this.searchField.value = '';
//     setTimeout(() => this.searchField.focus(), 301);
//     this.isOverlayOpen = true;
//   }

//   closeOverlay() {
//     this.searchOverlay.classList.remove('search-overlay--active');
//     document.body.classList.remove('body-no-scroll');
//     this.isOverlayOpen = false;
//   }

//   keyPressDispatcher(e) {
//     if (
//       e.key === 's' &&
//       !this.isOverlayOpen &&
//       !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)
//     ) {
//       this.openOverlay();
//     }
//     if (e.key === 'Escape' && this.isOverlayOpen) {
//       this.closeOverlay();
//     }
//   }

//   async handleTyping() {
//     const query = this.searchField.value.trim();

//     if (query !== this.previousValue) {
//       this.previousValue = query;
//       if (!query) {
//         this.resultsDiv.innerHTML = '';
//         this.isSpinnerVisible = false;
//         return;
//       }

//       if (!this.isSpinnerVisible) {
//         this.resultsDiv.innerHTML = '<div class="spinner-loader"></div>';
//         this.isSpinnerVisible = true;
//       }

//       await this.fetchResults(query);
//     }
//   }

//   async fetchResults(query) {
//     try {
//       const { data: results } = await axios.get(
//         `${universityData.root_url}/wp-json/university/v1/search?term=${query}`
//       );
//       this.renderResults(results);
//       this.isSpinnerVisible = false;
//     } catch (error) {
//       console.error('Error fetching search results:', error);
//       this.resultsDiv.innerHTML = '<p>Something went wrong. Try again.</p>';
//     }
//   }

//   renderResults(results) {
//     this.resultsDiv.innerHTML = `
//       <div class="row">
//         ${this.renderSection(
//           'General Information',
//           results.generalInfo,
//           (item) =>
//             `<li><a href="${item.permalink}">${item.title}</a> by ${
//               item.postType == 'post' ? item.authorName : ''
//             }</li>`
//         )}
//         ${this.renderSection(
//           'Programs',
//           results.programs,
//           (item) => `<li><a href="${item.permalink}">${item.title}</a></li>`,
//           `<a href="${universityData.root_url}/programs">View all programs</a>`
//         )}
//         ${this.renderSection(
//           'Professors',
//           results.professors,
//           (item) => `
//           <li class="professor-card__list-item">
//             <a class="professor-card" href="${item.permalink}">
//               <img class="professor-card__image" src="${item.image}" alt="${item.title}" />
//               <span class="professor-card__name">${item.title}</span>
//             </a>
//           </li>
//         `
//         )}
//         ${this.renderSection(
//           'Campuses',
//           results.campuses,
//           (item) => `<li><a href="${item.permalink}">${item.title}</a></li>`,
//           `<a href="${universityData.root_url}/campuses">View all campuses</a>`
//         )}
//         ${this.renderSection(
//           'Events',
//           results.events,
//           (item) => `
//           <div class="event-summary">
//             <a class="event-summary__date t-center" href="${item.permalink}">
//               <span class="event-summary__month">${item.month}</span>
//               <span class="event-summary__day">${item.day}</span>
//             </a>
//             <div class="event-summary__content">
//               <h5 class="event-summary__title headline headline--tiny">
//                 <a href="${item.permalink}">${item.title}</a>
//               </h5>
//               <p>${item.description} <a href="${item.permalink}" class="nu gray">Learn more</a></p>
//             </div>
//           </div>
//         `
//         )}
//       </div>
//     `;
//   }

//   renderSection(title, items, itemTemplate, fallbackLink = '') {
//     return `
//       <div class="one-third">
//         <h2 class="search-overlay__section-title">${title}</h2>
//         ${
//           items.length
//             ? `<ul class="${
//                 title === 'Professors'
//                   ? 'professor-cards'
//                   : 'link-list min-list'
//               }">
//                 ${items.map(itemTemplate).join('')}
//               </ul>`
//             : `<p>No ${title.toLowerCase()} match that search. ${fallbackLink}</p>`
//         }
//       </div>
//     `;
//   }

//   createSearchOverlay() {
//     document.body.insertAdjacentHTML(
//       'beforeend',
//       `
//       <div class="search-overlay">
//         <div class="search-overlay__top">
//           <div class="container">
//             <i class="fa fa-search search-overlay__icon" aria-hidden="true"></i>
//             <input type="text" class="search-term" placeholder="What are you looking for?" id="search-term" autocomplete="off" />
//             <i class="fa fa-window-close search-overlay__close" aria-hidden="true"></i>
//           </div>
//         </div>
//         <div class="container">
//           <div id="search-overlay__results"></div>
//         </div>
//       </div>
//       `
//     );
//     return document.querySelector('#search-overlay__results');
//   }

//   debounce(func, delay) {
//     return (...args) => {
//       clearTimeout(this.typingTimer);
//       this.typingTimer = setTimeout(() => func.apply(this, args), delay);
//     };
//   }
// }

// // Initialize Search
// document.addEventListener('DOMContentLoaded', () => new Search());
