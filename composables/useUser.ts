export function useUser<T>(){
  const user = ref({})
  const updateUser = (info:object) => {
    user.value = info;
  };
  return {
    user, updateUser
  };
}