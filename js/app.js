const searchInputEl = document.querySelector('.l-search__input')
const searchButtonEl = document.querySelector('.l-search__button')

const api = 'https://api.lyrics.ovh/suggest/'

/* https://api.lyrics.ovh/suggest/led%20zeppelin
https://api.lyrics.ovh/v1/artist/title */


//TODO TESTAR FUNÇÃO
const formatInputValue = value => {
    const formatedValue = value
        .toLowerCase()
        .replace(/áàâãä/gi, 'a')
        .replace(/éèêë/gi, 'e')
        .replace(/íìîï/gi, 'i')
        .replace(/óòôõö/gi, 'o')
        .replace(/úùûü/gi, 'u')
        .replace(/ç/gi, 'c')
        .replace(/ñ/gi, 'n')
        .replace(/'"!@#\$%¨&\*\(\)_-\+=§¬¢£`´\^~:;<>,.\?\/\{\}\[\]ªº/gi, '')
    return formatedValue
}

const fetchSongList = async url => {
    const response = await fetch(url)
    const list = await response.json()
    console.log(list)
}

const searchInputHandle = () => {
    const inputValue = searchInputEl.value
    if (inputValue !== '') {
        const url = `${api}suggest/${inputValue}`
        fetchSongList(url)
    }
}

searchButtonEl.addEventListener('click', searchInputHandle)

document.addEventListener('keypress', event => {
    if (event.key === 'Enter') {
        searchInputHandle()
    }
})