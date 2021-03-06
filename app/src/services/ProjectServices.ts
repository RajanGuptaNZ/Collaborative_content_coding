/**
 * The project service encapsulates all backend api calls for performing CRUD operations on project data
 */
export const projectServices = {
    getProjectNames,
    getProjectUsers,
    setProjectUsers
}

function getProjectNames(firebase: any) {
   const requestOptions = {
       method: 'GET',
       headers: { 'Content-Type': 'application/json', 
       "Access-Control-Allow-Origin": "*",
       "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
       "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With" },
   };
   const token = localStorage.getItem('user-token');
   if(firebase.auth.currentUser != null){
    firebase.auth.currentUser.getIdToken().then((idToken: string) =>{
        if(token !== idToken){
            localStorage.setItem('user-token',idToken)
        }
       })
   }else{
    window.location.href = '/auth';
   }

   return fetch(process.env.REACT_APP_API_URL + '/projects/all?id_token=' + localStorage.getItem('user-token'), requestOptions) // TODO:config.apiUrl

       .then(handleResponse)
       .then(data => {
           return data.projects
       })
}

function getProjectUsers(project: string) {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With" }, 
    };
    
    return fetch(process.env.REACT_APP_API_URL + 
        '/projects/' + project + '/users' + '?id_token=' + localStorage.getItem('user-token'), requestOptions)
        .then(handleResponse)
        .then(data => {
            return data.users
        })
 }

 function setProjectUsers(project: string, user: string) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ user })
        };
    
    return fetch(process.env.REACT_APP_API_URL + 
        '/projects/' + project + '/users/add' + '?id_token=' + localStorage.getItem('user-token'), requestOptions)
        .then(handleResponse)
        .then(data => {
            return data.users
        })
 }

function handleResponse(response: { text: () => Promise<any>; ok: any; status: number; statusText: any; }) {
   return response.text().then((text: string) => {
       const data = text && JSON.parse(text);
       if (!response.ok) {
           const error = (data && data.message) || response.statusText;
           return Promise.reject(error);
       }

       return data;
   });
}