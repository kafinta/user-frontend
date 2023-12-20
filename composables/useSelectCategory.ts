export function useSelectCategory<T>(){
    const id = useState('id', () => ref(''))
    return {id}
}