// return {
//   token: process.browser ? localStorage.getItem('token') : null || null,
//   auth_status: false,
//   user: {

//   }
// }

// signup(email: string, username: string, password: string): Promise<Response> {
//   console.log(email, username, password);
//   return new Promise((resolve, reject) => {
//     console.log('promised');
//     fetch('http://127.0.0.1:8000/api/user/auth/register', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json',
//       },
//       body: JSON.stringify({
//         email,
//         username,
//         password,
//       }),
//     })
//       .then(response => {
//         console.log('success', response);
//         resolve(response);
//       })
//       .catch(function (error: any) {
//         console.log('failure', error);
//         reject(error);
//       });
//   });
// }
