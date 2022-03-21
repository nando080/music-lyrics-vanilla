const searchInputEl = document.querySelector('.l-search__input')
const searchButtonEl = document.querySelector('.l-search__button')
const errorMessageContainerEl = document.querySelector('.c-error-message')

const api = 'https://api.lyrics.ovh/'

/* https://api.lyrics.ovh/suggest/led%20zeppelin
https://api.lyrics.ovh/v1/artist/title */


const formatInputValue = value => {
    const formatedValue =
        value
        .toLowerCase()
        .replace(/[áàâãä]/gmi, 'a')
        .replace(/[éèêë]/gmi, 'e')
        .replace(/[íìîï]/gmi, 'i')
        .replace(/[óòôõö]/gmi, 'o')
        .replace(/[úùûü]/gmi, 'u')
        .replace(/ç/gmi, 'c')
        .replace(/ñ/gmi, 'n')
        .replace(/["'!@#$£%¢¨¬&*()_\-+=§`´^~<>,.;:{}\[\]ªº?|\\\/]/gm, '')
        .replace('   ', ' ')
        .replace('  ', ' ')
    return formatedValue
}

const showErrorMessage = searchTerme => {
}

const fetchSongList = async url => {
    const response = await fetch(url)
    const list = await response.json()
    console.log(list)
}

const searchInputHandle = () => {
    const inputValue = searchInputEl.value
    if (inputValue !== '') {
        console.log(formatInputValue(inputValue))
        const url = `${api}suggest/${formatInputValue(inputValue)}`
        fetchSongList(url)
    }
}

searchButtonEl.addEventListener('click', searchInputHandle)

document.addEventListener('keypress', event => {
    if (event.key === 'Enter') {
        searchInputHandle()
    }
})