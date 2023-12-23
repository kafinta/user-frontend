export function useQuery<T>(){
  const query = useState('query', () => ref({}))
  return {query}
}