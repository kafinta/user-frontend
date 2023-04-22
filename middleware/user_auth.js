export default function({store, redirect }){
  if (store.state.authentication.token == null){
    return redirect('/login');
  }
}