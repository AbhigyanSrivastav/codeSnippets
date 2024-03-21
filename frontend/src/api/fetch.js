const BASE_URL = 'http://localhost:3001';

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
