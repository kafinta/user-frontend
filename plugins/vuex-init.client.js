export default ({ store }) => {
    const viewType = localStorage.getItem('book_view') ? localStorage.getItem('book_view') : 'grid'
    store.dispatch('books/changeView', viewType)
  }