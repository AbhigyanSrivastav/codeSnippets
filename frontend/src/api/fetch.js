// const BASE_URL = 'http://localhost:3001'; //local
const BASE_URL = 'http://54.206.69.107:5001'; //production


const createSnippetApi = async (data) => {
  const response = await fetch(BASE_URL + '/snippets', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data) 
  });

  return response.json(); 
};

const fetchSnippetsApi = async () => {
  const response = await fetch(BASE_URL + `/snippets/`, {
    method: 'GET'
  });

  return response.json(); 
};


export { createSnippetApi, fetchSnippetsApi }; 
