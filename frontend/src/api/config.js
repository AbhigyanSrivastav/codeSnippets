import {createSnippetApi,fetchSnippetsApi} from './fetch';

const createSnippet = async (data) => {
  return await createSnippetApi(data); 
};


const fetchSnippets = async () => {
  return await fetchSnippetsApi(); 
};



export { createSnippet,fetchSnippets };
