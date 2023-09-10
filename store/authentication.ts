import { defineStore } from 'pinia'

export const UserAuth = defineStore('authentication',{
  state: () => {
    return {
      token: process.browser ? localStorage.getItem('token') : null || null,
      auth_status: false,
      user_request: {
        email: '',
        username: '',
        password: ''
      },
      user: {

      }
    }
  },
  actions: {
    signup() {
      async (user_request: { email: string, username: string, password: string }) => {
        await fetch('/api/user/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', 
          },
          body: JSON.stringify(user_request),
        })
          .then((response) => {
            if (response.ok) {
              console.log('Signup successful!');
            } else {
              console.error('Signup failed with status code:', response.status);
              response.text().then((errorText) => {
                console.error('Response content:', errorText);
              });
            }
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      };
    },
  },
  getters: {
    userToken: state => state.token != null,
    authStatus: state => state.auth_status,
    userInfo: state => state.user,
  },
})