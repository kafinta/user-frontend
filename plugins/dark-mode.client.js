export default ({ store }) => {
  const themeType = localStorage.getItem('theme') ? localStorage.getItem('theme') : 'light'
  store.dispatch('global/switchTheme', themeType)

  if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark')
    document.body.classList.add('text-accent1-800', 'dark:bg-accent1-900', 'dark:text-accent1-50')
  } else {
    document.documentElement.classList.remove('dark')
    document.body.classList.remove('text-accent1-800', 'dark:bg-accent1-900', 'dark:text-accent1-50')
  }
}